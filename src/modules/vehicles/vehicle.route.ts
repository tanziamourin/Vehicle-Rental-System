import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { authorize, protect } from "../../middleware/auth";
// import { protect, authorize } from "../../middlewares/auth";

const router = Router();

// Public
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getSingleVehicle);

// Admin Only
router.post("/", protect, authorize("admin"), vehicleController.createVehicle);
router.put("/:vehicleId", protect, authorize("admin"), vehicleController.updateVehicle);
router.delete("/:vehicleId", protect, authorize("admin"), vehicleController.deleteVehicle);

export const vehicleRoute = router;
