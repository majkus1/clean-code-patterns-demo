# 🏗️ Clean Code & Design Patterns Demo

A comprehensive demonstration project showcasing **design patterns**, **clean code** principles, and **testing** in practice. Built with React + Node.js + TypeScript.

## 🎯 Project Goals

This project aims to demonstrate in practice:
- **Design Patterns** implementation
- **Clean Code** principles
- **SOLID** principles
- **Testing** (Unit tests, Integration tests)
- **Application Architecture** (Layered Architecture)

## 🚀 Quick Start

### Requirements
- Node.js 18+
- npm or yarn

### Installation and Setup

```bash
# Clone the repository
git clone <repository-url>
cd clean-code-patterns-demo

# Install dependencies
npm install

# Start backend (port 3001)
cd backend
npm install
npm run dev

# Start frontend (port 3000)
cd ../frontend
npm install
npm start

# Run tests
npm test
```

## 📁 Project Structure

```
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/     # HTTP Controllers
│   │   ├── services/        # Business Logic
│   │   ├── repositories/    # Repository Pattern
│   │   ├── models/          # Data Models
│   │   ├── events/          # Observer Pattern
│   │   ├── strategies/      # Strategy Pattern
│   │   ├── utils/           # Utility Functions
│   │   ├── middleware/      # Express Middleware
│   │   ├── routes/          # Routing
│   │   └── test/            # Tests
│   └── package.json
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── hooks/           # Custom Hooks
│   │   ├── services/        # API Service
│   │   ├── types/           # TypeScript Types
│   │   └── test/            # Tests
│   └── package.json
└── package.json            # Root package.json
```

## 🎨 Implemented Design Patterns

### 1. 🏭 Factory Pattern
**Location:** `backend/src/models/User.ts`, `backend/src/models/Product.ts`

```typescript
export class UserFactory {
  public static createUser(id: string, email: string, name: string): User {
    this.validateEmail(email);
    this.validateName(name);
    
    const now = new Date();
    return {
      id,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      createdAt: now,
      updatedAt: now
    };
  }
}
```

**Benefits:**
- Centralizes object creation logic
- Data validation in one place
- Easy testing

### 2. 🏪 Repository Pattern
**Location:** `backend/src/repositories/`

```typescript
export interface IRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

export class InMemoryUserRepository implements IRepository<User, UserId> {
  // Implementacja...
}
```

**Benefits:**
- Data access abstraction
- Easy testing (mock repository)
- Ability to change implementation (database, API, file)

### 3. 🔧 Service Layer Pattern
**Location:** `backend/src/services/`

```typescript
export class UserService {
  constructor(
    private readonly userRepository: InMemoryUserRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}
  
  public async createUser(request: CreateUserRequest): Promise<User> {
    // Business logic
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const user = await this.userRepository.create({
      email: request.email,
      name: request.name
    });
    
    await this.eventPublisher.publish(new UserCreatedEvent(user));
    return user;
  }
}
```

**Benefits:**
- Separation of business logic from controllers
- Dependency Injection
- Easy unit testing

### 4. 👁️ Observer Pattern
**Location:** `backend/src/events/`

```typescript
export interface IEventPublisher {
  publish(event: any): Promise<void>;
  subscribe(eventType: string, handler: (event: any) => Promise<void>): void;
}

export class UserCreatedEvent extends DomainEvent {
  constructor(public readonly user: User) {
    super(user.id);
  }
}

// Usage:
eventPublisher.subscribe('UserCreatedEvent', async (event) => {
  console.log(`🎉 New user created: ${event.user.name}`);
});
```

**Benefits:**
- Loose coupling between components
- Extensibility without modifying existing code
- Event-driven architecture

### 5. 🎯 Strategy Pattern
**Location:** `backend/src/strategies/`

```typescript
export interface NotificationStrategy {
  send(message: string, recipient: string): Promise<boolean>;
  canHandle(recipient: string): boolean;
}

export class EmailNotificationStrategy implements NotificationStrategy {
  public async send(message: string, recipient: string): Promise<boolean> {
    console.log(`📧 Sending email to ${recipient}: ${message}`);
    return true;
  }
  
  public canHandle(recipient: string): boolean {
    return recipient.includes('@');
  }
}

export class NotificationService {
  private strategies: NotificationStrategy[] = [];
  
  public async sendNotification(message: string, recipient: string): Promise<boolean> {
    const strategy = this.strategies.find(s => s.canHandle(recipient));
    return await strategy.send(message, recipient);
  }
}
```

**Benefits:**
- Open/Closed Principle
- Easy addition of new strategies
- Runtime selection of algorithm

### 6. 🎣 Custom Hooks Pattern (React)
**Location:** `frontend/src/hooks/`

```typescript
export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery<User[], Error>(
    'users',
    () => apiService.getAllUsers(),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  const createUserMutation = useMutation<User, Error, CreateUserRequest>(
    (userData) => apiService.createUser(userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  return {
    users: users || [],
    isLoading,
    error,
    createUser: createUserMutation.mutate,
    // ...
  };
};
```

**Benefits:**
- Reusable logic
- Separation of concerns
- Easy testing

### 7. 🏗️ Dependency Injection
**Location:** `backend/src/routes/userRoutes.ts`

```typescript
// Dependency Injection Container
const userRepository = new InMemoryUserRepository();
const eventPublisher = new SimpleEventPublisher();
const userService = new UserService(userRepository, eventPublisher);
const userController = new UserController(userService);
```

**Benefits:**
- Inversion of Control
- Loose coupling
- Easy testing with mocks

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # All tests
npm run test:watch         # Tests in watch mode
npm run test:coverage      # Tests with code coverage
```

**Test Types:**
- **Unit tests** - testing individual functions/classes
- **Integration tests** - testing API integration
- **Repository tests** - testing data access

### Frontend Tests
```bash
cd frontend
npm test                   # Component tests
```

**Testing Technologies:**
- **Jest** - test runner
- **React Testing Library** - component testing
- **Supertest** - API endpoint testing

### Test Examples

```typescript
// Unit test - UserFactory
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
  });

  it('should throw error for invalid email', () => {
    expect(() => 
      UserFactory.createUser('test-id', 'invalid-email', 'Test User')
    ).toThrow('Invalid email format');
  });
});

// Integration test - API
describe('User Routes Integration Tests', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('test@example.com');
  });
});

// React component test
describe('UserCard', () => {
  it('renders user information correctly', () => {
    render(<UserCard {...mockProps} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<UserCard {...mockProps} />);
    
    const editButton = screen.getByTitle('Edit user');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
  });
});
```

## 🎨 Clean Code Principles

### 1. Single Responsibility Principle (SRP)
```typescript
// ❌ Bad - one class does too much
class UserManager {
  createUser() { /* ... */ }
  sendEmail() { /* ... */ }
  logActivity() { /* ... */ }
  validateData() { /* ... */ }
}

// ✅ Good - each class has one responsibility
class UserService {
  createUser() { /* ... */ }
}

class EmailService {
  sendEmail() { /* ... */ }
}

class Logger {
  logActivity() { /* ... */ }
}

class ValidationUtils {
  validateData() { /* ... */ }
}
```

### 2. Open/Closed Principle (OCP)
```typescript
// ✅ Easy extension without modifying existing code
class NotificationService {
  private strategies: NotificationStrategy[] = [];
  
  public addStrategy(strategy: NotificationStrategy): void {
    this.strategies.push(strategy);
  }
}

// New strategy without modifying NotificationService
class SlackNotificationStrategy implements NotificationStrategy {
  // implementation...
}
```

### 3. Interface Segregation Principle (ISP)
```typescript
// ✅ Small, focused interfaces
interface IRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
}

interface IUserRepository extends IRepository<User, UserId> {
  findByEmail(email: string): Promise<User | null>;
}

// ❌ Bad - large interface with multiple responsibilities
interface IUserManager {
  createUser(): Promise<User>;
  deleteUser(): Promise<void>;
  sendEmail(): Promise<void>;
  generateReport(): Promise<Report>;
  backupData(): Promise<void>;
}
```

### 4. Dependency Inversion Principle (DIP)
```typescript
// ✅ Dependency on abstraction, not concrete implementation
class UserService {
  constructor(
    private readonly userRepository: IUserRepository,  // Abstraction
    private readonly eventPublisher: IEventPublisher   // Abstraction
  ) {}
}

// ❌ Bad - dependency on concrete implementation
class UserService {
  constructor(
    private readonly userRepository: InMemoryUserRepository  // Concrete class
  ) {}
}
```

## 🔧 Technologies and Tools

### Backend
- **Node.js** - runtime environment
- **TypeScript** - type safety
- **Express.js** - web framework
- **Jest** - testing framework
- **Supertest** - HTTP testing
- **UUID** - unique identifiers
- **CORS** - cross-origin requests
- **Helmet** - security headers

### Frontend
- **React 18** - UI library
- **TypeScript** - type safety
- **React Query** - data fetching and caching
- **Axios** - HTTP client
- **React Testing Library** - component testing
- **Jest** - testing framework

## 📊 Code Quality Metrics

### Test Coverage
```bash
# Backend coverage
npm run test:coverage

# Frontend coverage
npm test -- --coverage
```

### Linting
```bash
# Backend linting
cd backend && npm run lint

# Frontend linting (via Create React App)
cd frontend && npm run build
```

## 🚀 Features

### Backend API
- **Users Management**
  - `POST /api/users` - Create user
  - `GET /api/users` - List users
  - `GET /api/users/:id` - Get user
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user
  - `GET /api/users/email?email=...` - Search by email

- **Products Management**
  - `POST /api/products` - Create product
  - `GET /api/products` - List products
  - `GET /api/products/:id` - Get product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product
  - `GET /api/products/category/:category` - Products by category
  - `GET /api/products/search?q=...` - Search products
  - `GET /api/products/in-stock` - Available products

- **Health Check**
  - `GET /health` - API status

### Frontend Features
- **User Management**
  - User list with search functionality
  - Create new users
  - Edit existing users
  - Delete users
  - Form validation

- **Product Management**
  - Product list with filtering
  - Create new products
  - Edit existing products
  - Delete products
  - Search by name and description
  - Filter by category

- **UI/UX Features**
  - Responsive design
  - Loading states
  - Error handling
  - Form validation
  - Real-time API status

## 📚 Learning and Development

### What you can learn from this project:

1. **Design Patterns in Practice**
   - When and how to use different patterns
   - Combining patterns in applications
   - Trade-offs between patterns

2. **Clean Code**
   - Variable and function naming
   - Function and class length
   - Code structure
   - Documentation

3. **Testing**
   - Writing good tests
   - Different types of tests
   - Mocking and stubbing
   - Test coverage

4. **Application Architecture**
   - Layered architecture
   - Separation of concerns
   - Dependency injection
   - Event-driven architecture

5. **TypeScript**
   - Type safety
   - Interfaces and types
   - Generic types
   - Utility types

## 🤝 Contributing

If you want to add new features or improve existing ones:

1. Fork the project
2. Create a branch for the new feature
3. Add tests for the new code
4. Make sure all tests pass
5. Create a Pull Request

## 📝 License

MIT License - you can freely use this code for learning and projects.

## 🎓 Next Steps

After analyzing this project, you can:

1. **Extend Functionality**
   - Add authentication and authorization
   - Implement a real database
   - Add caching
   - Implement real-time features

2. **Add New Patterns**
   - Builder Pattern
   - Command Pattern
   - Decorator Pattern
   - Facade Pattern

3. **Improve Code Quality**
   - Add more tests
   - Implement logging
   - Add monitoring
   - Improve error handling

4. **Deployment**
   - Docker containerization
   - CI/CD pipeline
   - Cloud deployment
   - Production monitoring

---

**Good luck with learning! 🚀**

*This project is an excellent starting point for understanding advanced programming concepts. Every pattern and technique has its application in real-world projects.*
