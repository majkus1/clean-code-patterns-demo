import { User, CreateUserRequest, UpdateUserRequest, UserId, UserFactory } from '../models/User';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { logger } from '../utils/logger';
import { IEventPublisher } from '../events/IEventPublisher';
import { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from '../events/UserEvents';

/**
 * Service Layer Pattern
 * Business logic layer z dependency injection
 */
export class UserService {
  constructor(
    private readonly userRepository: InMemoryUserRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}
  
  /**
   * Single Responsibility Principle - one method, one responsibility
   */
  public async createUser(request: CreateUserRequest): Promise<User> {
    logger.info('Creating new user', { email: request.email });
    
    // Normalize email for checking
    const normalizedEmail = request.email.toLowerCase().trim();
    
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create user using factory
    const user = await this.userRepository.create({
      email: normalizedEmail,
      name: request.name.trim()
    });
    
    // Publish event
    await this.eventPublisher.publish(new UserCreatedEvent(user));
    
    logger.info('User created successfully', { userId: user.id });
    return user;
  }
  
  public async getUserById(id: string): Promise<User> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
  
  public async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    const userId = new UserId(id);
    const existingUser = await this.userRepository.findById(userId);
    
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    // Check email uniqueness if email is being updated
    if (updates.email && updates.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(updates.email);
      if (emailExists) {
        throw new Error('User with this email already exists');
      }
    }
    
    // Update user using factory
    const updatedUser = UserFactory.updateUser(existingUser, updates);
    const savedUser = await this.userRepository.update(userId, updatedUser);
    
    if (!savedUser) {
      throw new Error('Failed to update user');
    }
    
    // Publish event
    await this.eventPublisher.publish(new UserUpdatedEvent(savedUser));
    
    logger.info('User updated successfully', { userId: savedUser.id });
    return savedUser;
  }
  
  public async deleteUser(id: string): Promise<void> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const deleted = await this.userRepository.delete(userId);
    if (!deleted) {
      throw new Error('Failed to delete user');
    }
    
    // Publish event
    await this.eventPublisher.publish(new UserDeletedEvent(user));
    
    logger.info('User deleted successfully', { userId: id });
  }
  
  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}
