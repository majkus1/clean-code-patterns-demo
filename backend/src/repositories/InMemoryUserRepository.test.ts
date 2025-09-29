import { InMemoryUserRepository } from './InMemoryUserRepository';
import { UserFactory, UserId } from '../models/User';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  afterEach(async () => {
    await repository.clear();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const user = await repository.create(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await repository.create(userData);
      const foundUser = await repository.findById(new UserId(createdUser.id));

      expect(foundUser).toEqual(createdUser);
    });

    it('should return null for non-existent user', async () => {
      const foundUser = await repository.findById(new UserId('non-existent'));

      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const user1 = await repository.create({
        email: 'user1@example.com',
        name: 'User 1'
      });

      const user2 = await repository.create({
        email: 'user2@example.com',
        name: 'User 2'
      });

      const allUsers = await repository.findAll();

      expect(allUsers).toHaveLength(2);
      expect(allUsers).toContainEqual(user1);
      expect(allUsers).toContainEqual(user2);
    });

    it('should return empty array when no users exist', async () => {
      const allUsers = await repository.findAll();

      expect(allUsers).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update existing user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await repository.create(userData);
      const updatedUser = await repository.update(
        new UserId(createdUser.id),
        { name: 'Updated Name' }
      );

      expect(updatedUser?.name).toBe('Updated Name');
      expect(updatedUser?.email).toBe(createdUser.email);
      expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(createdUser.updatedAt.getTime());
    });

    it('should return null for non-existent user', async () => {
      const updatedUser = await repository.update(
        new UserId('non-existent'),
        { name: 'Updated Name' }
      );

      expect(updatedUser).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await repository.create(userData);
      const deleted = await repository.delete(new UserId(createdUser.id));

      expect(deleted).toBe(true);

      const foundUser = await repository.findById(new UserId(createdUser.id));
      expect(foundUser).toBeNull();
    });

    it('should return false for non-existent user', async () => {
      const deleted = await repository.delete(new UserId('non-existent'));

      expect(deleted).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true for existing user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await repository.create(userData);
      const exists = await repository.exists(new UserId(createdUser.id));

      expect(exists).toBe(true);
    });

    it('should return false for non-existent user', async () => {
      const exists = await repository.exists(new UserId('non-existent'));

      expect(exists).toBe(false);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await repository.create(userData);
      const foundUser = await repository.findByEmail('test@example.com');

      expect(foundUser).toEqual(createdUser);
    });

    it('should find user by email case insensitive', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const createdUser = await repository.create(userData);
      const foundUser = await repository.findByEmail('TEST@EXAMPLE.COM');

      expect(foundUser).toEqual(createdUser);
    });

    it('should return null for non-existent email', async () => {
      const foundUser = await repository.findByEmail('nonexistent@example.com');

      expect(foundUser).toBeNull();
    });
  });
});
