import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TJwtPayload } from "../../types/jwtPayload";

export const JWT_SECRET = "SUPER_SECRET_VEHICLE_RENTAL_KEY"; // env এ রাখবে

// ---------- SIGNUP ----------
const signup = async (name: string, email: string, password: string, phone: string, role: string) => {
  
  const userExists = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (userExists.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role
    `,
    [name, email, hashedPassword, phone, role]
  );

  return newUser.rows[0];
};

// ---------- SIGNIN ----------
const signin = async (email: string, password: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const payload: TJwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  return { token, user: payload };
};

export const authService = {
  signup,
  signin,
};
