from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Asset, Employee, AssetHistory, Allocation
from app.schemas import AllocationRequest, AssetResponse, AllocationReturnRequest, AllocationResponse
from app.auth import require_role

router = APIRouter(
    prefix="/allocations",
    tags=["Allocations"]
)

@router.get("/overdue", response_model=List[AllocationResponse])
def list_overdue_allocations(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin", "asset_manager", "department_head"]))
):
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    
    overdue = db.query(Allocation).filter(
        Allocation.status == "active",
        Allocation.expected_return_date != None,
        Allocation.expected_return_date < now
    ).all()
    return overdue

@router.post("", response_model=AssetResponse)
def allocate_asset(
    req: AllocationRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin", "asset_manager"]))
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

    # Create Allocation record
    new_allocation = Allocation(
        asset_id=req.asset_id,
        employee_id=req.employee_id,
        expected_return_date=req.expected_return_date,
        allocated_by_id=current_user.id,
        status="active"
    )
    db.add(new_allocation)
    
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

@router.post("/{allocation_id}/return", response_model=AllocationResponse)
def return_asset(
    allocation_id: int,
    req: AllocationReturnRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin", "asset_manager", "department_head"]))
):
    alloc = db.query(Allocation).filter(Allocation.id == allocation_id).first()
    if not alloc:
        raise HTTPException(status_code=404, detail="Allocation not found")
    if alloc.status != "active":
        raise HTTPException(status_code=400, detail="Allocation is not active")

    if current_user.role == "department_head":
        target_employee = db.query(Employee).filter(Employee.id == alloc.employee_id).first()
        if not target_employee or target_employee.department_id != current_user.department_id:
            raise HTTPException(
                status_code=403,
                detail="Department heads can only process returns for employees within their own department"
            )

    # Update allocation
    from datetime import datetime, timezone
    alloc.returned_at = datetime.now(timezone.utc)
    alloc.return_condition_notes = req.condition_notes
    alloc.status = "returned"

    # Clear asset ownership
    asset = db.query(Asset).filter(Asset.id == alloc.asset_id).first()
    if asset:
        asset.employee_id = None
        if asset.status not in ["maintenance", "lost", "retired"]:
            asset.status = "available"

        # Log in AssetHistory
        history_log = AssetHistory(
            asset_id=asset.id,
            employee_id=alloc.employee_id,
            action="returned",
            details=f"Asset returned. Condition: {req.condition_notes}. Processed by {current_user.first_name} {current_user.last_name}",
            performed_by_id=current_user.id
        )
        db.add(history_log)

    db.commit()
    db.refresh(alloc)

    # Log activity
    from app.utils import log_activity
    log_activity(db, current_user.id, "return_asset", f"Asset returned for allocation ID {alloc.id}")

    return alloc
