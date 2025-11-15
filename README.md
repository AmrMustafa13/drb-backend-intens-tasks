NestJS Authentication API

A complete authentication system built with NestJS, featuring secure access tokens, refresh tokens, role-based access control, and user profile management.
The API uses JWT, bcrypt, and MongoDB to provide a production-ready authentication flow.

🚀 Features
🔐 Authentication

Register new users (with hashing)

Login with email & password

Access Token (1 hour)

Refresh Token (30 days)

Logout (removes refresh token)

Change password

👥 User features

Get profile

Update profile

Role included inside JWT payload

🛡 Security

Hashed refresh tokens

Passport strategies (Local, JWT, Refresh)

Guards for protected routes

Environment variables for secrets

Follows best practices for token handling

📦 Technologies Used

NestJS

TypeScript

MongoDB / Mongoose

JWT (Access + Refresh tokens)

Passport.js

bcrypt

Express

📁 Project Structure

src/
├── auth/
│ ├── dto/
│ ├── guards/
│ ├── strategies/
│ ├── auth.controller.ts
│ ├── auth.service.ts
│ └── auth.module.ts
│
├── users/
│ ├── users.service.ts
│ ├── users.controller.ts
│ └── users.module.ts
│
└── main.ts

⚙️ Environment Variables

Create a .env file:

MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
PORT=3000

🧪 Installation & Running the Project

Install dependencies
npm install

Start development server
npm run start:dev

Server will run at:
http://localhost:3000

🔄 Authentication Flow (Access + Refresh Tokens)
1️⃣ Login

User logs in → receives:

accessToken (valid 1 hour)

refreshToken (valid 30 days)

Refresh token is hashed and stored in DB.

2️⃣ Accessing protected routes

Send header:
Authorization: Bearer <accessToken>

Guard: JwtAuthGuard
Strategy: jwt

3️⃣ Refreshing access token

POST /auth/refresh
Body:
{
"refreshToken": "<your-refresh-token>"
}

Guard: JwtRefreshGuard
Strategy: jwt-refresh

Flow:

Decode refresh token

Find user

Compare hashed refresh token

Issue new access token

4️⃣ Logout

Removes stored refresh token:

POST /auth/logout

📘 API Endpoints
🔐 Auth Routes
Method	Endpoint	Description	Guard
POST	/auth/register	Register new user	None
POST	/auth/login	Login user	LocalAuthGuard
GET	/auth/profile	Get current user	JwtAuthGuard
PATCH	/auth/profile	Update profile	JwtAuthGuard
POST	/auth/refresh	Refresh access token	JwtRefreshGuard
POST	/auth/logout	Logout user	JwtAuthGuard
PATCH	/auth/change-password	Change password	JwtAuthGuard