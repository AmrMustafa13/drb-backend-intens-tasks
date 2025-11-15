# DRB Backend Tasks

## Features

- User registration and login
- JWT-based authentication (Access & Refresh tokens)
- User profile management
- Password change functionality
- Secure cookie-based refresh token storage
- MongoDB database integration
- Swagger API documentation

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd drb-backend-tasks
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Write environment variables based on `.env.example` file

4. **Start MongoDB**

   Make sure MongoDB is running on your machine:

   ```bash
   # If using MongoDB Community Edition
   mongod
   ```

## Running the Application

### Development/Watch Mode

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/docs
```
