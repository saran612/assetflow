from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base, SessionLocal
from app.seed import seed_db
from fastapi.staticfiles import StaticFiles
import os
from app.routers import auth, org, assets, allocations, transfers, bookings, maintenance, audits, dashboard, reports, notifications, logs
from app.auth import get_current_employee
from app.models import Employee
from app.schemas import EmployeeResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure uploads directory exists inside container
    os.makedirs("/workspace/uploads", exist_ok=True)
    
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    
    # Run idempotent seed script
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()
    
    yield

app = FastAPI(
    title="AssetFlow API",
    description="Asset Management System API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads directory
app.mount("/uploads", StaticFiles(directory="/workspace/uploads"), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(org.router)
app.include_router(assets.router)
app.include_router(allocations.router)
app.include_router(transfers.router)
app.include_router(bookings.router)
app.include_router(maintenance.router)
app.include_router(audits.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(notifications.router)
app.include_router(logs.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AssetFlow API", "docs": "/docs"}

@app.get("/users/me", response_model=EmployeeResponse)
def get_me(current_employee: Employee = Depends(get_current_employee)):
    return current_employee

