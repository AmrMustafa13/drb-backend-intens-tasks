# DRB Auth Backend (Week 1: Authentication Module)

A small NestJS authentication service used for backend tasks. Implements user registration, login, JWT access + refresh tokens, profile management, and password change with MongoDB (Mongoose). 


## Current functionality
- Register a new user (password hashed with bcrypt)
- Login (returns accessToken + refreshToken)
- Refresh tokens (rotate refresh token)
- Get current user profile (JWT protected)
- Update profile (JWT protected)
- Change password (JWT protected)
- Logout (invalidate refresh token)

Built-in behaviors:
- Input validation via class-validator and global ValidationPipe (transform enabled)
- JWT secrets read from .env via ConfigService with development fallbacks
- Mongoose connection via ConfigService

## Requirements
- Node 18+ (or supported LTS)
- npm/yarn
- MongoDB (local or remote)
- Create a `.env` in repository root (see example)

## Important environment variables (.env)
- MONGODB_URI=mongodb://localhost:27017/drb-auth
- JWT_SECRET=your_access_secret_here
- JWT_REFRESH_SECRET=your_refresh_secret_here
- PORT=3000



## Quick setup
1. Install deps:
   npm install

2. Create `.env` (see above) or use environment variables.

3. Run in development:
   npm run start:dev
   or
   NODE_ENV=development npm run start

4. App listens on `process.env.PORT || 3000`.

## API (brief)
Base URL: http://localhost:3000

- POST /auth/register
  - Body: { "email","password","name", "phone?" }
  - Returns: { user, accessToken, refreshToken }

- POST /auth/login
  - Body: { "email","password" }
  - Returns: { accessToken, refreshToken }

- POST /auth/refresh
  - Body: { "refreshToken" }
  - Returns: { accessToken, refreshToken }

- GET /auth/profile
  - Auth: Bearer <accessToken>
  - Returns: user

- PATCH /auth/profile
  - Auth: Bearer <accessToken>
  - Body: partial profile fields

- PATCH /auth/change-password
  - Auth: Bearer <accessToken>
  - Body: { "currentPassword","newPassword" }

- POST /auth/logout
  - Auth: Bearer <accessToken>

## Validation notes
- Global ValidationPipe is enabled with transform: true (see src/main.ts). This ensures DTO decorators run and incoming JSON is converted to DTO instances.
- Register DTO enforces: email format, password complexity (min 8 chars, uppercase, lowercase, number/special), name minimum length.

## PowerShell-friendly curl examples
Register:
curl --% -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\",\"name\":\"Test User\"}"

Login:
curl --% -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\"}"

Refresh:
curl --% -X POST http://localhost:3000/auth/refresh -H "Content-Type: application/json" -d "{\"refreshToken\":\"<your_refresh_token>\"}"

## Project structure (relevant files)
- src/
  - main.ts               // bootstrap, global ValidationPipe
  - app.module.ts         // ConfigModule + Mongoose (forRootAsync) + feature modules
  - auth/
    - auth.module.ts
    - auth.service.ts
    - auth.controller.ts
    - strategies/
      - jwt.strategy.ts
    - dto/
      - register.dto.ts
      - login.dto.ts
      - refresh-token.dto.ts
      - update-profile.dto.ts
      - change-password.dto.ts
    - guards/
      - jwt-auth.guard.ts
  - users/
    - users.module.ts
    - users.service.ts
    - schemas/
      - user.schema.ts

## 