# Implementation Plan: Change Password Feature

This plan outlines the steps to implement a "Change Password" functionality for authenticated users.

## 1. Backend Implementation

### 1.1 Auth Controller Update (`controllers/auth.controller.js`)

- Add `changePassword` function:
  - Get `oldPassword` and `newPassword` from `req.body`.
  - Fetch user by ID (from `req.user`).
  - Compare `oldPassword` with the stored hashed password using `bcrypt`.
  - If match, hash `newPassword` and update the user record.

### 1.2 Auth Routes Update (`routes/auth.Route.js`)

- Add `PUT /api/auth/change-password` route.
- Protect it with `authMiddleware`.

## 2. Frontend Implementation

### 2.1 Auth Service Update (`Frontend/src/app/service/authservice/auth.service.ts`)

- Add `changePassword(oldPassword, newPassword)` method.

### 2.2 Change Password UI (Optional or integrated)

- Depending on user preference, we can create a dedicated component or add a modal to the profile/dashboard.

## 3. Verification

- Test using Postman:
  1. Login to get token.
  2. Call `PUT /auth/change-password` with old and new password.
  3. Verify old password no longer works for login.
  4. Verify new password works for login.
