# Product API Architecture

## 1. Overview
The Product API acts as the central catalog for the e-commerce system. It supports creating `Products` (which hold base details like title, slug, long description, SEO tags) and multiple `ProductVariants` (which hold SKU, pricing, inventory mappings, color, size).

## 2. Endpoints
| Method | Endpoint | Description | Required Permission |
| ------ | -------- | ----------- | ------------------- |
| POST | `/api/products` | Create Product + Variants | `products.create` |
| GET | `/api/products` | List all Products | `products.view` |
| GET | `/api/products/:id` | Get Product & its Variants| `products.view` |
| PATCH | `/api/products/:id` | Update Product / Variants | `products.edit` |
| DELETE | `/api/products/:id` | Soft-delete Product & Vars| `products.delete` |

## 3. Validation Strategy
All endpoints utilize strict Zod validation. The `ProductController` parses the request payload to ensure it conforms to `productSchema`. 

```typescript
const productSchema = z.object({
  product: z.object({
    title: z.string().min(1),
    slug: z.string(),
    // ...
  }),
  variants: z.array(variantSchema).min(1)
});
```
This guarantees no database interaction occurs unless the payload is structurally valid.

## 4. Audit Logging Strategy
The `AuthService.logActivity` method is triggered within the Controller upon any successful POST, PATCH, or DELETE operation. It captures the user's ID, the IP address, and a contextual string (e.g. `Created product <slug> with <n> variants`).
