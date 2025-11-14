# DRB Backend Internship - Week 1: Authentication Module

This project is the submission for the Week 1 task of the DRB Backend Internship. It is a complete authentication and authorization system built with **NestJS**, **TypeScript**, and **MongoDB**, featuring a secure **JWT** (JSON Web Tokens) implementation with a **Refresh Token** mechanism.

## ✨ Features

* **User Registration:** (`POST /auth/register`) - Securely register new users with email/password validation and `bcrypt` hashing.
* **User Login:** (`POST /auth/login`) - Authenticate users and return an access token and a refresh token.
* **Secure Refresh Token:** The refresh token is sent to the client via a secure, `HttpOnly` cookie to prevent XSS attacks.
* **Get Profile:** (`GET /auth/profile`) - A protected route to fetch the currently authenticated user's profile.
* **Update Profile:** (`PATCH /auth/profile`) - A protected route allowing users to update non-sensitive data (like name and phone).
* **Change Password:** (`PATCH /auth/change-password`) - A protected route for users to change their password after verifying their current one.
* **Refresh Access Token:** (`POST /auth/refresh`) - An endpoint that uses the `HttpOnly` refresh token to issue a new access token.
* **Logout:** (`POST /auth/logout`) - Securely logs a user out by invalidating their refresh token in the database and clearing the cookie.
* **DTO Validation:** Uses `class-validator` and `class-transformer` for all incoming request bodies.
* **Protected Routes:** Implements NestJS Guards (`JwtAuthGuard`, `JwtRefreshGuard`) to protect endpoints.
* **Configuration:** Uses `@nestjs/config` to manage all environment variables.

---

## 🛠️ Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** MongoDB with Mongoose
* **Authentication:** Passport.js (`passport-jwt`, `passport-local`)
* **Security:** `bcrypt` for password hashing
* **Validation:** `class-validator`, `class-transformer`
* **Configuration:** `@nestjs/config` (`.env`)
* **API Documentation:** Swagger

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* A running [MongoDB](https://www.mongodb.com/) instance (local or cloud-based like MongoDB Atlas)
* An API client like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    # Replace with your forked repository URL
    git clone [https://github.com/YOUR_USERNAME/drb-backend-internship.git](https://github.com/YOUR_USERNAME/drb-backend-internship.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd drb-backend-internship
    ```

3.  **Check out the task branch:**
    ```bash
    git checkout week-1
    ```

4.  **Install dependencies:**
    ```bash
    npm install
    ```

5.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. See `.env.example` for a template.

    ```ini
    # .env

    # Application
    NODE_ENV=development
    PORT=3000

    # Database
    # Example: mongodb://localhost:27017/drb-auth-week1
    MONGODB_URI=your_mongodb_connection_string

    # JWT Access Token
    JWT_ACCESS_SECRET=your-super-secret-access-key
    JWT_ACCESS_EXPIES_IN=15m

    # JWT Refresh Token
    JWT_REFRESH_SECRET=your-super-secret-refresh-key
    JWT_REFRESH_EXPIRES_IN=7d
    ```

6.  **Run the application (development mode):**
    ```bash
    npm run start:dev
    ```
    The server will be running at `http://localhost:3000`.

---

## 📚 API Documentation

This project uses **Swagger (OpenAPI)** for API documentation. Once the application is running, you can access the interactive API docs at:

**`http://localhost:3000/api`**

### Endpoints Overview

| Method | Endpoint | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | **None** | Register a new user. |
| `POST` | `/auth/login` | **None** | Log in a user. Returns `accessToken` and sets `refresh_token` cookie. |
| `GET` | `/auth/profile` | **Access Token** | Get the currently logged-in user's profile. |
| `PATCH` | `/auth/profile` | **Access Token** | Update the user's name or phone. |
| `PATCH` | `/auth/change-password` | **Access Token** | Change the user's password. |
| `POST` | `/auth/refresh` | **Refresh Token** | Use the `HttpOnly` cookie to get a new `accessToken`. |
| `POST` | `/auth/logout` | **Access Token** | Log the user out and clear the `HttpOnly` cookie. |

---

## 📝 Submission Notes

*(This is where you would add any notes for the reviewer, as requested in the original task description)*

* **Challenges Faced:** (e.g., "Implementing the `HttpOnly` cookie flow in NestJS required careful configuration of the `res.cookie()` method and the `JwtRefreshStrategy`.")
* **Assumptions Made:** (e.g., "I assumed the 'role' field should default to 'user' upon registration and cannot be set by the user.")
* **Security:** The refresh token is stored in the database as a **hashed** value using `bcrypt` to prevent token hijacking even if the database is compromised. The `logout` endpoint works by nullifying this stored hash.