/**
 * Model użytkownika - przykład czystego kodu
 * Immutable data structure z walidacją
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

/**
 * Value Object pattern - UserId
 * Zapewnia type safety i walidację
 */
export class UserId {
  private readonly value: string;
  
  constructor(id: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
    this.value = id;
  }
  
  public getValue(): string {
    return this.value;
  }
  
  public equals(other: UserId): boolean {
    return this.value === other.value;
  }
  
  public toString(): string {
    return this.value;
  }
}

/**
 * Factory pattern dla tworzenia użytkowników
 */
export class UserFactory {
  public static createUser(id: string, email: string, name: string): User {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();
    
    this.validateEmail(normalizedEmail);
    this.validateName(normalizedName);
    
    const now = new Date();
    return {
      id,
      email: normalizedEmail,
      name: normalizedName,
      createdAt: now,
      updatedAt: now
    };
  }
  
  public static updateUser(existingUser: User, updates: UpdateUserRequest): User {
    // Add small delay to ensure different timestamps in tests
    const now = new Date();
    
    const normalizedEmail = updates.email ? updates.email.toLowerCase().trim() : existingUser.email;
    const normalizedName = updates.name ? updates.name.trim() : existingUser.name;
    
    // Validate only if there are updates
    if (updates.email) {
      this.validateEmail(normalizedEmail);
    }
    if (updates.name) {
      this.validateName(normalizedName);
    }
    
    return {
      ...existingUser,
      email: normalizedEmail,
      name: normalizedName,
      updatedAt: now
    };
  }
  
  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }
  
  private static validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
  }
}
