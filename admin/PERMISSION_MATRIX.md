# Enterprise Permission Matrix

The Admin Dashboard relies on a strict Role-Based Access Control (RBAC) system. The UI dynamically renders or hides sidebar links, buttons, and tables based on the active user's permissions.

## Defined Roles
- **Staff**: Limited view-only access to specific modules (e.g., viewing orders, fulfilling stock).
- **Manager**: Department-specific read/write access (e.g., creating products, processing refunds).
- **Admin**: Full access to operational data. Cannot modify system settings or assign roles.
- **SuperAdmin**: Complete system control, including Store Settings, Developer options, and Role Management.

## Permission Mapping

| Module | Action | Staff | Manager | Admin | SuperAdmin |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Dashboard** | `view` | ✅ | ✅ | ✅ | ✅ |
| **Products** | `view` | ✅ | ✅ | ✅ | ✅ |
| | `create/edit` | ❌ | ✅ | ✅ | ✅ |
| | `delete` | ❌ | ❌ | ✅ | ✅ |
| **Categories** | `manage` | ❌ | ✅ | ✅ | ✅ |
| **Inventory** | `view` | ✅ | ✅ | ✅ | ✅ |
| | `update_stock` | ✅ | ✅ | ✅ | ✅ |
| | `manage_warehouses`| ❌ | ❌ | ✅ | ✅ |
| **Orders** | `view` | ✅ | ✅ | ✅ | ✅ |
| | `update_status` | ✅ | ✅ | ✅ | ✅ |
| | `process_refund` | ❌ | ✅ | ✅ | ✅ |
| | `delete` | ❌ | ❌ | ❌ | ✅ |
| **Customers** | `view` | ❌ | ✅ | ✅ | ✅ |
| | `edit_points` | ❌ | ❌ | ✅ | ✅ |
| | `ban/suspend` | ❌ | ❌ | ✅ | ✅ |
| **Coupons** | `manage` | ❌ | ✅ | ✅ | ✅ |
| **Reviews** | `moderate` | ✅ | ✅ | ✅ | ✅ |
| **Blogs & Banners** | `manage` | ❌ | ✅ | ✅ | ✅ |
| **Analytics** | `view` | ❌ | ✅ | ✅ | ✅ |
| **Settings** | `manage_shipping`| ❌ | ❌ | ✅ | ✅ |
| | `manage_payments`| ❌ | ❌ | ❌ | ✅ |
| | `manage_roles` | ❌ | ❌ | ❌ | ✅ |

## Implementation Strategy
In the React application (`admin/src/routes/`), routes will be wrapped with a `<PermissionGuard>` component:
```tsx
<PermissionGuard requiredModule="products" requiredAction="create">
  <ProductFormPage />
</PermissionGuard>
```
If the API returns a 403, or the user lacks the JWT role claim, they are redirected to a safe boundary page.
