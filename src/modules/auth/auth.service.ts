import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TJwtPayload } from "../../types/jwtPayload";

dotenv.config();


// signup
const signup = async (userInfo: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}) => {
  const { name, email, password, phone, role } = userInfo;

  const userExists = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email.toLowerCase()]
  );

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
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  return newUser.rows[0];
};

// signin
const signin = async (email: string, password: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email.toLowerCase()]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const payload: TJwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET as string;

  const token = jwt.sign(payload, secret, {
    expiresIn: "7d",
  });

  return { token, user: payload };
};

export const authService = {
  signup,
  signin,
};
