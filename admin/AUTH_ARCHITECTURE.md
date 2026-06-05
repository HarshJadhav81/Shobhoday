# Authentication Architecture

The Authentication System provides a secure perimeter for the Shobhoday Admin Platform, utilizing a dual-token JWT strategy and Bcrypt for robust password hashing.

## 1. Authentication Flow
1. Admin submits credentials to `POST /api/auth/login`.
2. Backend queries the database, checks if the account is `active` (rejects suspended/deleted accounts).
3. Backend validates the password using `bcrypt.compare`.
4. If valid, generates a short-lived **Access Token** (15m) and a long-lived **Refresh Token** (7d).
5. The `Session` collection creates a new active session entry.
6. The Refresh Token is dispatched as an `HttpOnly`, `Secure`, `SameSite` cookie to prevent XSS.
7. The Access Token is sent in the JSON response payload.

## 2. Refresh Token Flow
1. When the Access Token expires, the frontend calls `POST /api/auth/refresh`.
2. The endpoint reads the `HttpOnly` cookie.
3. It validates the token mathematically via JWT and structurally via the `Session` collection (`isValid === true`).
4. **Token Rotation**: The old Session is marked `isValid = false`, and a new Session/Refresh Token pair is issued alongside a new Access Token.
5. If rotation fails (e.g., token stolen and reused), the system automatically invalidates all active sessions for that user.

## 3. Password Management
- **Forgot Password**: Calls `POST /api/auth/forgot-password`. Generates a 32-byte crypto hex string. Stores a SHA-256 hash of this string in `User.resetPasswordToken` with a 1-hour expiry.
- **Reset Password**: Checks token validity and hashes the new password automatically via the `UserSchema.pre('save')` Mongoose hook.

## 4. Audit & Session Logging
Every authentication event (Login, Logout, Reset Password) is written to the `ActivityLog` collection with IP addresses and user agents. The `Session` collection tracks all active devices, allowing users to "Logout All Devices" if compromised.
