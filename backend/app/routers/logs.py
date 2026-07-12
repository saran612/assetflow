from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Employee, ActivityLog
from app.schemas import ActivityLogResponse
from app.auth import require_role

router = APIRouter(
    prefix="/logs",
    tags=["Activity Logs"]
)

@router.get("", response_model=List[ActivityLogResponse])
def list_logs(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    return db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).all()
