from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone, timedelta

from app.database import get_db
from app.models import Asset, Employee, AssetHistory, AssetBooking, Notification
from app.schemas import AssetBookingCreate, AssetBookingResponse, AssetBookingReschedule
from app.auth import get_current_employee

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

def compute_display_status(booking) -> str:
    if booking.status == "cancelled":
        return "cancelled"
    now = datetime.now(timezone.utc)
    if now < booking.start_time:
        return "upcoming"
    elif booking.start_time <= now <= booking.end_time:
        return "ongoing"
    else:
        return "completed"

def check_booking_overlap(db: Session, asset_id: int, start_time, end_time, exclude_booking_id: Optional[int] = None):
    query = db.query(AssetBooking).filter(
        AssetBooking.asset_id == asset_id,
        AssetBooking.status != "cancelled",
        AssetBooking.start_time < end_time,
        AssetBooking.end_time > start_time
    )
    if exclude_booking_id is not None:
        query = query.filter(AssetBooking.id != exclude_booking_id)
    return query.first()

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

    # 3. Check Overlap
    conflict = check_booking_overlap(db, req.asset_id, req.start_time, req.end_time)

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
        end_time=req.end_time,
        status="upcoming"
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

    new_booking.status = compute_display_status(new_booking)
    return new_booking

@router.get("", response_model=List[AssetBookingResponse])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    # Process reminders
    now = datetime.now(timezone.utc)
    thirty_mins_later = now + timedelta(minutes=30)
    
    upcoming_bookings = db.query(AssetBooking).filter(
        AssetBooking.status != "cancelled",
        AssetBooking.start_time > now,
        AssetBooking.start_time <= thirty_mins_later
    ).all()
    
    for ub in upcoming_bookings:
        existing = db.query(Notification).filter(
            Notification.employee_id == ub.employee_id,
            Notification.message.like(f"%booking ID {ub.id}%")
        ).first()
        
        if not existing:
            reminder_notif = Notification(
                employee_id=ub.employee_id,
                title="Upcoming Booking Reminder",
                message=f"Reminder: Your booking for asset {ub.asset.name} (booking ID {ub.id}) starts soon at {ub.start_time.strftime('%H:%M')}.",
                is_read=False
            )
            db.add(reminder_notif)
    db.commit()

    bookings = db.query(AssetBooking).all()
    for b in bookings:
        b.status = compute_display_status(b)
    return bookings

@router.patch("/{booking_id}/cancel", response_model=AssetBookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    booking = db.query(AssetBooking).filter(AssetBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    is_creator = booking.employee_id == current_user.id
    is_authorized = current_user.role in ["admin", "asset_manager", "department_head"]
    if not (is_creator or is_authorized):
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    current_status = compute_display_status(booking)
    if current_status == "cancelled":
        raise HTTPException(status_code=400, detail="Booking is already cancelled")
    if current_status == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel a completed booking")

    booking.status = "cancelled"
    
    history_log = AssetHistory(
        asset_id=booking.asset_id,
        employee_id=booking.employee_id,
        action="cancelled",
        details="Booking cancelled",
        performed_by_id=current_user.id
    )
    db.add(history_log)

    notification = Notification(
        employee_id=booking.employee_id,
        title="Booking Cancelled",
        message=f"Your booking for asset {booking.asset.name} (booking ID {booking.id}) was cancelled",
        is_read=False
    )
    db.add(notification)
    db.commit()
    db.refresh(booking)

    from app.utils import log_activity
    log_activity(db, current_user.id, "cancel_booking", f"Booking ID {booking.id} cancelled")

    booking.status = "cancelled"
    return booking

@router.patch("/{booking_id}/reschedule", response_model=AssetBookingResponse)
def reschedule_booking(
    booking_id: int,
    req: AssetBookingReschedule,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    booking = db.query(AssetBooking).filter(AssetBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if req.start_time >= req.end_time:
        raise HTTPException(status_code=400, detail="Start time must be before end time")

    is_creator = booking.employee_id == current_user.id
    is_authorized = current_user.role in ["admin", "asset_manager", "department_head"]
    if not (is_creator or is_authorized):
        raise HTTPException(status_code=403, detail="Not authorized to reschedule this booking")

    current_status = compute_display_status(booking)
    if current_status == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot reschedule a cancelled booking")
    if current_status == "completed":
        raise HTTPException(status_code=400, detail="Cannot reschedule a completed booking")

    conflict = check_booking_overlap(db, booking.asset_id, req.start_time, req.end_time, exclude_booking_id=booking.id)
    if conflict:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={
                "detail": "Asset is already booked during this time",
                "conflicting_booking": {
                    "id": conflict.id,
                    "asset_id": conflict.asset_id,
                    "employee_id": conflict.employee_id,
                    "start_time": conflict.start_time.isoformat(),
                    "end_time": conflict.end_time.isoformat()
                }
            }
        )

    booking.start_time = req.start_time
    booking.end_time = req.end_time
    
    history_log = AssetHistory(
        asset_id=booking.asset_id,
        employee_id=booking.employee_id,
        action="rescheduled",
        details=f"Booking rescheduled to {req.start_time.strftime('%Y-%m-%d %H:%M')} - {req.end_time.strftime('%Y-%m-%d %H:%M')}",
        performed_by_id=current_user.id
    )
    db.add(history_log)
    db.commit()
    db.refresh(booking)

    from app.utils import log_activity
    log_activity(db, current_user.id, "reschedule_booking", f"Booking ID {booking.id} rescheduled")

    booking.status = compute_display_status(booking)
    return booking
