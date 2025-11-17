# DRB Backend Internship Tasks

Welcome to the DRB Backend Internship program! This repository contains weekly tasks designed to enhance your backend development skills.

## How to Get Started

1. **Fork this repository** to your GitHub account
2. **Clone your forked repository** to your local machine
3. **Create a branch** named `week-X` (where X is the week number)
4. **Complete the task** on your branch
5. **Push your changes** to your forked repository
6. **Create a Pull Request** back to the main repository when ready for review

---

# ## **Week 2: Fleet & Vehicle Management Module (Nov 15 – Nov 22, 2025)**

Welcome to **Week 2** of the DRB Backend Internship Program!
This week focuses on building the core **Vehicle & Fleet Management** module — the foundation for all tracking, telemetry, and future monitoring features.

---

# 🚗 **Task Overview**

Build a complete **Vehicle Management module** using **NestJS**, **MongoDB**, and **JWT-protected routes**.
This module will allow admins/fleet managers to **create, update, assign drivers, and manage the vehicles**.

---

# 🧰 **Technical Stack**

* **Framework**: NestJS
* **Language**: TypeScript
* **Database**: MongoDB
* **Auth**: JWT (reuse Authentication module from Week 1)

---

# #️⃣ **Required Features**

## **1. Create Vehicle**

**Endpoint:** `POST /vehicles`
**Auth:** Required (role: admin or fleet_manager)

### **Required Fields**

* `plateNumber` (unique)
* `model`
* `manufacturer`
* `year`
* `type` (car, van, bus, truck, etc.)
* `simNumber` (optional – used by GPS device)
* `deviceId` (optional – telematics device)
* `driverId` (optional – assign driver)

### **Validations**

* Plate number must be unique
* Year must be a valid number
* Type must be from allowed list
* Driver must exist if assigned

### **Response**

* Newly created vehicle object

---

## **2. Get All Vehicles**

**Endpoint:** `GET /vehicles`
**Auth:** Required
**Features:**

* Pagination (`limit`, `page`)
* Filtering (type, manufacturer, assigned/unassigned)
* Sorting

---

## **3. Get Vehicle by ID**

**Endpoint:** `GET /vehicles/:id`
**Auth:** Required
**Response:**

* Full vehicle data
* Populated driver info

---

## **4. Update Vehicle**

**Endpoint:** `PATCH /vehicles/:id`
**Auth:** Required

### **Allowed Updates**

* model
* manufacturer
* year
* type
* simNumber
* deviceId
* driverId

### **Response**

* Updated vehicle object

---

## **5. Delete Vehicle**

**Endpoint:** `DELETE /vehicles/:id`
**Auth:** Admin only

### **Response**

* Success message
* Vehicle removed from the database

---

## **6. Assign Driver to Vehicle**

**Endpoint:** `PATCH /vehicles/:id/assign-driver`
**Auth:** Required

### **Required Fields**

* `driverId`

### **Validations**

* Driver exists
* Driver is not assigned to another active vehicle

### **Response**

* Updated vehicle object with assigned driver

---

## **7. Unassign Driver**

**Endpoint:** `PATCH /vehicles/:id/unassign-driver`
**Auth:** Required
**Response:**

* Vehicle with `driverId = null`

---

# 🔐 **Additional Requirements**

### Security

* JWT Guard for all routes
* Role-based protection (admin/fleet_manager only for some actions)
* ValidationPipe + DTOs
* Sanitize inputs

### Code Quality

* NestJS module structure (`vehicles.module.ts`)
* DTOs for create/update
* Service layer handles business logic
* Swagger documentation
* Clean folder structure

### Internationalization (i18n)

* **Arabic Language Support**: Implement full Arabic localization using [nestjs-i18n](https://nestjs-i18n.com/)
* All API responses, error messages, and validation messages must support Arabic
* Support language switching via `Accept-Language` header or query parameter
* Default language: English (`en`)
* Fallback language: Arabic (`ar`)
* Translation files for both Arabic and English

---

# 🗄️ **Database Schema (Mongoose)**

## **Vehicle Model**

```ts
{
  _id: ObjectId,
  plateNumber: string,      // unique
  model: string,
  manufacturer: string,
  year: number,
  type: string,             // car, bus, truck, van...
  simNumber: string,
  deviceId: string,         // GPS device
  driverId: ObjectId,       // reference to User
  createdAt: Date,
  updatedAt: Date
}
```

---

# 📦 **Deliverables**

1. **Complete NestJS Vehicle Management module**
2. All endpoints implemented
3. Swagger API documentation
4. Proper README with setup instructions
5. Meaningful commit history
6. Well-structured DTOs, services, controllers
7. Role-based access implemented
8. **Arabic localization implemented** using nestjs-i18n with translation files

---

# 🚀 Submission

1. Push all code to `week-2` branch in your forked repo
2. Create a Pull Request
3. Add README + notes
4. Tag me when ready for review

---

## Questions?

If you have any questions or need clarification, please reach out to me on WhatsApp.

Good luck! 🚀