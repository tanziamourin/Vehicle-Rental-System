# 🚗 Vehicle Rental System API

## 📌 Project Overview

The Vehicle Rental System API is a backend service built with Node.js, TypeScript, Express, and PostgreSQL. It allows users to manage vehicles, customers, and bookings with secure authentication and role-based access control.

### ✨ Features
- JWT-based Authentication
- Role-based Authorization (Admin & Customer)
- Vehicle Management (CRUD)
- Booking System with price calculation
- User Management
- Secure password hashing using bcrypt

---

## 🛠️ Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- bcrypt
- jsonwebtoken

---

## 📁 Project Structure
src/
│
├── modules/
│ ├── auth/
│ ├── users/
│ ├── vehicles/
│ └── bookings/
│
├── middlewares/
├── utils/
├── config/
└── app.ts 

Each module follows:
- routes
- controller
- service

---

## ⚙️ Installation & Setup

### 1. Clone Repository

### 2. Install Dependencies
npm install
### 3. Create .env File
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key

---

## 🗄️ Database Setup

Run the following SQL:
CREATE TABLE users (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
phone TEXT NOT NULL,
role TEXT CHECK (role IN ('admin', 'customer')) NOT NULL
);

CREATE TABLE vehicles (
id SERIAL PRIMARY KEY,
vehicle_name TEXT NOT NULL,
type TEXT CHECK (type IN ('car','bike','van','SUV')),
registration_number TEXT UNIQUE NOT NULL,
daily_rent_price NUMERIC NOT NULL,
availability_status TEXT CHECK (availability_status IN ('available','booked'))
);

CREATE TABLE bookings (
id SERIAL PRIMARY KEY,
customer_id INTEGER REFERENCES users(id),
vehicle_id INTEGER REFERENCES vehicles(id),
rent_start_date DATE NOT NULL,
rent_end_date DATE NOT NULL,
total_price NUMERIC NOT NULL,
status TEXT CHECK (status IN ('active','cancelled','returned'))
);


---

## ▶️ Run the Project

### Development

npm run dev


### Production

npm run build
npm start


---

## 🔐 Authentication

### Signup
POST /api/v1/auth/signup

### Signin
POST /api/v1/auth/signin

Use token in header:

Authorization: Bearer <token>


---

## 🚗 API Endpoints

### Vehicles
- POST /api/v1/vehicles (Admin)
- GET /api/v1/vehicles (Public)
- GET /api/v1/vehicles/:id (Public)
- PUT /api/v1/vehicles/:id (Admin)
- DELETE /api/v1/vehicles/:id (Admin)

### Users
- GET /api/v1/users (Admin)
- PUT /api/v1/users/:id (Admin / Own)
- DELETE /api/v1/users/:id (Admin)

### Bookings
- POST /api/v1/bookings
- GET /api/v1/bookings
- PUT /api/v1/bookings/:id

---

## 🧠 Business Logic

Booking:
- Check vehicle availability
- total_price = daily_rent_price × number_of_days
- Update vehicle status to "booked"

Return:
- Booking status → returned
- Vehicle → available

---

## 🚀 Deployment Notes

- Use cloud PostgreSQL (NOT localhost)
- Set environment variables in Vercel
- Enable SSL for database connection

---

