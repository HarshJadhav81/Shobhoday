# Product Management System Architecture

The Product Management System within the Shobhoday Admin Dashboard is designed to handle a high-volume, multi-variant, enterprise catalog. The UI architecture maps directly to the MongoDB tri-fold entity structure (`Product` -> `ProductVariant` -> `Inventory`).

## 1. Variant System Architecture
The crown jewel of the system is the **Variant Matrix Generator** (`VariantBuilderTab.tsx`).
- **Data Flow**: Admin defines options (Color, Size) -> React Cartesian Product generation -> Skewed SKUs -> User inline overrides -> Backend array save.
- **Auto Generation**: SKUs are automatically prefixed based on category and color codes (e.g. `OVT-BLK-S`).
- **Bulk Operations**: Modifying Pricing or GST can be applied to 100+ generated variants simultaneously using the bulk operation bar, preventing manual data entry fatigue.

## 2. Inventory Architecture
Inventory is decoupled from the product entity to support future multi-warehouse setups.
- **InventoryDashboardPage**: Displays real-time aggregated metrics across all warehouses. Features a selector for 'Pune Hub', 'Mumbai DC', etc.
- **Alert System**: The DataTable proactively flags variants matching the `reorderLevel` trigger defined in the backend schema as "Low Stock" or "Out of Stock".
- **Product Create (Inventory Tab)**: Defines global rules like "Continue selling when out of stock" and the baseline global reorder level.

## 3. Media Architecture
The `MediaTab` component mirrors the database `ProductVariant.media` schema.
- **Global Media**: A dropzone for general product images.
- **Variant Specific Media**: Images are grouped dynamically by the `Color` option. This allows the storefront UI to immediately swap to the "Navy" image gallery when the user selects the "Navy" swatch.
- **Support**: Prepared for Sort Orders, Alt Texts (SEO), and Video URLs.

## 4. Category Architecture
The `CategoryManagerPage` handles the `Category` ↔ `SubCategory` parent-child relationships using an expandable UI Tree.
- **Tree Visualization**: Renders deep hierarchies (e.g., `Men -> Outerwear -> Hoodies`).
- **Rich Media**: Dedicated fields for Category Thumbnails and Hero Banners to drive localized marketing on category landing pages.
- **SEO**: Full URL slug, Meta Title, and Description controls.

## 5. Future API Mapping
When backend integration begins in a future phase, the frontend state maps cleanly to the API schemas:
1. `POST /api/products` (Consumes BasicInfoTab, SEOTab) -> Returns `productId`.
2. `POST /api/products/:productId/variants/bulk` (Consumes VariantBuilderTab matrix) -> Returns `variantIds`.
3. `POST /api/products/:productId/media` (Consumes MediaTab file buffers via FormData).
4. `POST /api/inventory/initialize` (Consumes InventoryTab triggers).
