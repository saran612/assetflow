from sqlalchemy.orm import Session
from typing import Optional
from fastapi import HTTPException
from app.models import ActivityLog, Notification

def log_activity(db: Session, employee_id: Optional[int], action: str, details: str):
    log = ActivityLog(
        employee_id=employee_id,
        action=action,
        details=details
    )
    db.add(log)
    db.commit()

def create_notification(db: Session, recipient_id: int, message: str):
    notif = Notification(
        recipient_id=recipient_id,
        message=message,
        status="unread"
    )
    db.add(notif)
    db.commit()


VALID_TRANSITIONS = {
    "available": {"allocated", "reserved", "under_maintenance", "retired", "disposed"},
    "allocated": {"available", "under_maintenance", "lost"},
    "reserved": {"available", "allocated", "under_maintenance"},
    "under_maintenance": {"available", "retired", "disposed"},
    "lost": {"retired", "disposed"},
    "retired": {"disposed"},
    "disposed": set(),  # terminal state
}

def validate_transition(current_status: str, new_status: str):
    if new_status not in VALID_TRANSITIONS.get(current_status, set()):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot transition asset from '{current_status}' to '{new_status}'"
        )
