import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../modules/auth/auth.service";
import { TJwtPayload } from "../types/jwtPayload";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ success: false, message: "No token provided" });

    const [bearer, token] = header.split(" ");
    if (bearer.toLowerCase() !== "bearer" || !token)
      return res.status(401).json({ success: false, message: "Invalid token format" });

    const decoded = jwt.verify(token, JWT_SECRET) as unknown as TJwtPayload;

    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, message: "Unauthorized: " + err.message });
  }
};

// role-based auth
export const authorize = (...roles: Array<"admin" | "customer">) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: "Forbidden" });

    next();
  };
