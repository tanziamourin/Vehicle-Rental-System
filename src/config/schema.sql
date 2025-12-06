-- USERS TABLE (auth module)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'customer'))
);

-- VEHICLES TABLE (your given SQL)
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
  registration_number VARCHAR(100) UNIQUE NOT NULL,
  daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
  availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
);
