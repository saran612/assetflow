from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
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

class EmployeeSignup(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    department_id: Optional[int] = None

class RolePromotionRequest(BaseModel):
    role: str


# Asset Schemas
class AssetBase(BaseModel):
    name: str
    serial_number: str
    category_id: int
    employee_id: Optional[int] = None
    status: str
    purchase_date: Optional[date] = None
    cost: Optional[Decimal] = None
    image_url: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int

    class Config:
        from_attributes = True


# AssetHistory Schemas
class AssetHistoryResponse(BaseModel):
    id: int
    asset_id: int
    employee_id: Optional[int] = None
    action: str
    details: Optional[str] = None
    timestamp: datetime
    performed_by_id: Optional[int] = None

    class Config:
        from_attributes = True


# AssetDetailResponse
class AssetDetailResponse(AssetResponse):
    category: Optional[CategoryResponse] = None
    employee: Optional[EmployeeResponse] = None
    history: List[AssetHistoryResponse] = []

    class Config:
        from_attributes = True


# Allocation Schemas
class AllocationRequest(BaseModel):
    asset_id: int
    employee_id: int


# Transfer Schemas
class AssetTransferRequest(BaseModel):
    asset_id: int
    target_employee_id: int

class AssetTransferResponse(BaseModel):
    id: int
    asset_id: int
    source_employee_id: Optional[int] = None
    target_employee_id: int
    requested_by_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Booking Schemas
class AssetBookingCreate(BaseModel):
    asset_id: int
    start_time: datetime
    end_time: datetime

class AssetBookingResponse(BaseModel):
    id: int
    asset_id: int
    employee_id: int
    start_time: datetime
    end_time: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# Maintenance Schemas
class AssetMaintenanceCreate(BaseModel):
    asset_id: int
    description: str

class AssetMaintenanceResponse(BaseModel):
    id: int
    asset_id: int
    requester_id: int
    description: str
    status: str
    technician_name: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TechnicianAssignmentRequest(BaseModel):
    technician_name: str
