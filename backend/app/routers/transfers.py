from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Asset, Employee, AssetHistory, AssetTransfer
from app.schemas import AssetTransferRequest, AssetTransferResponse
from app.auth import get_current_employee, require_role

router = APIRouter(
    prefix="/transfers",
    tags=["Transfers"]
)

@router.post("", response_model=AssetTransferResponse, status_code=status.HTTP_201_CREATED)
def request_transfer(
    req: AssetTransferRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    # 1. Fetch Asset
    asset = db.query(Asset).filter(Asset.id == req.asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    # 2. Check if asset is allocated
    if asset.employee_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset is not currently allocated to anyone"
        )
    
    # 3. Fetch Target Employee
    target = db.query(Employee).filter(Employee.id == req.target_employee_id).first()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target employee not found"
        )
        
    # 4. Check if target is same as source
    if asset.employee_id == req.target_employee_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset is already allocated to the target employee"
        )

    # 5. Create Transfer Request
    new_transfer = AssetTransfer(
        asset_id=req.asset_id,
        source_employee_id=asset.employee_id,
        target_employee_id=req.target_employee_id,
        requested_by_id=current_user.id,
        status="pending"
    )
    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)

    from app.utils import log_activity, create_notification
    log_activity(db, current_user.id, "request_transfer", f"Transfer requested for asset ID {new_transfer.asset_id} to employee ID {new_transfer.target_employee_id}")
    create_notification(db, new_transfer.target_employee_id, f"A transfer request has been initiated to assign asset ID {new_transfer.asset_id} to you")

    return new_transfer


@router.post("/{transfer_id}/approve", response_model=AssetTransferResponse)
def approve_transfer(
    transfer_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin", "asset_manager", "department_head"]))
):
    # 1. Fetch Transfer Request
    transfer = db.query(AssetTransfer).filter(AssetTransfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transfer request not found"
        )
        
    if current_user.role == "department_head":
        target_employee = db.query(Employee).filter(Employee.id == transfer.target_employee_id).first()
        if not target_employee or target_employee.department_id != current_user.department_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Department heads can only approve transfers to employees within their own department"
            )

    if transfer.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transfer request is already {transfer.status}"
        )

    # 2. Fetch Asset
    asset = db.query(Asset).filter(Asset.id == transfer.asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated asset not found"
        )

    # 3. Update Asset Ownership
    source_id = asset.employee_id
    asset.employee_id = transfer.target_employee_id
    asset.status = "allocated"

    # 4. Update Transfer Status
    transfer.status = "approved"

    # 5. Fetch names for history log details
    source_emp = db.query(Employee).filter(Employee.id == source_id).first()
    target_emp = db.query(Employee).filter(Employee.id == transfer.target_employee_id).first()
    
    source_name = f"{source_emp.first_name} {source_emp.last_name}" if source_emp else "Unknown"
    target_name = f"{target_emp.first_name} {target_emp.last_name}" if target_emp else "Unknown"

    # 6. Log in History
    history_log = AssetHistory(
        asset_id=asset.id,
        employee_id=transfer.target_employee_id,
        action="transferred",
        details=f"Asset transferred from {source_name} to {target_name}. Approved by {current_user.first_name} {current_user.last_name}",
        performed_by_id=current_user.id
    )
    db.add(history_log)
    db.commit()
    db.refresh(transfer)

    from app.utils import log_activity, create_notification
    log_activity(db, current_user.id, "approve_transfer", f"Approved transfer request ID {transfer.id} for asset '{asset.name}'")
    create_notification(db, transfer.target_employee_id, f"Transfer request for asset '{asset.name}' has been approved. The asset is now assigned to you")
    if transfer.source_employee_id:
        create_notification(db, transfer.source_employee_id, f"Transfer request for asset '{asset.name}' has been approved. The asset is no longer assigned to you")

    return transfer


@router.post("/{transfer_id}/reject", response_model=AssetTransferResponse)
def reject_transfer(
    transfer_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin", "asset_manager", "department_head"]))
):
    # 1. Fetch Transfer Request
    transfer = db.query(AssetTransfer).filter(AssetTransfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transfer request not found"
        )
        
    if current_user.role == "department_head":
        target_employee = db.query(Employee).filter(Employee.id == transfer.target_employee_id).first()
        if not target_employee or target_employee.department_id != current_user.department_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Department heads can only reject transfers to employees within their own department"
            )

    if transfer.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transfer request is already {transfer.status}"
        )

    transfer.status = "rejected"
    db.commit()
    db.refresh(transfer)

    from app.utils import log_activity, create_notification
    log_activity(db, current_user.id, "reject_transfer", f"Rejected transfer request ID {transfer.id}")
    create_notification(db, transfer.requested_by_id, f"Your transfer request for asset ID {transfer.asset_id} has been rejected by administration")

    return transfer
