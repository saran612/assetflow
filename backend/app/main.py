from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base, SessionLocal
from app.seed import seed_db
from app.routers import auth
from app.auth import get_current_employee
from app.models import Employee
from app.schemas import EmployeeResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AssetFlow API", "docs": "/docs"}

@app.get("/users/me", response_model=EmployeeResponse)
def get_me(current_employee: Employee = Depends(get_current_employee)):
    return current_employee
