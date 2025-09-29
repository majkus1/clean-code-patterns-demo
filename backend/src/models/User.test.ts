import { User, UserFactory, UserId, CreateUserRequest } from './User';

describe('User Model', () => {
  describe('UserId', () => {
    it('should create a valid UserId', () => {
      const userId = new UserId('test-id');
      expect(userId.getValue()).toBe('test-id');
    });

    it('should throw error for empty UserId', () => {
      expect(() => new UserId('')).toThrow('User ID cannot be empty');
      expect(() => new UserId('   ')).toThrow('User ID cannot be empty');
    });

    it('should compare UserIds correctly', () => {
      const id1 = new UserId('same-id');
      const id2 = new UserId('same-id');
      const id3 = new UserId('different-id');

      expect(id1.equals(id2)).toBe(true);
      expect(id1.equals(id3)).toBe(false);
    });
  });

  describe('UserFactory', () => {
    it('should create a valid user', () => {
      const user = UserFactory.createUser(
        'test-id',
        'test@example.com',
        'Test User'
      );

      expect(user.id).toBe('test-id');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should normalize email to lowercase', () => {
      const user = UserFactory.createUser(
        'test-id',
        'TEST@EXAMPLE.COM',
        'Test User'
      );

      expect(user.email).toBe('test@example.com');
    });

    it('should trim whitespace from name and email', () => {
      const user = UserFactory.createUser(
        'test-id',
        '  test@example.com  ',
        '  Test User  '
      );

      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
    });

    it('should throw error for invalid email', () => {
      expect(() => 
        UserFactory.createUser('test-id', 'invalid-email', 'Test User')
      ).toThrow('Invalid email format');
    });

    it('should throw error for short name', () => {
      expect(() => 
        UserFactory.createUser('test-id', 'test@example.com', 'A')
      ).toThrow('Name must be at least 2 characters long');
    });

    it('should update user correctly', () => {
      const originalUser = UserFactory.createUser(
        'test-id',
        'test@example.com',
        'Test User'
      );

      const updatedUser = UserFactory.updateUser(originalUser, {
        name: 'Updated Name',
        email: 'updated@example.com'
      });

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe('updated@example.com');
      expect(updatedUser.id).toBe(originalUser.id);
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUser.updatedAt.getTime());
    });

    it('should preserve unchanged fields during update', () => {
      const originalUser = UserFactory.createUser(
        'test-id',
        'test@example.com',
        'Test User'
      );

      const updatedUser = UserFactory.updateUser(originalUser, {
        name: 'Updated Name'
      });

      expect(updatedUser.email).toBe(originalUser.email);
      expect(updatedUser.name).toBe('Updated Name');
    });
  });
});
