import { Request, Response } from "express";
import { userService } from "./user.service";

// Get all
 
const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const { role } = (req as any).user;
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can view users.'
      });
    }

    const result = await userService.GetAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully.',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
      error: error.message
    });
  }
};

// Update user by ID 

const UpdateUserById = async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const { user: { id: currentUserId, role } } = req as any;

  try {
    if (role !== 'admin' && currentUserId !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this user.'
      });
    }

    const result = await userService.UpdateUserById(parseInt(userId), req.body);
    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update user.',
      error: error.message
    });
  }
};

// Delete user by ID

const DeleteUserById = async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const { role } = (req as any).user;

  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admin can delete users.'
    });
  }

  try {
    await userService.DeleteUserById(parseInt(userId));
    res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete user.',
      error: error.message
    });
  }
};

export const userController = {
  GetAllUsers,
  UpdateUserById,
  DeleteUserById
};
