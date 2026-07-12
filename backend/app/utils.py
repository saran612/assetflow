from sqlalchemy.orm import Session
from typing import Optional
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
