import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";


const router = Router();


// Admin only
router.get("/", auth("admin"), userController.GetAllUsers);
router.delete("/:userId", auth("admin"), userController.DeleteUserById);
router.put("/:userId", auth(), userController.UpdateUserById);

export const userRouter = router;
