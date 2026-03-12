# Implementation Plan: JWT Authentication System

This plan outlines the steps to implement a complete JWT-based authentication system for the Attendance application, including backend APIs and frontend integration.

## 1. Backend Implementation (Express + Sequelize)

### 1.1 Dependencies

- Install required packages:
  - `jsonwebtoken`: For creating and verifying JWTs.
  - `bcryptjs`: For hashing passwords.
  - `dotenv`: For environment variable management (JWT secrets).

### 1.2 Database & Models

- Create `User` model (`models/userModel.js`):
  - `id` (Primary Key, Auto-increment)
  - `username` (String, Unique, Required)
  - `email` (String, Unique, Required)
  - `password` (String, Required - Hashed)
  - `role` (String, default: 'teacher')

### 1.3 Authentication Logic

- Create `auth.controller.js` (`controllers/auth.controller.js`):
  - `register`: Hash password and save new user.
  - `login`: Check username/password, generate JWT.
  - `getProfile`: Return current user info (protected).

### 1.4 Routes

- Create `auth.Route.js` (`routes/auth.Route.js`):
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me` (Protected)
- Register routes in `app.js`.

### 1.5 Middleware

- Create `authMiddleware.js` (`middleware/authMiddleware.js`):
  - Extract token from headers.
  - Verify token using `jsonwebtoken`.
  - Attach user info to `req.user`.

## 2. Frontend Implementation (Angular)

### 2.1 Authentication Service

- Create `auth.service.ts` (`Frontend/src/app/service/auth.service.ts`):
  - `login(username, password)`: Call login API, store token in `localStorage`.
  - `logout()`: Clear token.
  - `isLoggedIn()`: Check if token exists/valid.
  - `getToken()`: Retrieve token.

### 2.2 Login Component

- Update `login.ts`:
  - Implement form submission.
  - Handle success (navigate to dashboard) and error (show message).
- Update `login.html`:
  - Add login form with fields for username and password.

### 2.3 HTTP Interceptor

- Create `auth.interceptor.ts`:
  - Automatically add JWT token to all outgoing API requests.

### 2.4 Route Guard

- Create `auth.guard.ts`:
  - Protect specific routes (e.g., student info, dashboard) from unauthorized access.

## 3. Verification & Testing

- Test registration and login flow using Postman/CURL.
- Verify JWT verification middleware on protected routes.
- Verify frontend navigation based on auth status.
