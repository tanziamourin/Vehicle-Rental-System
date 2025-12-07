import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config';

interface MyJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as unknown as MyJwtPayload;

      (req as any).user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  };
};

export default auth;
