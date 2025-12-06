import { Router } from "express";
import { userController } from "./user.controller";
import { authorize, protect } from "../../middleware/auth";

const router = Router();

// Protect all user routes
router.use(protect);

// Admin only
router.get("/", authorize("admin"), userController.GetAllUsers);

// delete

router.delete("/:userId", authorize("admin"), userController.DeleteUserById);

// Admin Profile handled 
router.put("/:userId", authorize(), userController.UpdateUserById);

export default router;
