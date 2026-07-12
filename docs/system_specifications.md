# AssetFlow System Specifications

This document outlines the features and workflows of the AssetFlow Enterprise Asset & Resource Management System.

---

## 1. Login / Signup Screen
* **Purpose**: Authenticate users with realistic, non-self-elevating account creation.
* **Key Functionality/Components**:
  * Signup creates an Employee account only (no role selection at signup).
  * Admin creates/promotes Department Heads and Asset Managers from the Employee Directory (see Screen 3).
  * Email & password login, forgot password, session validation.

---

## 2. Dashboard / Home Screen
* **Purpose**: Give every role a real-time operational snapshot.
* **Key Functionality/Components**:
  * KPI cards: Assets Available, Assets Allocated, Maintenance Today, Active Bookings, Pending Transfers, Upcoming Returns.
  * Overdue returns (past Expected Return Date) highlighted separately from upcoming ones.
  * Quick actions: Register Asset, Book Resource, Raise Maintenance Request.

---

## 3. Organization Setup Screen (Admin only - 3 tabs)
* **Purpose**: Maintain the master data everything else depends on.
* **Tab A - Department Management**:
  * Create/edit/deactivate department.
  * Assign Department Head, optional Parent Department (for hierarchy), Status (Active/Inactive).
* **Tab B - Asset Category Management**:
  * Create/edit categories (Electronics, Furniture, Vehicles, etc.).
  * Optional category-specific fields (e.g. warranty period for Electronics).
* **Tab C - Employee Directory**:
  * Name, Email, Department, Role, Status (Active/Inactive).
  * Admin promotes an Employee to Department Head or Asset Manager here (this is the only place roles are assigned).

---

## 4. Asset Registration & Directory Screen
* **Purpose**: Register assets and search/track them centrally.
* **Key Functionality/Components**:
  * **Register**: Name, Category (from Screen 3), auto-generated Asset Tag (e.g. AF-0001), Serial Number, Acquisition Date, Acquisition Cost (kept for ranking/reports only, not linked to accounting), Condition, Location, photo/documents, "shared/bookable" flag.
  * **Search/filter** by Asset Tag, Serial Number, QR code, category, status, department, or location.
  * **Lifecycle status** shown per asset: Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed.
  * **Per-asset history**: allocation history + maintenance history.

---

## 5. Asset Allocation & Transfer Screen
* **Purpose**: Manage who holds what, with explicit conflict rules.
* **Key Functionality/Components**:
  * Allocate asset to employee/department with optional Expected Return Date.
  * **Conflict rule**: You can't allocate an asset that's already taken. Example: Priya has Laptop AF-0114. If Raj tries to allocate it too, the system blocks it, shows him 'currently held by Priya,' and offers a Transfer Request button instead.
  * **Transfer workflow**: Requested $\rightarrow$ Approved (by Asset Manager/Department Head) $\rightarrow$ Re-allocated (history updated automatically).
  * **Return flow**: mark returned, capture condition check-in notes, asset status reverts to Available.
  * **Overdue allocations** (past Expected Return Date) are auto-flagged and feed the Dashboard + Notifications.

---

## 6. Resource Booking Screen
* **Purpose**: Time-slot booking of shared resources with no overlaps.
* **Key Functionality/Components**:
  * Calendar view of a resource's existing bookings.
  * **Overlap validation**: Two people can't book the same room at overlapping times. Example: Room B2 is booked 9:00–10:00. A request for 9:30–10:30 gets rejected since it overlaps; a request for 10:00–11:00 is fine since it starts right after.
  * **Booking status**: Upcoming, Ongoing, Completed, Cancelled.
  * Cancel/reschedule; reminder notification before the slot starts.

---

## 7. Maintenance Management Screen
* **Purpose**: Route repairs through approval before work starts.
* **Key Functionality/Components**:
  * **Raise request**: select asset, describe issue, set priority, attach photo.
  * **Workflow**: Pending $\rightarrow$ Approved / Rejected (by Asset Manager) $\rightarrow$ Technician Assigned $\rightarrow$ In Progress $\rightarrow$ Resolved.
  * **Asset status** auto-updates to Under Maintenance on approval and back to Available on resolution.
  * Maintenance history retained per asset.

---

## 8. Asset Audit Screen
* **Purpose**: Run structured verification cycles instead of a single form.
* **Key Functionality/Components**:
  * Create an Audit Cycle (scope: department/location, date range).
  * Assign one or more auditors to the cycle.
  * Auditor marks each asset: Verified / Missing / Damaged.
  * System auto-generates a discrepancy report for flagged items.
  * **Close Audit Cycle** — locks the cycle and updates affected asset statuses (e.g. Lost for confirmed-missing items).
  * Audit history retained per cycle.

---

## 9. Reports & Analytics Screen
* **Purpose**: Give managers actionable operational insight.
* **Key Functionality/Components**:
  * Asset utilization trends; most-used vs. idle assets.
  * Maintenance frequency by asset/category.
  * Assets due for maintenance or nearing retirement.
  * Department-wise allocation summary.
  * Resource booking heatmap (peak usage windows).
  * Exportable reports.

---

## 10. Activity Logs & Notifications Screen
* **Purpose**: Keep every role informed without digging for updates.
* **Key Functionality/Components**:
  * **Notification examples**: Asset Assigned, Maintenance Approved/Rejected, Booking Confirmed/Cancelled/Reminder, Transfer Approved, Overdue Return Alert, Audit Discrepancy Flagged.
  * Full audit log of admin/manager/employee actions (who did what, when).
