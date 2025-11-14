# NestJS JWT Authentication Module

This project is a full JWT-based authentication system built with NestJS, TypeScript, and MongoDB.

## Features

- User registration with validation
- Login with JWT access & refresh tokens
- Get current user profile
- Update profile (name, phone)
- Change password
- Refresh access token using refresh token
- Logout
- Password hashing with bcrypt
- JWT token verification with Passport.js
- Swagger API documentation

## Tech Stack

- Framework: NestJS
- Language: TypeScript
- Database: MongoDB
- Authentication: JWT

## Getting Started

### Prerequisites
- Node.js v20+
- MongoDB

### Installation
```bash
git clone https://github.com/AsmaaElawady/drb-backend-intens-tasks.git
npm install
```
## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/nest-auth

JWT_ACCESS_TOKEN_SECRET=verylongaccesssecret_here
JWT_REFRESH_TOKEN_SECRET=verylongrefreshsecret_here

JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

SALT_ROUNDS=12
```

## Running the Project
```bash
npm run start:dev
```

- Swagger docs: http://localhost:3000/api

## Authentication Endpoints

| Endpoint               | Method | Description                   | Auth Required |
|------------------------|--------|-------------------------------|---------------|
| `/auth/register`       | POST   | Register a new user           |  No         |
| `/auth/login`          | POST   | Login and receive tokens      |  No         |
| `/auth/profile`        | GET    | Get logged-in user profile    |  Yes        |
| `/auth/profile`        | PATCH  | Update user profile           |  Yes        |
| `/auth/change-password`| PATCH  | Change user password          |  Yes        |
| `/auth/refresh`        | POST   | Refresh access token          |  No         |
| `/auth/logout`         | POST   | Logout user (invalidate RT)   |  Yes        |
