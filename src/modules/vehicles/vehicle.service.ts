import { pool } from "../../config/db";
// create
const createVehicle = async (payload: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price } = payload;

  const existReg = await pool.query(
    `SELECT * FROM vehicles WHERE registration_number=$1`,
    [registration_number]
  );
  if (existReg.rows.length > 0) {
    throw new Error("Registration number already exists");
  }

  const result = await pool.query(
    `
      INSERT INTO vehicles (
        vehicle_name, type, registration_number, daily_rent_price, availability_status
      )
      VALUES ($1, $2, $3, $4, 'available')
      RETURNING *
    `,
    [vehicle_name, type, registration_number, daily_rent_price]
  );

  return result.rows[0];
};
// get all
const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id DESC`);
  return result.rows;
};
// get single one
const getSingleVehicle = async (vehicleId: number) => {
  const result = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1`,
    [vehicleId]
  );

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};
// update
const updateVehicle = async (vehicleId: number, payload: any) => {
  const fields = Object.keys(payload);
  const values = Object.values(payload);

  if (fields.length === 0) throw new Error("No fields to update");

  let query = "UPDATE vehicles SET ";
  const updates = fields.map((field, i) => `${field}=$${i + 1}`).join(", ");
  query += updates + ` WHERE id=$${fields.length + 1} RETURNING *`;

  const result = await pool.query(query, [...values, vehicleId]);

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};
// delete
const deleteVehicle = async (vehicleId: number) => {

  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [vehicleId]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id=$1 RETURNING *`,
    [vehicleId]
  );

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
