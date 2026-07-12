from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Asset, Employee, AssetHistory
from app.schemas import AllocationRequest, AssetResponse
from app.auth import require_role

router = APIRouter(
    prefix="/allocations",
    tags=["Allocations"]
)

@router.post("", response_model=AssetResponse)
def allocate_asset(
    req: AllocationRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    # 1. Fetch Asset
    asset = db.query(Asset).filter(Asset.id == req.asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    # 2. Fetch Target Employee
    target_employee = db.query(Employee).filter(Employee.id == req.employee_id).first()
    if not target_employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target employee not found"
        )

    # 3. Check Double Allocation (status 'assigned' or employee_id is set)
    if asset.employee_id is not None or asset.status == "assigned":
        holder = db.query(Employee).filter(Employee.id == asset.employee_id).first()
        holder_data = None
        if holder:
            holder_data = {
                "id": holder.id,
                "email": holder.email,
                "first_name": holder.first_name,
                "last_name": holder.last_name,
                "role": holder.role,
                "department_id": holder.department_id
            }
        
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={
                "detail": "Asset is already allocated",
                "current_holder": holder_data
            }
        )

    # 4. Perform Allocation
    asset.employee_id = req.employee_id
    asset.status = "assigned"
    
    # 5. Log in AssetHistory
    history_log = AssetHistory(
        asset_id=asset.id,
        employee_id=req.employee_id,
        action="allocated",
        details=f"Asset allocated to {target_employee.first_name} {target_employee.last_name}",
        performed_by_id=current_user.id
    )
    db.add(history_log)
    db.commit()
    db.refresh(asset)
    
    from app.utils import log_activity, create_notification
    log_activity(db, current_user.id, "allocate_asset", f"Asset '{asset.name}' allocated to employee '{target_employee.email}'")
    create_notification(db, target_employee.id, f"Asset '{asset.name}' (S/N: {asset.serial_number}) has been allocated to you")

    return asset
