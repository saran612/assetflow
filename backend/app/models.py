from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)

    employees = relationship("Employee", back_populates="department")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)

    assets = relationship("Asset", back_populates="category")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="employee", nullable=False)  # 'admin' or 'employee'
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    department = relationship("Department", back_populates="employees")
    assets = relationship("Asset", back_populates="employee")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    serial_number = Column(String, unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    status = Column(String, default="available", nullable=False)  # 'available', 'assigned', 'maintenance', 'retired'
    purchase_date = Column(Date, nullable=True)
    cost = Column(Numeric(10, 2), nullable=True)
    image_url = Column(String, nullable=True)

    category = relationship("Category", back_populates="assets")
    employee = relationship("Employee", back_populates="assets")
    history = relationship("AssetHistory", back_populates="asset", cascade="all, delete-orphan")
    transfers = relationship("AssetTransfer", back_populates="asset", cascade="all, delete-orphan")
    bookings = relationship("AssetBooking", back_populates="asset", cascade="all, delete-orphan")
    maintenances = relationship("AssetMaintenance", back_populates="asset", cascade="all, delete-orphan")


class AssetHistory(Base):
    __tablename__ = "asset_histories"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    action = Column(String, nullable=False)  # 'registered', 'allocated', 'transferred', 'returned', 'status_changed'
    details = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    performed_by_id = Column(Integer, ForeignKey("employees.id"), nullable=True)

    asset = relationship("Asset", back_populates="history")
    employee = relationship("Employee", foreign_keys=[employee_id])
    performed_by = relationship("Employee", foreign_keys=[performed_by_id])


class AssetTransfer(Base):
    __tablename__ = "asset_transfers"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    source_employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    target_employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    requested_by_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    status = Column(String, default="pending", nullable=False)  # 'pending', 'approved', 'rejected'
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="transfers")
    source_employee = relationship("Employee", foreign_keys=[source_employee_id])
    target_employee = relationship("Employee", foreign_keys=[target_employee_id])
    requested_by = relationship("Employee", foreign_keys=[requested_by_id])


class AssetBooking(Base):
    __tablename__ = "asset_bookings"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="bookings")
    employee = relationship("Employee")


class AssetMaintenance(Base):
    __tablename__ = "asset_maintenances"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="pending", nullable=False)  # 'pending', 'approved', 'technician_assigned', 'in_progress', 'resolved'
    technician_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    asset = relationship("Asset", back_populates="maintenances")
    requester = relationship("Employee")
