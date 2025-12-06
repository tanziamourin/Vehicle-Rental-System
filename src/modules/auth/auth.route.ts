/**
 *  requirement:
 * POST /api/v1/auth/signup
 * POST /api/v1/auth/signin
 */

import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

export const authRoute = router;
