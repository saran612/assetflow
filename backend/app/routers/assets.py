from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal
import uuid
import os
import shutil

from app.database import get_db
from app.models import Asset, AssetHistory, Category, Employee
from app.schemas import AssetResponse, AssetDetailResponse
from app.auth import get_current_employee, require_role

router = APIRouter(
    prefix="/assets",
    tags=["Assets"]
)

UPLOAD_DIR = "/workspace/uploads"

@router.post("", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
async def register_asset(
    name: str = Form(...),
    serial_number: str = Form(...),
    category_id: int = Form(...),
    status: str = Form("available"),
    purchase_date: Optional[str] = Form(None),
    cost: Optional[Decimal] = Form(None),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    # Verify serial number uniqueness
    existing_serial = db.query(Asset).filter(Asset.serial_number == serial_number).first()
    if existing_serial:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset with this serial number already exists"
        )
    
    # Verify category exists
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category not found"
        )

    # Parse purchase_date
    parsed_date = None
    if purchase_date:
        try:
            parsed_date = date.fromisoformat(purchase_date)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid purchase_date format. Must be YYYY-MM-DD"
            )

    # Handle file upload
    image_url = None
    if photo:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_ext = os.path.splitext(photo.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        
        image_url = f"/uploads/{unique_filename}"

    # Create Asset
    new_asset = Asset(
        name=name,
        serial_number=serial_number,
        category_id=category_id,
        status=status,
        purchase_date=parsed_date,
        cost=cost,
        image_url=image_url
    )
    db.add(new_asset)
    db.flush()  # to get ID

    # Log registration in history
    history_log = AssetHistory(
        asset_id=new_asset.id,
        action="registered",
        details=f"Asset registered by {current_user.first_name} {current_user.last_name}",
        performed_by_id=current_user.id
    )
    db.add(history_log)
    db.commit()
    db.refresh(new_asset)

    return new_asset


@router.get("", response_model=List[AssetResponse])
def search_assets(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    status: Optional[str] = None,
    employee_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    query = db.query(Asset)
    
    if search:
        query = query.filter(
            or_(
                Asset.name.ilike(f"%{search}%"),
                Asset.serial_number.ilike(f"%{search}%")
            )
        )
    if category_id is not None:
        query = query.filter(Asset.category_id == category_id)
    if status:
        query = query.filter(Asset.status == status)
    if employee_id is not None:
        query = query.filter(Asset.employee_id == employee_id)
        
    return query.all()


@router.get("/{asset_id}", response_model=AssetDetailResponse)
def get_asset_detail(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    # Sort history by timestamp descending
    asset.history = sorted(asset.history, key=lambda x: x.timestamp, reverse=True)
    return asset
