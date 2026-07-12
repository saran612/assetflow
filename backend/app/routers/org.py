from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Department, Category, Employee
from app.schemas import (
    DepartmentCreate, DepartmentResponse,
    CategoryCreate, CategoryResponse,
    EmployeeResponse, RolePromotionRequest
)
from app.auth import get_current_employee, require_role
from app.utils import log_activity, create_notification

router = APIRouter(
    prefix="/org",
    tags=["Organization"]
)

# --- Departments ---
@router.post("/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(
    dept_in: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    existing = db.query(Department).filter(Department.name == dept_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department already exists"
        )
    new_dept = Department(name=dept_in.name, description=dept_in.description)
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    
    log_activity(db, current_user.id, "create_department", f"Department '{new_dept.name}' created")
    return new_dept

@router.get("/departments", response_model=List[DepartmentResponse])
def list_departments(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    return db.query(Department).all()


# --- Categories ---
@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    existing = db.query(Category).filter(Category.name == cat_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists"
        )
    new_cat = Category(name=cat_in.name, description=cat_in.description)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    
    log_activity(db, current_user.id, "create_category", f"Asset Category '{new_cat.name}' created")
    return new_cat

@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    return db.query(Category).all()


# --- Employees Directory & Promotion ---
@router.get("/employees", response_model=List[EmployeeResponse])
def list_employees(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    return db.query(Employee).all()

@router.put("/employees/{employee_id}/promote", response_model=EmployeeResponse)
def promote_employee(
    employee_id: int,
    promo_in: RolePromotionRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_role(["admin"]))
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Restrict roles to valid options
    if promo_in.role not in ["admin", "employee"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'admin' or 'employee'"
        )

    employee.role = promo_in.role
    db.commit()
    db.refresh(employee)
    
    log_activity(db, current_user.id, "promote_employee", f"Employee '{employee.email}' role updated to '{employee.role}'")
    create_notification(db, employee.id, f"You have been promoted to '{employee.role}' by administrator {current_user.first_name} {current_user.last_name}")
    return employee
