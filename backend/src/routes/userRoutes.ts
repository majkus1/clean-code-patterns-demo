import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { SimpleEventPublisher } from '../events/SimpleEventPublisher';

/**
 * Dependency Injection Container
 * Inversion of Control - dependencies are injected, not created
 */
const userRepository = new InMemoryUserRepository();
const eventPublisher = new SimpleEventPublisher();
const userService = new UserService(userRepository, eventPublisher);
const userController = new UserController(userService);

// Set up event handlers
eventPublisher.subscribe('UserCreatedEvent', async (event) => {
  console.log(`🎉 New user created: ${event.user.name} (${event.user.email})`);
});

eventPublisher.subscribe('UserUpdatedEvent', async (event) => {
  console.log(`✏️ User updated: ${event.user.name} (${event.user.email})`);
});

eventPublisher.subscribe('UserDeletedEvent', async (event) => {
  console.log(`🗑️ User deleted: ${event.user.name} (${event.user.email})`);
});

const router = Router();

// Routes
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/email', userController.getUserByEmail);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export { router as userRoutes };
