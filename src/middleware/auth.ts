import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TJwtPayload } from "../types/jwtPayload";

// Protect: Check JWT
export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const [bearer, token] = header.split(" ");
    if (bearer.toLowerCase() !== "bearer" || !token) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as TJwtPayload;

    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: " + err.message
    });
  }
};

// Role-based authorize
export const authorize = (...roles: Array<"admin" | "customer">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
    }

    next();
  };
};
