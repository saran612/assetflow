from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Asset, Employee, AssetHistory, AssetBooking
from app.schemas import AssetBookingCreate, AssetBookingResponse
from app.auth import get_current_employee

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

@router.post("", response_model=AssetBookingResponse)
def create_booking(
    req: AssetBookingCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    # 1. Validate times
    if req.start_time >= req.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time"
        )

    # 2. Check asset existence
    asset = db.query(Asset).filter(Asset.id == req.asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )

    # 3. Check Overlap (allow touching slots: start_time < req.end_time AND end_time > req.start_time)
    conflict = db.query(AssetBooking).filter(
        AssetBooking.asset_id == req.asset_id,
        AssetBooking.start_time < req.end_time,
        AssetBooking.end_time > req.start_time
    ).first()

    if conflict:
        conflict_data = {
            "id": conflict.id,
            "asset_id": conflict.asset_id,
            "employee_id": conflict.employee_id,
            "start_time": conflict.start_time.isoformat(),
            "end_time": conflict.end_time.isoformat(),
            "created_at": conflict.created_at.isoformat()
        }
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={
                "detail": "Asset is already booked during this time",
                "conflicting_booking": conflict_data
            }
        )

    # 4. Save Booking
    new_booking = AssetBooking(
        asset_id=req.asset_id,
        employee_id=current_user.id,
        start_time=req.start_time,
        end_time=req.end_time
    )
    db.add(new_booking)
    db.flush()

    # 5. Log in History
    history_log = AssetHistory(
        asset_id=req.asset_id,
        employee_id=current_user.id,
        action="booked",
        details=f"Asset booked from {req.start_time.strftime('%Y-%m-%d %H:%M')} to {req.end_time.strftime('%Y-%m-%d %H:%M')}",
        performed_by_id=current_user.id
    )
    db.add(history_log)
    db.commit()
    db.refresh(new_booking)

    from app.utils import log_activity
    log_activity(db, current_user.id, "create_booking", f"Asset ID {new_booking.asset_id} booked from {new_booking.start_time.strftime('%Y-%m-%d %H:%M')} to {new_booking.end_time.strftime('%Y-%m-%d %H:%M')}")

    return new_booking


@router.get("", response_model=List[AssetBookingResponse])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    return db.query(AssetBooking).all()
