import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User';
import { IRepository } from './IRepository';
import { UserId } from '../models/User';

/**
 * Repository Pattern - In-Memory Implementation
 * Example of clean implementation with dependency injection
 */
export class InMemoryUserRepository implements IRepository<User, UserId> {
  private users: Map<string, User> = new Map();
  
  public async findById(id: UserId): Promise<User | null> {
    const user = this.users.get(id.getValue());
    return user || null;
  }
  
  public async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  public async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = uuidv4();
    const now = new Date();
    
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(id, user);
    return user;
  }
  
  public async update(id: UserId, updates: Partial<User>): Promise<User | null> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      return null;
    }
    
    // Add small delay to ensure different timestamps in tests
    await new Promise(resolve => setTimeout(resolve, 1));
    
    const updatedUser: User = {
      ...existingUser,
      ...updates,
      updatedAt: new Date()
    };
    
    this.users.set(id.getValue(), updatedUser);
    return updatedUser;
  }
  
  public async delete(id: UserId): Promise<boolean> {
    return this.users.delete(id.getValue());
  }
  
  public async exists(id: UserId): Promise<boolean> {
    return this.users.has(id.getValue());
  }
  
  public async findByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.users.values());
    const user = users.find(u => u.email === email.toLowerCase());
    return user || null;
  }
  
  public async clear(): Promise<void> {
    this.users.clear();
  }
}
