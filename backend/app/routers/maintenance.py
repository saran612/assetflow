from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone

from app.database import get_db
from app.models import Asset, Employee, AssetHistory, AssetMaintenance
from app.schemas import AssetMaintenanceCreate, AssetMaintenanceResponse, TechnicianAssignmentRequest
from app.auth import get_current_employee, require_role

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)

@router.post("", response_model=AssetMaintenanceResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance_request(
    req: AssetMaintenanceCreate,
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

    # 2. Create Request
    new_request = AssetMaintenance(
        asset_id=req.asset_id,
        requester_id=current_user.id,
        description=req.description,
        status="pending"
    )
    db.add(new_request)
    db.flush()

    # 3. Log History
    history_log = AssetHistory(
        asset_id=req.asset_id,
        action="status_changed",
        details=f"Maintenance requested by {current_user.first_name} {current_user.last_name}: {req.description}",
        performed_by_id=current_user.id
    )
    db.add(history_log)
    db.commit()
    db.refresh(new_request)

    from app.utils import log_activity
    log_activity(db, current_user.id, "maintenance_request", f"Requested maintenance for asset ID {new_request.asset_id} (Req ID: {new_request.id})")

    return new_request


@router.post("/{maintenance_id}/approve", response_model=AssetMaintenanceResponse)
def approve_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    mreq = db.query(AssetMaintenance).filter(AssetMaintenance.id == maintenance_id).first()
    if not mreq:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
        
    if mreq.status != "pending":
        raise HTTPException(status_code=400, detail=f"Request is already {mreq.status}")

    mreq.status = "approved"
    
    log = AssetHistory(
        asset_id=mreq.asset_id,
        action="status_changed",
        details="Maintenance request approved",
        performed_by_id=current_user.id
    )
    db.add(log)
    db.commit()
    db.refresh(mreq)

    from app.utils import log_activity
    log_activity(db, current_user.id, "maintenance_approve", f"Approved maintenance request ID {mreq.id}")

    return mreq


@router.post("/{maintenance_id}/assign-technician", response_model=AssetMaintenanceResponse)
def assign_technician(
    maintenance_id: int,
    req: TechnicianAssignmentRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    mreq = db.query(AssetMaintenance).filter(AssetMaintenance.id == maintenance_id).first()
    if not mreq:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
        
    if mreq.status not in ["approved", "technician_assigned"]:
        raise HTTPException(status_code=400, detail="Request must be approved before assigning a technician")

    mreq.status = "technician_assigned"
    mreq.technician_name = req.technician_name
    
    log = AssetHistory(
        asset_id=mreq.asset_id,
        action="status_changed",
        details=f"Technician '{req.technician_name}' assigned to maintenance task",
        performed_by_id=current_user.id
    )
    db.add(log)
    db.commit()
    db.refresh(mreq)

    from app.utils import log_activity
    log_activity(db, current_user.id, "maintenance_assign_technician", f"Assigned technician '{req.technician_name}' to maintenance request ID {mreq.id}")

    return mreq


@router.post("/{maintenance_id}/start", response_model=AssetMaintenanceResponse)
def start_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    mreq = db.query(AssetMaintenance).filter(AssetMaintenance.id == maintenance_id).first()
    if not mreq:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
        
    if mreq.status != "technician_assigned":
        raise HTTPException(status_code=400, detail="Technician must be assigned before starting maintenance")

    mreq.status = "in_progress"
    
    # Flip asset status to maintenance
    asset = db.query(Asset).filter(Asset.id == mreq.asset_id).first()
    if asset:
        asset.status = "maintenance"
        
    log = AssetHistory(
        asset_id=mreq.asset_id,
        action="status_changed",
        details="Maintenance started. Asset status set to 'maintenance'",
        performed_by_id=current_user.id
    )
    db.add(log)
    db.commit()
    db.refresh(mreq)

    from app.utils import log_activity
    log_activity(db, current_user.id, "maintenance_start", f"Started work on maintenance request ID {mreq.id}")

    return mreq


@router.post("/{maintenance_id}/resolve", response_model=AssetMaintenanceResponse)
def resolve_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    mreq = db.query(AssetMaintenance).filter(AssetMaintenance.id == maintenance_id).first()
    if not mreq:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
        
    if mreq.status != "in_progress":
        raise HTTPException(status_code=400, detail="Maintenance must be in progress before resolving")

    mreq.status = "resolved"
    mreq.resolved_at = datetime.now(timezone.utc)
    
    # Flip asset status back to available
    asset = db.query(Asset).filter(Asset.id == mreq.asset_id).first()
    if asset:
        asset.status = "available"
        
    log = AssetHistory(
        asset_id=mreq.asset_id,
        action="status_changed",
        details="Maintenance resolved. Asset status set to 'available'",
        performed_by_id=current_user.id
    )
    db.add(log)
    db.commit()
    db.refresh(mreq)

    from app.utils import log_activity, create_notification
    log_activity(db, current_user.id, "maintenance_resolve", f"Resolved maintenance request ID {mreq.id}")
    create_notification(db, mreq.requester_id, f"Your maintenance request for asset ID {mreq.asset_id} (Req ID: {mreq.id}) has been resolved")

    return mreq


@router.get("", response_model=List[AssetMaintenanceResponse])
def list_maintenances(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    return db.query(AssetMaintenance).all()
