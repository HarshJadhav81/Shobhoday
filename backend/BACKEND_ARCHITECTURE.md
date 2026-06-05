# Backend Architecture Document

This document outlines the foundational architecture of the Node.js/Express backend established in Phase 4A. It is designed to scale and support multiple client applications (Storefront, Admin Dashboard, Mobile App) without requiring rewrites.

## 1. Folder Structure (Feature-Based)
We are moving away from traditional MVC folders (where all controllers are in one folder) to a **Feature-Based Module** approach.
```
src/modules/
  ├── auth/
  ├── products/
  └── orders/
```
Inside each module, you will eventually find its specific `routes`, `controllers`, `services`, and `models`. This keeps domain logic isolated and highly cohesive. Shared resources live in `src/shared/`, `src/middlewares/`, and `src/utils/`.

## 2. Request Lifecycle
Every incoming HTTP request goes through the following pipeline defined in `src/app.ts`:

1.  **Security Headers (Helmet)**: Injects robust security headers.
2.  **CORS Setup**: Validates the origin of the request.
3.  **Rate Limiting**: Checks if the IP has exceeded request thresholds.
4.  **Logging (Morgan)**: Logs the incoming request details (in dev mode).
5.  **Body Parsing**: Parses JSON payloads (`express.json`) and URL-encoded data, strictly limited to 10kb to prevent payload exhaustion attacks.
6.  **Cookie Parsing**: Parses cookies for potential JWT/Auth token extraction.
7.  **Data Sanitization (MongoSanitize & HPP)**: Strips `$`, `.` from payloads to prevent NoSQL injection, and clears duplicated parameters to prevent parameter pollution.
8.  **Compression**: Compresses the response before sending.
9.  **Router/Controller**: Hits the specific route handler (`GET /health`).
10. **Global Error Handler**: If any middleware or controller throws an error, it is caught here.

## 3. Error Architecture
Error handling is completely centralized to prevent app crashes and ensure consistent API responses.
-   **`AppError` Class (`src/utils/AppError.ts`)**: A custom error class extending the native `Error`. It allows developers to throw errors with specific HTTP status codes and marks them as `isOperational` (distinguishing between expected business logic errors and unexpected bugs).
-   **Global Error Handler (`src/middlewares/errorHandler.ts`)**: Catches all errors. It intercepts specific Mongoose errors (CastError, DuplicateKey, ValidationError) and converts them into user-friendly messages. In development, it includes the stack trace; in production, stack traces are stripped for security.
-   **Uncaught Exceptions & Rejections**: `src/server.ts` explicitly listens for `uncaughtException` and `unhandledRejection`, logs the fatal errors using Winston, and gracefully shuts down the server.

## 4. Logging Architecture
We use a dual-logging system:
-   **Morgan (`src/app.ts`)**: Handles HTTP request logging, passing the output into Winston.
-   **Winston (`src/utils/logger.ts`)**: The core application logger.
    -   It outputs colorized, timestamped logs to the console in development.
    -   It simultaneously writes logs to files: `logs/error.log` (for errors) and `logs/all.log` (for general info/warnings).
    -   The log level automatically shifts based on `NODE_ENV` (debug in dev, warn/error in prod).

## 5. Security Architecture
Built into the core pipeline:
-   **Environment Validation**: `src/config/env.ts` uses Zod to validate `process.env` on startup. If a secret is missing (like `JWT_SECRET`), the app refuses to boot.
-   **No Hardcoded Secrets**: Everything relies on `.env`.
-   **Express-Rate-Limit**: Prevents brute-forcing logins and API spam.
-   **Express-Mongo-Sanitize**: Mutates incoming requests to remove MongoDB operator keys.
-   **Helmet & CORS**: Hardens headers and restricts domain access.
-   **HPP (HTTP Parameter Pollution)**: Prevents query string duplication logic flaws.
