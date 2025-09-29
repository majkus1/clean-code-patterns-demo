import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest, UpdateUserRequest } from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * Controller Pattern
 * Handles HTTP requests and responses
 */
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  public createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData: CreateUserRequest = req.body;
    
    logger.info('User creation request received', { email: userData.email });
    
    const user = await this.userService.createUser(userData);
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  });
  
  public getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return;
    }
    
    const user = await this.userService.getUserById(id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  });
  
  public getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  });
  
  public updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updates: UpdateUserRequest = req.body;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return;
    }
    
    logger.info('User update request received', { userId: id });
    
    const user = await this.userService.updateUser(id, updates);
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  });
  
  public deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return;
    }
    
    logger.info('User deletion request received', { userId: id });
    
    await this.userService.deleteUser(id);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  });
  
  public getUserByEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Email query parameter is required'
      });
      return;
    }
    
    const user = await this.userService.getUserByEmail(email);
    
    res.status(200).json({
      success: true,
      data: user
    });
  });
}
