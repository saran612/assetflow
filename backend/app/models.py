from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Numeric
from sqlalchemy.orm import relationship
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

    category = relationship("Category", back_populates="assets")
    employee = relationship("Employee", back_populates="assets")
