from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from decimal import Decimal

from app.database import get_db
from app.models import Asset, AssetBooking, Employee
from app.schemas import DashboardKPIsResponse
from app.auth import get_current_employee

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/kpis", response_model=DashboardKPIsResponse)
def get_dashboard_kpis(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    current_time = datetime.now(timezone.utc)

    # 1. Asset state counts
    total_assets = db.query(Asset).count()
    allocated_assets = db.query(Asset).filter(Asset.status == "assigned").count()
    maintenance_assets = db.query(Asset).filter(Asset.status == "maintenance").count()
    available_assets = db.query(Asset).filter(Asset.status == "available").count()
    lost_assets = db.query(Asset).filter(Asset.status == "lost").count()

    # 2. Overdue bookings (end_time < current_time)
    overdue_bookings_count = db.query(AssetBooking).filter(
        AssetBooking.end_time < current_time
    ).count()

    # 3. Sum of all asset costs
    total_cost_query = db.query(func.sum(Asset.cost)).scalar()
    total_cost = Decimal(total_cost_query) if total_cost_query is not None else Decimal("0.00")

    return {
        "total_assets": total_assets,
        "allocated_assets": allocated_assets,
        "maintenance_assets": maintenance_assets,
        "available_assets": available_assets,
        "lost_assets": lost_assets,
        "overdue_bookings_count": overdue_bookings_count,
        "total_cost": total_cost
    }
