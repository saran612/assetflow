from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone

from app.database import get_db
from app.models import Asset, Employee, AssetHistory, AuditCycle, AuditItem
from app.schemas import (
    AuditCycleCreate, AuditCycleResponse, AuditCycleDetailResponse,
    AuditItemVerification, AuditItemResponse
)
from app.auth import get_current_employee, require_role

router = APIRouter(
    prefix="/audits",
    tags=["Audits"]
)

@router.post("/cycles", response_model=AuditCycleDetailResponse, status_code=status.HTTP_201_CREATED)
def create_audit_cycle(
    req: AuditCycleCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    # 1. Create the cycle
    new_cycle = AuditCycle(
        name=req.name,
        start_date=req.start_date,
        end_date=req.end_date,
        status="active"
    )
    db.add(new_cycle)
    db.flush()

    # 2. Query all active assets (not retired, not lost)
    assets = db.query(Asset).filter(
        Asset.status.in_(["available", "assigned", "maintenance"])
    ).all()

    # 3. Create an AuditItem for each asset
    audit_items = []
    for asset in assets:
        item = AuditItem(
            audit_cycle_id=new_cycle.id,
            asset_id=asset.id,
            status="pending"
        )
        db.add(item)
        audit_items.append(item)

    db.commit()
    db.refresh(new_cycle)

    from app.utils import log_activity
    log_activity(db, current_user.id, "create_audit_cycle", f"Audit cycle '{new_cycle.name}' created with {len(assets)} items")

    return new_cycle


@router.get("/cycles", response_model=List[AuditCycleDetailResponse])
def list_audit_cycles(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    return db.query(AuditCycle).all()


@router.get("/cycles/{cycle_id}", response_model=AuditCycleDetailResponse)
def get_audit_cycle(
    cycle_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    cycle = db.query(AuditCycle).filter(AuditCycle.id == cycle_id).first()
    if not cycle:
        raise HTTPException(status_code=404, detail="Audit cycle not found")
    return cycle


@router.post("/items/{item_id}/verify", response_model=AuditItemResponse)
def verify_audit_item(
    item_id: int,
    verification: AuditItemVerification,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin", "asset_manager"]))
):
    # 1. Fetch AuditItem
    item = db.query(AuditItem).filter(AuditItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Audit item not found")

    # 2. Check if cycle is active
    if item.cycle.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot verify items in a closed audit cycle"
        )

    # 3. Validate status
    if verification.status not in ["verified", "missing"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'verified' or 'missing'"
        )

    # 4. Update item status
    item.status = verification.status
    item.notes = verification.notes
    item.verified_at = datetime.now(timezone.utc)
    item.verified_by_id = current_user.id

    # 5. Log History
    details_str = f"Asset audited as '{verification.status}' in cycle '{item.cycle.name}'."
    if verification.notes:
        details_str += f" Notes: {verification.notes}"

    log = AssetHistory(
        asset_id=item.asset_id,
        action="status_changed",
        details=details_str,
        performed_by_id=current_user.id
    )
    db.add(log)
    db.commit()
    db.refresh(item)

    from app.utils import log_activity
    log_activity(db, current_user.id, "verify_audit_item", f"Audit item ID {item.id} verified as '{verification.status}' in cycle '{item.cycle.name}'")

    return item


@router.post("/cycles/{cycle_id}/close", response_model=AuditCycleDetailResponse)
def close_audit_cycle(
    cycle_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    # 1. Fetch cycle
    cycle = db.query(AuditCycle).filter(AuditCycle.id == cycle_id).first()
    if not cycle:
        raise HTTPException(status_code=404, detail="Audit cycle not found")

    if cycle.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audit cycle is already closed"
        )

    # 2. Close the cycle
    cycle.status = "closed"

    # 3. Find all missing items in this cycle
    missing_items = db.query(AuditItem).filter(
        AuditItem.audit_cycle_id == cycle_id,
        AuditItem.status == "missing"
    ).all()

    # 4. Flip their asset status to 'lost'
    for item in missing_items:
        asset = db.query(Asset).filter(Asset.id == item.asset_id).first()
        if asset:
            asset.status = "lost"
            # Log in History
            log = AssetHistory(
                asset_id=asset.id,
                action="status_changed",
                details=f"Asset status flipped to 'lost' because it was marked missing in audit cycle '{cycle.name}'",
                performed_by_id=current_user.id
            )
            db.add(log)
            
            # Send notification to holder
            if asset.employee_id:
                from app.utils import create_notification
                create_notification(db, asset.employee_id, f"Asset '{asset.name}' (S/N: {asset.serial_number}) has been marked as LOST during audit cycle '{cycle.name}'")

    db.commit()
    db.refresh(cycle)

    from app.utils import log_activity
    log_activity(db, current_user.id, "close_audit_cycle", f"Audit cycle '{cycle.name}' closed. Flipped {len(missing_items)} missing items to lost status")
    return cycle
