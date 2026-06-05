# User Management Architecture

## 1. Overview
The User Management module (`admin/src/modules/users/`) allows administrators to manage access to the platform. 

## 2. Admin Users
This interface is distinct from the customer database. Admin Users represent internal staff, contractors, and managers.

### Capabilities:
- **Invite User**: Creates an entity with `accountStatus: 'pending'` and emails a setup link.
- **Suspend / Activate**: Toggles the `accountStatus` field in MongoDB, immediately severing API access via the `requireAuth` middleware.
- **Reset Password**: An administrative override to force a password reset link to an employee.
- **Role Assignment**: Assigning dynamic roles (`Manager`, `Staff`, etc) which propagates through the RBAC engine instantly.

## 3. Security Dashboard
The `SecurityPage` integrates User Management with auditing features:
- **Global Settings**: Toggles for 2FA requirement and Session timeouts.
- **Active Sessions**: A view into the `Session` collection, exposing IPs and Devices.
- **Audit Logs**: A view into the `ActivityLog` collection, ensuring every administrative action (like updating a product or refunding an order) is tied immutably to the staff member who performed it.
