# Frontend-Backend Integration Guide

## Authentication Integration

This guide documents the integration between the React frontend and NestJS backend for user authentication.

### What Was Implemented

1. **API Service Layer** (`src/services/api.js`)
   - Created axios instance with base configuration
   - Added request/response interceptors for JWT token handling
   - Implemented auth API functions (login, register, getProfile)
   - Added automatic token expiration handling

2. **Enhanced AuthContext** (`src/contexts.jsx`)
   - Converted to proper AuthProvider component
   - Added JWT token management
   - Implemented automatic token persistence
   - Added loading states and error handling

3. **Updated Login Component** (`src/components/login.jsx`)
   - Integrated with backend API
   - Added loading states
   - Improved error handling
   - Updated UI text for real authentication

4. **Updated Register Component** (`src/components/register.jsx`)
   - Updated form fields to match backend DTO (firstName, lastName, phone)
   - Integrated with backend API
   - Added loading states
   - Improved error handling

5. **Updated Header Component** (`src/components/Header.jsx`)
   - Fixed user name display to use firstName and lastName from backend

### Backend API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile (protected)

### Data Flow

1. **Login Flow:**
   - User enters email/password
   - Frontend calls `authAPI.login()`
   - Backend validates credentials and returns JWT token + user data
   - Frontend stores token in localStorage
   - User is redirected to home page

2. **Register Flow:**
   - User fills registration form (firstName, lastName, email, password, phone)
   - Frontend calls `authAPI.register()`
   - Backend creates user and returns JWT token + user data
   - Frontend stores token in localStorage
   - User is redirected to home page

3. **Token Management:**
   - JWT tokens are automatically included in API requests
   - Tokens are stored in localStorage
   - Automatic logout on token expiration
   - User state persists across browser sessions

### Environment Setup

Make sure your backend is running on `http://localhost:3000` and your frontend is configured to connect to this URL.

### Testing the Integration

1. Start the backend server:
   ```bash
   cd backend_exte
   npm run start:dev
   ```

2. Start the frontend server:
   ```bash
   cd exte_frontend
   npm run dev
   ```

3. Test registration:
   - Go to `/register`
   - Fill in the form with valid data
   - Submit and verify you're redirected to home page

4. Test login:
   - Go to `/login`
   - Use the credentials from registration
   - Verify you're logged in and redirected

### Error Handling

The integration includes comprehensive error handling:
- Network errors
- Validation errors from backend
- Authentication errors
- Token expiration handling

All errors are displayed to the user with appropriate messages.

### Security Features

- JWT tokens for secure authentication
- Automatic token expiration handling
- Protected routes with token validation
- Secure password hashing on backend
- CORS configuration for frontend-backend communication
