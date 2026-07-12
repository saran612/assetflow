from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Employee
from app.auth import verify_password, create_access_token, get_password_hash, get_current_employee
from app.schemas import Token, EmployeeSignup, EmployeeResponse
from app.utils import log_activity

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def signup(employee_data: EmployeeSignup, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(Employee).filter(Employee.email == employee_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_employee = Employee(
        email=employee_data.email,
        password_hash=get_password_hash(employee_data.password),
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        role="employee",
        department_id=employee_data.department_id,
        is_active=True
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    log_activity(db, new_employee.id, "signup", f"Employee registered: {new_employee.email}")
    return new_employee

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Authenticate employee
    employee = db.query(Employee).filter(Employee.email == form_data.username).first()
    if not employee or not verify_password(form_data.password, employee.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not employee.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": employee.email, "role": employee.role}
    )
    
    log_activity(db, employee.id, "login", f"Employee logged in: {employee.email}")
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=EmployeeResponse)
def get_me(current_employee: Employee = Depends(get_current_employee)):
    return current_employee

