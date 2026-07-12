from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from decimal import Decimal

# Auth Schemas
class LoginRequest(BaseModel):
    username: EmailStr  # We use email as username
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# Department Schemas
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int

    class Config:
        from_attributes = True


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# Employee Schemas
class EmployeeBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    department_id: Optional[int] = None
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    password: str

class EmployeeResponse(EmployeeBase):
    id: int

    class Config:
        from_attributes = True


# Asset Schemas
class AssetBase(BaseModel):
    name: str
    serial_number: str
    category_id: int
    employee_id: Optional[int] = None
    status: str
    purchase_date: Optional[date] = None
    cost: Optional[Decimal] = None

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int

    class Config:
        from_attributes = True
