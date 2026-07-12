from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from app.database import get_db
from app.models import Asset, Employee, AuditCycle, AuditItem, Department, Category
from app.schemas import AuditDiscrepancyReport, AssetResponse
from app.auth import get_current_employee

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/audit-discrepancy", response_model=AuditDiscrepancyReport)
def get_audit_discrepancy_report(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    # 1. Fetch latest audit cycle
    latest_cycle = db.query(AuditCycle).order_by(AuditCycle.id.desc()).first()
    if not latest_cycle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No audit cycles exist yet"
        )

    # 2. Count items by status
    total_items = db.query(AuditItem).filter(AuditItem.audit_cycle_id == latest_cycle.id).count()
    verified_items = db.query(AuditItem).filter(AuditItem.audit_cycle_id == latest_cycle.id, AuditItem.status == "verified").count()
    missing_items = db.query(AuditItem).filter(AuditItem.audit_cycle_id == latest_cycle.id, AuditItem.status == "missing").count()
    pending_items = db.query(AuditItem).filter(AuditItem.audit_cycle_id == latest_cycle.id, AuditItem.status == "pending").count()

    # 3. Retrieve missing assets details
    missing_items_list = db.query(AuditItem).filter(
        AuditItem.audit_cycle_id == latest_cycle.id,
        AuditItem.status == "missing"
    ).all()
    
    missing_assets = []
    for item in missing_items_list:
        asset = db.query(Asset).filter(Asset.id == item.asset_id).first()
        if asset:
            missing_assets.append(asset)

    return {
        "cycle_id": latest_cycle.id,
        "cycle_name": latest_cycle.name,
        "total_items": total_items,
        "verified_items": verified_items,
        "missing_items": missing_items,
        "pending_items": pending_items,
        "missing_assets": missing_assets
    }


@router.get("/allocations", response_model=Dict[str, Any])
def get_allocation_report(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    # 1. Department Breakdown
    departments = db.query(Department).all()
    dept_breakdown = []
    for dept in departments:
        asset_count = db.query(Asset).join(Employee).filter(Employee.department_id == dept.id).count()
        dept_breakdown.append({
            "department_id": dept.id,
            "department_name": dept.name,
            "allocated_assets_count": asset_count
        })

    # 2. Category Breakdown
    categories = db.query(Category).all()
    cat_breakdown = []
    for cat in categories:
        asset_count = db.query(Asset).filter(Asset.category_id == cat.id).count()
        cat_breakdown.append({
            "category_id": cat.id,
            "category_name": cat.name,
            "assets_count": asset_count
        })

    return {
        "departments_breakdown": dept_breakdown,
        "categories_breakdown": cat_breakdown
    }
