# Role Based Access Control (RBAC) Architecture

The RBAC system governs what authenticated users are allowed to do within the Admin Platform. It is entirely database-driven, avoiding hard-coded logic in favor of dynamic arrays.

## 1. Entities
- **Permission**: Granular actions (e.g., `products.view`, `orders.refund`, `inventory.update`).
- **Role**: A named collection of Permissions (e.g., `Staff`, `Manager`, `Admin`, `SuperAdmin`).
- **User**: Assigned an array of ObjectIds referencing Roles.

## 2. Route Protection Flow (Backend Middleware)
1. Request arrives with an Access Token.
2. `requireAuth` middleware decodes the JWT and attaches the `User` object (populated with `roles`).
3. Route specifies `requirePermission('products.create')`.
4. The middleware checks if the user possesses the `SuperAdmin` role. If yes, it bypasses further checks.
5. If not, it iterates over the user's populated roles and cross-references the required permission string against the role's assigned permissions.
6. Support is built-in for wildcard scopes (e.g., if a Role has `products.*`, it satisfies `products.create`).
7. Responds with `403 Forbidden` if missing.

## 3. Frontend Implementation
The frontend dynamically requests the user's permission scopes upon login. Components can use a generic `PermissionGuard` (built in Phase 4C) to wrap UI elements:
```tsx
<PermissionGuard required="products.create">
  <button>Add Product</button>
</PermissionGuard>
```
If the guard fails, the button is hidden, preventing unauthorized interaction before the API even receives a request.
