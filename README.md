# NestJS Authentication API

A complete authentication system built with NestJS, featuring secure access tokens, refresh tokens, role-based access control, and user profile management. The API uses JWT, bcrypt, and MongoDB to provide a production-ready authentication flow.

---

## 🚀 Features

### 🔐 Authentication
- Register new users (with password hashing)
- Login with email & password
- Access Token (7 days)
- Refresh Token (30 days)
- Logout (removes refresh token)
- Change password

### 👥 User Features
- Get profile
- Update profile
- Role included inside JWT payload

### 🛡 Security
- Hashed refresh tokens
- Passport strategies (Local, JWT, Refresh)
- Guards for protected routes
- Environment variables for secrets
- Follows best practices for token handling

---

## 📦 Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **MongoDB / Mongoose** - Database and ODM
- **JWT** - Access + Refresh tokens
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing
- **Express** - HTTP server

---

## 📁 Project Structure
```
src/
├── auth/
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── users/
│   ├── users.service.ts
│   ├── users.controller.ts
│   └── users.module.ts
│
└── main.ts
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
PORT=3000
```

---

## 🧪 Installation & Running the Project

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run start:dev
```

Server will run at: **http://localhost:3000**

---

## 🔄 Authentication Flow (Access + Refresh Tokens)

### 1️⃣ Login
User logs in → receives:
- `accessToken` (valid 7 days)
- `refreshToken` (valid 30 days)

Refresh token is hashed and stored in DB.

### 2️⃣ Accessing Protected Routes
Send header:
```
Authorization: Bearer <accessToken>
```
- **Guard**: `JwtAuthGuard`
- **Strategy**: `jwt`

### 3️⃣ Refreshing Access Token
```http
POST /auth/refresh
```

**Body:**
```json
{
  "refreshToken": "<your-refresh-token>"
}
```

- **Guard**: `JwtRefreshGuard`
- **Strategy**: `jwt-refresh`

**Flow:**
1. Decode refresh token
2. Find user
3. Compare hashed refresh token
4. Issue new access token

### 4️⃣ Logout
Removes stored refresh token:
```http
POST /auth/logout
```

---

## 📘 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| `POST` | `/auth/register` | Register new user | None |
| `POST` | `/auth/login` | Login user | `LocalAuthGuard` |
| `GET` | `/auth/profile` | Get current user | `JwtAuthGuard` |
| `PATCH` | `/auth/profile` | Update profile | `JwtAuthGuard` |
| `POST` | `/auth/refresh` | Refresh access token | `JwtRefreshGuard` |
| `POST` | `/auth/logout` | Logout user | `JwtAuthGuard` |
| `PATCH` | `/auth/change-password` | Change password | `JwtAuthGuard` |

---

## 📝 Example Requests

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <accessToken>
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "<your-refresh-token>"
}
```

---

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ JWT secrets stored in environment variables
- ✅ Token expiration implemented
- ✅ Role-based access control ready
- ✅ Input validation with class-validator
- ✅ Protected routes with guards
