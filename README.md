# AssetFlow Backend API Service

AssetFlow is a containerized Asset Management System API built with FastAPI, SQLAlchemy, PostgreSQL, and JWT authentication.

## Getting Started

### Prerequisites
- Docker
- Docker Compose (v2.x)

### Run the Application

You can start the entire stack (PostgreSQL database + FastAPI API service) using one command in the project root:

```bash
docker-compose up --build
```

This will:
1. Build the API container.
2. Spin up the PostgreSQL service (mapped to host port `5435`).
3. Automatically run schema setup and apply an idempotent database seeding script.
4. Launch the FastAPI app at [http://localhost:8000](http://localhost:8000).

### Seeded Credentials

The database is seeded with default users for testing:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@assetflow.com` | `adminpassword123` |
| Engineer | `engineer@assetflow.com` | `engineerpassword123` |
| HR Manager | `hr@assetflow.com` | `hrpassword123` |

### API Documentation

Once running, interactive API docs are accessible at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Core Features

- **Authentication**: JWT token-based auth endpoints (`/auth/signup`, `/auth/login`, `/auth/me`).
- **Organization Setup**: Create departments, categories, and list employee directories with role promotion.
- **Asset Directory**: Register assets (with image upload/volume mount), filter & search, and view chronological logs.
- **Allocations**: Assign assets to users with double-allocation safety checking (yielding `409 Conflict` containing active holder detail).
- **Transfers**: Request and approve asset transfers between employees.
- **Bookings**: Book assets for specific times with strict time-overlap checking (touching slots allowed).
- **Maintenance**: Structured lifecycle flow (`pending` -> `approved` -> `technician_assigned` -> `in_progress` -> `resolved`) that flips the asset's state.
- **Auditing**: Create cycle checks with auto-generated items, verify items, and automatically flag missing assets as lost upon closing.
- **KPI Dashboard**: View cost sums, state distributions, and overdue warnings dynamically computed on read.
