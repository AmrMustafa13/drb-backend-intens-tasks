# 🚗 Week 2: Fleet & Vehicle Management Module

A comprehensive vehicle and fleet management system built with NestJS, MongoDB, and JWT authentication. This module provides complete CRUD operations for managing vehicles, driver assignments, and fleet operations with full Arabic localization support.

## ✨ Features

- **Vehicle Management**: Create, read, update, and delete vehicles
- **Driver Assignment**: Assign and unassign drivers to vehicles
- **Advanced Filtering**: Filter vehicles by type, manufacturer, and assignment status
- **Pagination & Sorting**: Efficient data retrieval with pagination support
- **Role-Based Access Control**: Admin and fleet manager permissions
- **JWT Authentication**: Secure API endpoints with token-based authentication
- **Arabic Localization**: Full Arabic language support using nestjs-i18n
- **Swagger Documentation**: Interactive API documentation
- **Input Validation**: Comprehensive DTO validation with class-validator

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Internationalization**: nestjs-i18n

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-forked-repo-url>
   cd drb-backend-internship
   ```

2. **Checkout to week-2 branch**
   ```bash
   git checkout week-2
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration values.

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Server
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d
```

See `.env.example` for a template.

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The application will be available at `http://localhost:3000`

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api
```

### Available Endpoints

#### Vehicle Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/vehicles` | ✅ | admin, fleet_manager | Create a new vehicle |
| GET | `/vehicles` | ✅ | all | Get all vehicles (with pagination/filtering) |
| GET | `/vehicles/:id` | ✅ | all | Get vehicle by ID |
| PATCH | `/vehicles/:id` | ✅ | admin, fleet_manager | Update vehicle |
| DELETE | `/vehicles/:id` | ✅ | admin | Delete vehicle |
| PATCH | `/vehicles/:id/assign-driver` | ✅ | admin, fleet_manager | Assign driver to vehicle |
| PATCH | `/vehicles/:id/unassign-driver` | ✅ | admin, fleet_manager | Unassign driver from vehicle |

### Query Parameters for GET /vehicles

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `type` (string): Filter by vehicle type
- `manufacturer` (string): Filter by manufacturer
- `assigned` (boolean): Filter by driver assignment status
- `sortBy` (string): Field to sort by
- `sortOrder` (string): 'asc' or 'desc'

### Example Requests

**Create Vehicle**
```bash
POST /vehicles
Authorization: Bearer 
Content-Type: application/json

{
  "plateNumber": "ABC123",
  "model": "Camry",
  "manufacturer": "Toyota",
  "year": 2023,
  "type": "car",
  "simNumber": "1234567890",
  "deviceId": "GPS-001",
  "driverId": "507f1f77bcf86cd799439011"
}
```

**Get All Vehicles with Filters**
```bash
GET /vehicles?page=1&limit=10&type=car&assigned=true
Authorization: Bearer 
```

**Assign Driver**
```bash
PATCH /vehicles/:id/assign-driver
Authorization: Bearer 
Content-Type: application/json

{
  "driverId": "507f1f77bcf86cd799439011"
}
```

## 🗄️ Database Schema

### Vehicle Model

```typescript
{
  _id: ObjectId,
  plateNumber: string,      // unique, required
  model: string,            // required
  manufacturer: string,     // required
  year: number,             // required
  type: string,             // required (car, bus, truck, van)
  simNumber: string,        // optional
  deviceId: string,         // optional
  driverId: ObjectId,       // optional, reference to User
  createdAt: Date,          // auto-generated
  updatedAt: Date           // auto-generated
}
```

### Allowed Vehicle Types
- car
- van
- bus
- truck
- motorcycle
- other

## 📁 Project Structure

## 🌍 Internationalization

The application supports both English and Arabic languages using `nestjs-i18n`.

### Language Selection

You can switch languages using:

1. **Accept-Language Header**
   ```bash
   curl -H "Accept-Language: ar" http://localhost:3000/vehicles
   ```

2. **Query Parameter**
   ```bash
   http://localhost:3000/vehicles?lang=ar
   ```

### Translation Files

Translations are stored in:
- `src/i18n/en/messages.json` - English translations
- `src/i18n/ar/messages.json` - Arabic translations

### Example Response in Arabic

```json
{
  "message": "تم إنشاء المركبة بنجاح",
  "data": {
    "plateNumber": "ABC123",
    "model": "كامري",
    "manufacturer": "تويوتا"
  }
}
```

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## 🔒 Security Features

- JWT-based authentication for all endpoints
- Role-based access control (RBAC)
- Input validation and sanitization
- MongoDB injection protection
- Rate limiting (recommended for production)
- CORS configuration
- Helmet security headers

## 🐛 Common Issues & Solutions

### Issue: Cannot connect to MongoDB
**Solution**: Check your `MONGO_URI` in `.env` file and ensure MongoDB is running

### Issue: JWT token expired
**Solution**: Refresh your token or login again

### Issue: Driver already assigned
**Solution**: Unassign the driver from the current vehicle first

## 📝 Development Guidelines

1. Follow NestJS best practices
2. Use DTOs for input validation
3. Keep business logic in services
4. Document all endpoints with Swagger decorators
5. Write meaningful commit messages
6. Add translation keys for all user-facing messages
7. Handle errors gracefully with appropriate HTTP status codes