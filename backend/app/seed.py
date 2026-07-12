from sqlalchemy.orm import Session
from datetime import date
from decimal import Decimal
from app.models import Department, Category, Employee, Asset, Allocation
from app.auth import get_password_hash

def seed_db(db: Session):
    # 1. Seed Departments
    departments_data = [
        {"name": "Engineering", "description": "Software Development and IT Operations"},
        {"name": "Human Resources", "description": "People operations, recruiting, and culture"},
        {"name": "Finance", "description": "Accounting, payroll, and financial planning"},
        {"name": "Operations", "description": "General office operations and logistics"}
    ]
    
    departments = {}
    for dept in departments_data:
        existing = db.query(Department).filter(Department.name == dept["name"]).first()
        if not existing:
            new_dept = Department(name=dept["name"], description=dept["description"])
            db.add(new_dept)
            db.flush()  # to get the ID
            departments[dept["name"]] = new_dept
        else:
            departments[dept["name"]] = existing

    # 2. Seed Categories
    categories_data = [
        {"name": "Laptops", "description": "Workstations, portable computers"},
        {"name": "Monitors", "description": "External displays and screens"},
        {"name": "Phones", "description": "Company smartphones"},
        {"name": "Furniture", "description": "Desks, chairs, and other office furniture"}
    ]
    
    categories = {}
    for cat in categories_data:
        existing = db.query(Category).filter(Category.name == cat["name"]).first()
        if not existing:
            new_cat = Category(name=cat["name"], description=cat["description"])
            db.add(new_cat)
            db.flush()
            categories[cat["name"]] = new_cat
        else:
            categories[cat["name"]] = existing

    # 3. Seed Employees
    employees_data = [
        {
            "email": "admin@assetflow.com",
            "password": "adminpassword123",
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin",
            "department_name": "Operations",
            "is_active": True
        },
        {
            "email": "engineer@assetflow.com",
            "password": "engineerpassword123",
            "first_name": "Jane",
            "last_name": "Doe",
            "role": "employee",
            "department_name": "Engineering",
            "is_active": True
        },
        {
            "email": "hr@assetflow.com",
            "password": "hrpassword123",
            "first_name": "John",
            "last_name": "Smith",
            "role": "employee",
            "department_name": "Human Resources",
            "is_active": True
        },
        {
            "email": "assetmanager@assetflow.com",
            "password": "assetmanagerpassword123",
            "first_name": "Asset",
            "last_name": "Manager",
            "role": "asset_manager",
            "department_name": "Operations",
            "is_active": True
        },
        {
            "email": "depthead@assetflow.com",
            "password": "deptheadpassword123",
            "first_name": "Dept",
            "last_name": "Head",
            "role": "department_head",
            "department_name": "Engineering",
            "is_active": True
        }
    ]
    
    employees = {}
    for emp in employees_data:
        existing = db.query(Employee).filter(Employee.email == emp["email"]).first()
        if not existing:
            dept = departments.get(emp["department_name"])
            new_emp = Employee(
                email=emp["email"],
                password_hash=get_password_hash(emp["password"]),
                first_name=emp["first_name"],
                last_name=emp["last_name"],
                role=emp["role"],
                department_id=dept.id if dept else None,
                is_active=emp["is_active"]
            )
            db.add(new_emp)
            db.flush()
            employees[emp["email"]] = new_emp
        else:
            employees[emp["email"]] = existing

    # 4. Seed Assets
    assets_data = [
        {
            "name": "MacBook Pro 16\"",
            "serial_number": "MBP2026001",
            "category_name": "Laptops",
            "employee_email": "engineer@assetflow.com",
            "status": "assigned",
            "purchase_date": date(2026, 1, 15),
            "cost": Decimal("2499.99")
        },
        {
            "name": "Dell UltraSharp 27\"",
            "serial_number": "DELMON001",
            "category_name": "Monitors",
            "employee_email": "engineer@assetflow.com",
            "status": "assigned",
            "purchase_date": date(2026, 2, 10),
            "cost": Decimal("450.00")
        },
        {
            "name": "iPhone 15 Pro",
            "serial_number": "IPH15P001",
            "category_name": "Phones",
            "employee_email": None,
            "status": "available",
            "purchase_date": date(2026, 3, 5),
            "cost": Decimal("999.00")
        },
        {
            "name": "Ergonomic Office Chair",
            "serial_number": "CHR-ERG-99",
            "category_name": "Furniture",
            "employee_email": "hr@assetflow.com",
            "status": "assigned",
            "purchase_date": date(2026, 4, 1),
            "cost": Decimal("350.00")
        }
    ]

    for asset in assets_data:
        existing = db.query(Asset).filter(Asset.serial_number == asset["serial_number"]).first()
        if not existing:
            cat = categories.get(asset["category_name"])
            emp = employees.get(asset["employee_email"]) if asset["employee_email"] else None
            new_asset = Asset(
                name=asset["name"],
                serial_number=asset["serial_number"],
                category_id=cat.id if cat else None,
                employee_id=emp.id if emp else None,
                status=asset["status"],
                purchase_date=asset["purchase_date"],
                cost=asset["cost"]
            )
            db.add(new_asset)
            db.flush()

            if new_asset.status == "assigned" and new_asset.employee_id:
                import datetime
                if new_asset.serial_number == "DELMON001":
                    expected = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=5)
                else:
                    expected = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30)
                
                alloc = Allocation(
                    asset_id=new_asset.id,
                    employee_id=new_asset.employee_id,
                    expected_return_date=expected,
                    status="active"
                )
                db.add(alloc)

    db.commit()
    print("Database seeding completed successfully.")
