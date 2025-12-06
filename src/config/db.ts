import { Pool } from "pg";

export const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_EU19VTPbIXtm@ep-lively-base-adc2bs5l-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export const initDB = async () => {

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
  console.log("Neon Database Connected");
};