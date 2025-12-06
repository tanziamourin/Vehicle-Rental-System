import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

// Create Vehicle (Admin Only)
const createVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    // Required field validation
    if (!vehicle_name || !type || !registration_number || daily_rent_price === undefined || !availability_status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors: "vehicle_name, type, registration_number, daily_rent_price, availability_status are required"
      });
    }

    const result = await vehicleService.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Error creating vehicle",
      errors: error.message
    });
  }
};

// Get all vehicles (Public)
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();

    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving vehicles",
      errors: error.message
    });
  }
};

// Get single vehicle (Public)
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const {vehicleId} = req.params as {vehicleId:string};

    const result = await vehicleService.getSingleVehicle ( parseInt(vehicleId));

    return res.status(200).json({
      success: true,
      message: "Vehicle get successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
      errors: error.message
    });
  }
};

// Update vehicle (Admin Only)
const updateVehicle = async (req: Request, res: Response) => {
  try {
     const {vehicleId} = req.params as {vehicleId:string};

    const result = await vehicleService.updateVehicle(parseInt(vehicleId), req.body);

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Error updating vehicle",
      errors: error.message
    });
  }
};

// Delete vehicle (Admin Only)
const deleteVehicle = async (req: Request, res: Response) => {
  try {
     const {vehicleId} = req.params as {vehicleId:string};;

    await vehicleService.deleteVehicle (parseInt(vehicleId));

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Error deleting vehicle",
      errors: error.message
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
