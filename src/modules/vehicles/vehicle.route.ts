import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";



const router = Router();

// Public
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getSingleVehicle);

// Admin Only
router.post("/", auth("admin"), vehicleController.createVehicle);
router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle);

export const vehicleRoutes = router;
