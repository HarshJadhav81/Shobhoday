# Admin Dashboard Architecture

The Shobhoday Admin panel is architected as an isolated, enterprise-grade business management platform built with React, Vite, TailwindCSS, and Lucide React. 
It intentionally breaks away from the storefront's B2C "Fashion Brand" aesthetics, embracing a dense, high-utility, B2B data-management design language.

## 1. Directory Structure

```
admin/
├── src/
│   ├── components/
│   │   └── ui/            # High-reusability components (DataTable, Modal, FormBuilder)
│   ├── layouts/           # Shell templates (AdminLayout, AuthLayout)
│   ├── modules/           # Domain-specific logic, forms, and tables
│   ├── pages/             # Route entry points
│   ├── routes/            # React Router configs and Permission guards
│   ├── services/          # API hooks and axios interceptors
│   ├── store/             # Zustand state management
│   ├── types/             # Shared TypeScript definitions
│   └── utils/             # Formatters, helpers
```

## 2. Core Modules
The architecture prepares placeholders for the following operational sectors:
- **Dashboard**: High-level telemetry, Recharts data visualization.
- **Products**: Manages the Product ↔ ProductVariant hierarchy. Includes complex form builders for handling images, SEO metadata, and dynamic SKU attributes.
- **Inventory**: Multi-warehouse stock tracking, auditing, and transfers.
- **Orders**: Status fulfillment pipelines, historical tracking, returns, and refunds.
- **Customers**: User profiles, point histories, loyalty tier management.
- **Marketing**: Coupons (fixed/percentage), Banners, Blogs.
- **Analytics**: Mocked data trend visualization (Sales, Growth).
- **Settings**: System configurations (Shipping limits, tax slabs, API keys).

## 3. Component Architecture
- **AdminLayout**: The persistent application shell featuring a responsive sidebar, breadcrumbs, user profile dropdown, and notification bell.
- **DataTable**: An enterprise grid supporting search, filtering, export, sorting, and bulk-action selections.
- **FormBuilder**: Future-proof JSON-driven form generation to easily render complex arrays (like media galleries and variants) without massive boilerplate.
- **StatsCard**: Standardized numeric telemetry widget with trend indicators.

## 4. Role-Based Access Control (RBAC)
Refer to the `PERMISSION_MATRIX.md` file in the root of the `admin` directory for the strict authorization logic built into the routing layer.

## 5. Future API Integration Strategy
When connecting to the backend:
1. `axios` instance will be configured in `src/services/api.ts` with interceptors to auto-inject the JWT Bearer token and handle 401 refresh token flows.
2. React Query or Zustand will be used for server state caching.
3. Forms will utilize React Hook Form + Zod for strict validation mirroring the backend.
