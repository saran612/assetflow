# AssetFlow 
## Enterprise Asset & Resource Management System

AssetFlow is a modern, responsive, and secure Enterprise Asset & Resource Management System designed to track physical hardware lifecycle states, optimize resource booking, resolve asset allocations, and streamline maintenance workflows.

The system features robust role-based access controls (RBAC) scoping approvals to proper departments, overlap booking checks, dynamic state transition validation, and live notifications.

---

## Tech Stack

| Layer | Technology | Icons / Badges |
|---|---|---|
| **Backend API** | FastAPI, SQLAlchemy | `FastAPI` `SQLAlchemy` `Python` |
| **Database** | PostgreSQL | `PostgreSQL` |
| **Frontend** | React, Vite, Tailwind CSS v4, Lucide Icons | `React` `Vite` `Tailwind CSS v4` `Lucide` |
| **DevOps** | Docker, Docker Compose | `Docker` `Docker Compose` |
| **Deployment** | Vercel (Frontend), Self-Hosted Docker (Backend) | `Vercel` `Docker` |

---

## Architecture & Workflows

### Role-Based Access Control (RBAC)
We enforce 4 distinct roles:
1. **Admin**: Manage organization settings, departments, categories, and promote Employees to managers.
2. **Asset Manager**: Register new assets, manage allocations, and approve maintenance requests.
3. **Department Head**: Approve allocations/transfers and process returns restricted to employees within their department.
4. **Employee**: Request allocations/transfers, raise maintenance tasks, and book shared resources.

### Asset Lifecycle States
Assets move strictly through 7 states:
* `available` -> `allocated` (custody)
* `available` -> `reserved` (booking)
* `available` / `allocated` -> `under_maintenance` (repair)
* `allocated` -> `lost` (audit missing)
* `available` / `allocated` / `under_maintenance` / `lost` -> `retired` (deactivation)
* `retired` -> `disposed` (terminal state)

State transitions are checked against a strict validation matrix on every endpoint.

---

## Setup & Execution

### Frontend (Hosted Online)
The React frontend is deployed and accessible at:
**[https://assetflow-odoo.vercel.app/](https://assetflow-odoo.vercel.app/)**

If you wish to run the frontend locally:
```bash
cd frontend
npm install
npm run dev
```

### Backend & Database (Docker Setup)
Start the entire PostgreSQL database and FastAPI backend local services:
```bash
# Clean volumes and build from scratch
docker-compose down -v
docker-compose up --build -d
```
This automatically seeds the database with the core categories, departments, and 18 default mock assets.

### Seeded Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@assetflow.com` | `adminpassword123` |
| **Asset Manager** | `assetmanager@assetflow.com` | `assetmanagerpassword123` |
| **Department Head** | `depthead@assetflow.com` | `deptheadpassword123` |
| **Employee (Engineer)** | `engineer@assetflow.com` | `engineerpassword123` |
| **Employee (HR)** | `hr@assetflow.com` | `hrpassword123` |

---

## API Endpoint Directory

### Authentication (`/auth`)
* `POST /auth/signup` - Register a new standard Employee account
* `POST /auth/login` - Obtain JWT OAuth2 Access Token
* `GET /auth/me` - Fetch details of currently signed-in user

### Organization Setup (`/org`)
* `POST /org/departments` - Create a department (Admin only)
* `GET /org/departments` - List departments
* `POST /org/categories` - Create asset categories with custom attributes (Admin only)
* `GET /org/categories` - List categories
* `GET /org/employees` - Employee directory list
* `POST /org/promote` - Promote employees to manager roles (Admin only)

### Asset Directory (`/assets`)
* `POST /assets` - Register a new physical asset (Asset Manager / Admin)
* `GET /assets` - Search & filter asset listings
* `GET /assets/{id}` - Fetch asset details + history logs
* `PATCH /assets/{id}/status` - Manually update asset status (Asset Manager / Admin)

### Allocations & Transfers (`/allocations` / `/transfers`)
* `POST /allocations` - Assign an asset to an employee
* `POST /allocations/{id}/return` - Return asset, capture check-in condition notes (Dept Head / Manager / Admin)
* `GET /allocations/overdue` - List all past-due allocations
* `POST /transfers` - Request an asset transfer
* `POST /transfers/{id}/approve` - Approve transfer and update custody (Dept Head / Manager / Admin)
* `POST /transfers/{id}/reject` - Reject transfer (Dept Head / Manager / Admin)

### Bookings (`/bookings`)
* `POST /bookings` - Book shared resources with overlap validation checks
* `GET /bookings` - List existing calendar reservations
* `POST /bookings/{id}/cancel` - Cancel a booking

### Maintenance Management (`/maintenance`)
* `POST /maintenance` - Raise a repair request
* `POST /maintenance/{id}/approve` - Approve request (Asset Manager)
* `POST /maintenance/{id}/assign` - Assign technician (Asset Manager)
* `POST /maintenance/{id}/start` - Mark task in-progress, flips status to `under_maintenance`
* `POST /maintenance/{id}/resolve` - Mark resolved, flips status back to `available`

### Audit Cycles (`/audits`)
* `POST /audits` - Create auditcycle
* `POST /audits/{id}/verify` - Mark items verified/missing/damaged
* `POST /audits/{id}/close` - Close auditcycle, flip missing assets to `lost`

### Dashboard & Reports (`/dashboard` / `/reports`)
* `GET /dashboard/kpis` - Fetch live counts of asset states, cost sums, and overdue items
* `GET /reports/audit-discrepancy` - List missing audit item summaries
* `GET /reports/allocations` - List department/category utilization analytics

### Logs & Notifications (`/notifications` / `/logs`)
* `GET /notifications` - Read unread alerts for signed-in user
* `GET /logs` - Fetch global activity audit logs

---

## Project Structure

```text
assetflow/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       ├── database.py
│       ├── auth.py
│       ├── seed.py
│       ├── utils.py
│       └── routers/
│           ├── auth.py
│           ├── org.py
│           ├── assets.py
│           ├── allocations.py
│           ├── transfers.py
│           ├── bookings.py
│           ├── maintenance.py
│           ├── audits.py
│           ├── dashboard.py
│           ├── reports.py
│           ├── notifications.py
│           └── logs.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   └── Modal.jsx
│       ├── contexts/
│       │   ├── AppContext.jsx
│       │   └── ToastContext.jsx
│       ├── layouts/
│       │   └── DashboardLayout.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── DashboardOverview.jsx
│       │   ├── OrganizationSetup.jsx
│       │   ├── Assets.jsx
│       │   ├── Allocation.jsx
│       │   ├── Booking.jsx
│       │   ├── Maintenance.jsx
│       │   ├── Audit.jsx
│       │   ├── Reports.jsx
│       │   └── Notifications.jsx
│       └── utils/
│           ├── api.js
│           └── hooks.js
└── docs/
    └── system_specifications.md
```

---

## User Profiles & Permissions

### Admin
* Manages departments, asset categories, audit cycles, and employee/role assignment (Organization Setup)
* Views organization-wide analytics

### Asset Manager
* Registers and allocates assets
* Approves transfers, maintenance requests, and audit discrepancy resolution
* Approves asset returns and condition check-in notes

### Department Head
* Views assets allocated to their department
* Approves allocation/transfer requests within their department
* Books shared resources on behalf of the department

### Employee
* Views assets allocated to them
* Books shared resources
* Raises maintenance requests
* Initiates return/transfer requests
