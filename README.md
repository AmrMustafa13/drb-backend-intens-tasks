# DRB Auth Backend (Week 1 & 2)

A comprehensive NestJS backend application implementing authentication and fleet management systems. Built with TypeScript, MongoDB, JWT authentication, role-based access control, and full Arabic/English localization.

## 📋 Current Functionality

### Week 2: Fleet & Vehicle Management Module ✨ NEW
* **Complete Vehicle CRUD Operations**
  * Create vehicle (Admin/Fleet Manager only)
  * Get all vehicles with pagination, filtering, and sorting
  * Get vehicle by ID
  * Update vehicle information (Admin/Fleet Manager only)
  * Delete vehicle (Admin only)
* **Driver Management**
  * Assign driver to vehicle
  * Unassign driver from vehicle
  * Prevent duplicate driver assignments
  * Validate driver existence
* **Advanced Filtering & Search**
  * Filter by vehicle type (car, van, bus, truck, motorcycle)
  * Filter by manufacturer (case-insensitive partial match)
  * Filter by assignment status (assigned/unassigned)
  * Full-text search across plate number, model, and manufacturer
  * Sort by any field (ascending/descending)
  * Pagination with configurable page size
* **Role-Based Access Control**
  * Admin: Full access to all operations
  * Fleet Manager: Can create, update, and assign vehicles
  * Driver: Read-only access
  * User: Read-only access


## 🔧 Requirements

* Node.js 18+ (or supported LTS)
* npm/yarn
* MongoDB (local or remote)
* Create a `.env` in repository root (see example)

## ⚙️ Important Environment Variables (.env)

```env
# Application
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/drb-backend

# JWT Configuration
JWT_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

## 🚀 Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** (see above) or use environment variables

3. **Run in development:**
   ```bash
   npm run start:dev
   ```
   or
   ```bash
   NODE_ENV=development npm run start
   ```

4. App listens on `process.env.PORT || 3000`

5. **Access Swagger Documentation:**
   ```
   http://localhost:3000/api-docs
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Vehicle Management Endpoints (Week 2) ✨ NEW

* **POST /vehicles**
   * Auth: Bearer (Admin/Fleet Manager)
   * Body: `{ "plateNumber", "model", "manufacturer", "year", "type", "simNumber?", "deviceId?", "driverId?" }`
   * Vehicle types: `car`, `van`, `bus`, `truck`, `motorcycle`
   * Returns: Created vehicle with populated driver info

* **GET /vehicles**
   * Auth: Bearer
   * Query params: `page`, `limit`, `type`, `manufacturer`, `assignmentStatus`, `sortBy`, `search`
   * Returns: Paginated list of vehicles
   * Example: `/vehicles?page=1&limit=10&type=car&manufacturer=Toyota&assignmentStatus=assigned&sortBy=-createdAt&search=Camry`

* **GET /vehicles/:id**
   * Auth: Bearer
   * Returns: Vehicle details with populated driver information

* **PATCH /vehicles/:id**
   * Auth: Bearer (Admin/Fleet Manager)
   * Body: Partial vehicle fields (model, manufacturer, year, type, simNumber, deviceId, driverId)
   * Returns: Updated vehicle

* **DELETE /vehicles/:id**
   * Auth: Bearer (Admin only)
   * Returns: Success message with deleted vehicle info

* **PATCH /vehicles/:id/assign-driver**
   * Auth: Bearer (Admin/Fleet Manager)
   * Body: `{ "driverId" }`
   * Returns: Vehicle with assigned driver details

* **PATCH /vehicles/:id/unassign-driver**
   * Auth: Bearer (Admin/Fleet Manager)
   * Returns: Vehicle with driverId set to null

## 👥 User Roles & Permissions ✨ NEW

Roles are assigned in the database. Default role for new users is `"user"`.

**To create an admin user:**
```bash
# 1. Register a user via API
# 2. Update role in MongoDB:
mongosh
use drb-backend
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
exit
```

**Available Roles:**
* `admin` - Full access (CRUD + delete)
* `fleet_manager` - Can create, update, and assign vehicles
* `driver` - Read-only access
* `user` - Read-only access (default)

## 🌍 Language Support (i18n) ✨ NEW

The API supports both English and Arabic.

**Change language using:**

1. **Query Parameter:**
   ```
   GET /vehicles?lang=ar
   ```

2. **Accept-Language Header:**
   ```
   GET /vehicles
   Accept-Language: ar
   ```

3. **Custom Header:**
   ```
   GET /vehicles
   x-lang: ar
   ```


## 🗄️ Database Schemas

### User Schema
```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  password: string (hashed, required),
  name: string (required),
  phone: string (optional),
  role: string (default: 'user'),
  refreshToken: string (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicle Schema ✨ NEW
```typescript
{
  _id: ObjectId,
  plateNumber: string (unique, uppercase, required),
  model: string (required),
  manufacturer: string (required),
  year: number (required, 1900-current+1),
  type: enum (car, van, bus, truck, motorcycle),
  simNumber: string (optional),
  deviceId: string (optional),
  driverId: ObjectId (ref: User, optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Built-in Security Behaviors

* Input validation via class-validator and global ValidationPipe (transform enabled)
* JWT secrets read from .env via ConfigService with development fallbacks
* Mongoose connection via ConfigService
* Password hashing with bcrypt (10 rounds)
* Password complexity requirements (min 8 chars, uppercase, lowercase, number/special)
* Role-based access control via custom guards
* Refresh token rotation and invalidation

## 📝 Validation Notes

* Global ValidationPipe is enabled with `transform: true` (see `src/main.ts`)
* This ensures DTO decorators run and incoming JSON is converted to DTO instances
* Register DTO enforces: email format, password complexity, name minimum length
* Vehicle DTOs enforce: plate number uniqueness, year range, type enum, valid driver IDs

## 🧪 PowerShell-friendly cURL Examples

### Authentication (Week 1)

**Register:**
```powershell
curl --% -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\",\"name\":\"Test User\"}"
```

**Login:**
```powershell
curl --% -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\"}"
```

**Refresh:**
```powershell
curl --% -X POST http://localhost:3000/auth/refresh -H "Content-Type: application/json" -d "{\"refreshToken\":\"<your_refresh_token>\"}"
```

### Vehicle Management (Week 2) ✨ NEW

**Create Vehicle:**
```powershell
curl --% -X POST http://localhost:3000/vehicles -H "Authorization: Bearer <admin_token>" -H "Content-Type: application/json" -d "{\"plateNumber\":\"ABC-1234\",\"model\":\"Camry\",\"manufacturer\":\"Toyota\",\"year\":2023,\"type\":\"car\"}"
```

**Get All Vehicles:**
```powershell
curl -X GET "http://localhost:3000/vehicles?page=1&limit=10" -H "Authorization: Bearer <token>"
```

**Filter by Type:**
```powershell
curl -X GET "http://localhost:3000/vehicles?type=car" -H "Authorization: Bearer <token>"
```

**Search Vehicles:**
```powershell
curl -X GET "http://localhost:3000/vehicles?search=Toyota" -H "Authorization: Bearer <token>"
```

**Assign Driver:**
```powershell
curl --% -X PATCH http://localhost:3000/vehicles/<vehicle_id>/assign-driver -H "Authorization: Bearer <admin_token>" -H "Content-Type: application/json" -d "{\"driverId\":\"<driver_user_id>\"}"
```



## 📁 Project Structure (Relevant Files)

```
src/
├── main.ts                        // bootstrap, global ValidationPipe, i18n
├── app.module.ts                  // ConfigModule + Mongoose + i18n + feature modules
├── auth/                          // Week 1
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   ├── login.dto.ts
│   │   ├── refresh-token.dto.ts
│   │   ├── update-profile.dto.ts
│   │   └── change-password.dto.ts
│   └── guards/
│       └── jwt-auth.guard.ts
├── users/                         // Week 1
│   ├── users.module.ts
│   ├── users.service.ts
│   └── schemas/
│       └── user.schema.ts
├── vehicles/                      // Week 2 
│   ├── vehicles.module.ts
│   ├── vehicles.service.ts
│   ├── vehicles.controller.ts
│   ├── dto/
│   │   ├── create-vehicle.dto.ts
│   │   ├── update-vehicle.dto.ts
│   │   ├── assign-driver.dto.ts
│   │   └── vehicle-query.dto.ts
│   └── schemas/
│       └── vehicle.schema.ts
├── common/                        // Week 2 
│   ├── common.module.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   └── guards/
│       └── roles.guard.ts
└── i18n/                          // Week 2 
    ├── en/
    │   └── translations.json
    └── ar/
        └── translations.json
```

## 📦 Dependencies

### Core Dependencies
* `@nestjs/common`, `@nestjs/core` - NestJS framework
* `@nestjs/mongoose` - MongoDB integration
* `@nestjs/jwt`, `@nestjs/passport` - Authentication
* `@nestjs/swagger` - API documentation
* `@nestjs/config` - Configuration management
* `bcrypt` - Password hashing
* `class-validator`, `class-transformer` - Input validation
* `mongoose` - MongoDB ODM
* `passport-jwt` - JWT strategy
* `nestjs-i18n`  NEW - Internationalization

## Features Checklist

### Week 2: Vehicle Management 
- [x] Create Vehicle (Role-protected)
- [x] Get All Vehicles
- [x] Get Vehicle by ID
- [x] Update Vehicle (Role-protected)
- [x] Delete Vehicle (Admin only)
- [x] Assign Driver
- [x] Unassign Driver
- [x] Pagination
- [x] Filtering (type, manufacturer, status)
- [x] Sorting
- [x] Search functionality
- [x] Role-based access control
- [x] Arabic language support
- [x] Swagger documentation

## Swagger API Documentation

Interactive API documentation available at:
```
http://localhost:3000/api-docs
```

Features:
* Try out all endpoints directly from the browser
* View request/response schemas
* Test authentication with Bearer tokens
* See all available query parameters and filters

