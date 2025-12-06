import { config } from "dotenv";
import { Pool } from "pg";


export const pool = new Pool({
  connectionString: `${config.connectionString}`,
});
export const initDB = async () => {
// user
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15),
        role VARCHAR(100) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
// vehicles
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicles_name VARCHAR(250) NOT NULL,
        type VARCHAR(50) NOT NULL,
        registration_number VARCHAR(100) NOT NULL UNIQUE ,
        daily_rent_price DECIMAL(10, 2) NOT NULL,
        availability_status VARCHAR(50) NOT NULL DEFAULT 'available'
        availability_status VARCHAR(50) NOT NULL DEFAULT 'available'
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    // booking
      await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DElETE CASCADE,
        vehicles_id INT NOT NULL REFERENCES vehicles(id) ON DElETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,  
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active'
        
        )
    `);
  console.log("Neon Database Connected");
};