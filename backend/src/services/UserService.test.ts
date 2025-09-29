import { UserService } from './UserService';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { SimpleEventPublisher } from '../events/SimpleEventPublisher';
import { CreateUserRequest, UpdateUserRequest } from '../models/User';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: InMemoryUserRepository;
  let eventPublisher: SimpleEventPublisher;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    eventPublisher = new SimpleEventPublisher();
    userService = new UserService(userRepository, eventPublisher);
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const user = await userService.createUser(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error if user with email already exists', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User'
      };

      await userService.createUser(userData);

      await expect(userService.createUser(userData))
        .rejects.toThrow('User with this email already exists');
    });

    it('should normalize email to lowercase', async () => {
      const userData: CreateUserRequest = {
        email: 'TEST@EXAMPLE.COM',
        name: 'Test User'
      };

      const user = await userService.createUser(userData);

      expect(user.email).toBe('test@example.com');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await userService.createUser(userData);
      const foundUser = await userService.getUserById(createdUser.id);

      expect(foundUser).toEqual(createdUser);
    });

    it('should throw error if user not found', async () => {
      await expect(userService.getUserById('non-existent'))
        .rejects.toThrow('User not found');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const user1Data: CreateUserRequest = {
        email: 'user1@example.com',
        name: 'User 1'
      };

      const user2Data: CreateUserRequest = {
        email: 'user2@example.com',
        name: 'User 2'
      };

      const user1 = await userService.createUser(user1Data);
      const user2 = await userService.createUser(user2Data);

      const allUsers = await userService.getAllUsers();

      expect(allUsers).toHaveLength(2);
      expect(allUsers).toContainEqual(user1);
      expect(allUsers).toContainEqual(user2);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await userService.createUser(userData);
      const updates: UpdateUserRequest = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const updatedUser = await userService.updateUser(createdUser.id, updates);

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe('updated@example.com');
      expect(updatedUser.id).toBe(createdUser.id);
    });

    it('should throw error if user not found', async () => {
      const updates: UpdateUserRequest = {
        name: 'Updated Name'
      };

      await expect(userService.updateUser('non-existent', updates))
        .rejects.toThrow('User not found');
    });

    it('should throw error if email already exists', async () => {
      const user1Data: CreateUserRequest = {
        email: 'user1@example.com',
        name: 'User 1'
      };

      const user2Data: CreateUserRequest = {
        email: 'user2@example.com',
        name: 'User 2'
      };

      const user1 = await userService.createUser(user1Data);
      const user2 = await userService.createUser(user2Data);

      const updates: UpdateUserRequest = {
        email: user1.email
      };

      await expect(userService.updateUser(user2.id, updates))
        .rejects.toThrow('User with this email already exists');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await userService.createUser(userData);
      await userService.deleteUser(createdUser.id);

      await expect(userService.getUserById(createdUser.id))
        .rejects.toThrow('User not found');
    });

    it('should throw error if user not found', async () => {
      await expect(userService.deleteUser('non-existent'))
        .rejects.toThrow('User not found');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await userService.createUser(userData);
      const foundUser = await userService.getUserByEmail('test@example.com');

      expect(foundUser).toEqual(createdUser);
    });

    it('should throw error if user not found', async () => {
      await expect(userService.getUserByEmail('nonexistent@example.com'))
        .rejects.toThrow('User not found');
    });
  });
});
