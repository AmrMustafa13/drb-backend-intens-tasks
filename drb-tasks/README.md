# DRB Backend Internship - Weeks 1 & 2

This repository contains the submissions for the DRB Backend Internship. It is a modular backend application built with **NestJS**, **TypeScript**, and **MongoDB**.

* **Week 1:** Authentication & Authorization Module.
* **Week 2:** Vehicle & Fleet Management Module with Internationalization (i18n).

---

## ✨ Features

### 🔐 Module 1: Authentication (Week 1)
* **User Registration & Login:** Secure flow using `bcrypt` hashing and JWT access/refresh tokens.
* **Secure Refresh Token:** Implemented via `HttpOnly` cookies to prevent XSS.
* **Profile Management:** View profile, update details, and change passwords.
* **Security:** Route guarding with Passport strategies (`jwt`, `jwt-refresh`).

### 🚗 Module 2: Vehicle Management (Week 2)
* **CRUD Operations:** Full Create, Read, Update, and Delete capabilities for fleet vehicles.
* **Advanced Retrieval:** The `GET /vehicles` endpoint supports:
    * **Pagination:** Control page size and number.
    * **Filtering:** Filter by type, manufacturer, and assignment status.
    * **Sorting:** Sort results dynamically.
* **Driver Assignment:** Dedicated endpoints to safely assign and unassign drivers to vehicles, ensuring a driver cannot be assigned to multiple active vehicles simultaneously.
* **Role-Based Access Control (RBAC):** Restricted actions (like Deleting) are protected for `admin` roles only.

### 🌍 Internationalization (i18n)
* **Arabic Support:** The API is fully localized.
* **Language Switching:** Supports `Accept-Language` header.
    * Default: `en` (English)
    * Arabic: Send header `Accept-Language: ar`
* **Scope:** Validation errors, success messages, and exception messages are all translated.

---

## 🛠️ Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** MongoDB with Mongoose
* **Authentication:** Passport.js (JWT, Local Strategy)
* **Localization:** `nestjs-i18n`
* **Validation:** `class-validator`, `class-transformer`
* **Configuration:** `@nestjs/config`
* **Documentation:** Swagger (OpenAPI)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB Instance

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/drb-backend-internship.git](https://github.com/YOUR_USERNAME/drb-backend-internship.git)
    cd drb-backend-internship
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file:
    ```ini
    # Application
    NODE_ENV=development
    PORT=3000

    # Database
    MONGODB_URI=mongodb://localhost:27017/drb-internship

    # JWT Config
    JWT_ACCESS_SECRET=your_access_secret
    JWT_ACCESS_EXPIES_IN=15m
    JWT_REFRESH_SECRET=your_refresh_secret
    JWT_REFRESH_EXPIRES_IN=7d
    ```

4.  **Run the application:**
    ```bash
    npm run start:dev
    ```

---

## 📚 API Documentation

Full interactive documentation is available via Swagger at: **`http://localhost:3000/api`**

### Auth Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user. |
| `POST` | `/auth/login` | Login and receive tokens. |
| `POST` | `/auth/refresh` | Refresh access token via cookie. |
| `GET` | `/auth/profile` | Get current user profile. |

### Vehicle Endpoints
| Method | Endpoint | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/vehicles` | Admin/Manager | Create a new vehicle. |
| `GET` | `/vehicles` | Authenticated | Get all vehicles (w/ pagination & filters). |
| `GET` | `/vehicles/:id` | Authenticated | Get specific vehicle details. |
| `PATCH` | `/vehicles/:id` | Authenticated | Update vehicle details. |
| `DELETE` | `/vehicles/:id` | **Admin Only** | Permanently delete a vehicle. |
| `PATCH` | `/vehicles/:id/assign-driver` | Authenticated | Assign a driver (checks availability). |
| `PATCH` | `/vehicles/:id/unassign-driver`| Authenticated | Remove a driver from a vehicle. |

---
