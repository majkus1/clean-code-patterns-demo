# 🏗️ Clean Code & Design Patterns Demo

Kompletny projekt demonstracyjny pokazujący **wzorce projektowe**, **czysty kod** i **testowanie** w praktyce. Zbudowany z React + Node.js + TypeScript.

## 🎯 Cel projektu

Projekt ma na celu pokazanie w praktyce:
- **Wzorców projektowych** (Design Patterns)
- **Zasad czystego kodu** (Clean Code)
- **Zasad SOLID**
- **Testowania** (Unit tests, Integration tests)
- **Architektury aplikacji** (Layered Architecture)

## 🚀 Szybki start

### Wymagania
- Node.js 18+
- npm lub yarn

### Instalacja i uruchomienie

```bash
# Klonowanie repozytorium
git clone <repository-url>
cd clean-code-patterns-demo

# Instalacja zależności
npm install

# Uruchomienie backendu (port 3001)
cd backend
npm install
npm run dev

# Uruchomienie frontendu (port 3000)
cd ../frontend
npm install
npm start

# Uruchomienie testów
npm test
```

## 📁 Struktura projektu

```
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/     # Kontrolery HTTP
│   │   ├── services/        # Logika biznesowa
│   │   ├── repositories/    # Wzorzec Repository
│   │   ├── models/          # Modele danych
│   │   ├── events/          # Wzorzec Observer
│   │   ├── strategies/      # Wzorzec Strategy
│   │   ├── utils/           # Funkcje pomocnicze
│   │   ├── middleware/      # Middleware Express
│   │   ├── routes/          # Routing
│   │   └── test/            # Testy
│   └── package.json
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── components/      # Komponenty React
│   │   ├── hooks/           # Custom Hooks
│   │   ├── services/        # API Service
│   │   ├── types/           # TypeScript types
│   │   └── test/            # Testy
│   └── package.json
└── package.json            # Root package.json
```

## 🎨 Zaimplementowane wzorce projektowe

### 1. 🏭 Factory Pattern
**Lokalizacja:** `backend/src/models/User.ts`, `backend/src/models/Product.ts`

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

**Zalety:**
- Centralizuje logikę tworzenia obiektów
- Walidacja danych w jednym miejscu
- Łatwe testowanie

### 2. 🏪 Repository Pattern
**Lokalizacja:** `backend/src/repositories/`

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

**Zalety:**
- Abstrakcja dostępu do danych
- Łatwe testowanie (mock repository)
- Możliwość zmiany implementacji (database, API, file)

### 3. 🔧 Service Layer Pattern
**Lokalizacja:** `backend/src/services/`

```typescript
export class UserService {
  constructor(
    private readonly userRepository: InMemoryUserRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}
  
  public async createUser(request: CreateUserRequest): Promise<User> {
    // Logika biznesowa
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

**Zalety:**
- Separacja logiki biznesowej od kontrolerów
- Dependency Injection
- Łatwe testowanie jednostkowe

### 4. 👁️ Observer Pattern
**Lokalizacja:** `backend/src/events/`

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

// Użycie:
eventPublisher.subscribe('UserCreatedEvent', async (event) => {
  console.log(`🎉 New user created: ${event.user.name}`);
});
```

**Zalety:**
- Loose coupling między komponentami
- Rozszerzalność bez modyfikacji istniejącego kodu
- Event-driven architecture

### 5. 🎯 Strategy Pattern
**Lokalizacja:** `backend/src/strategies/`

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

**Zalety:**
- Open/Closed Principle
- Łatwe dodawanie nowych strategii
- Runtime selection of algorithm

### 6. 🎣 Custom Hooks Pattern (React)
**Lokalizacja:** `frontend/src/hooks/`

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

**Zalety:**
- Reusable logic
- Separation of concerns
- Easy testing

### 7. 🏗️ Dependency Injection
**Lokalizacja:** `backend/src/routes/userRoutes.ts`

```typescript
// Dependency Injection Container
const userRepository = new InMemoryUserRepository();
const eventPublisher = new SimpleEventPublisher();
const userService = new UserService(userRepository, eventPublisher);
const userController = new UserController(userService);
```

**Zalety:**
- Inversion of Control
- Loose coupling
- Easy testing with mocks

## 🧪 Testowanie

### Backend Tests
```bash
cd backend
npm test                    # Wszystkie testy
npm run test:watch         # Testy w trybie watch
npm run test:coverage      # Testy z pokryciem kodu
```

**Typy testów:**
- **Unit tests** - testowanie pojedynczych funkcji/klas
- **Integration tests** - testowanie integracji z API
- **Repository tests** - testowanie dostępu do danych

### Frontend Tests
```bash
cd frontend
npm test                   # Testy komponentów
```

**Technologie testowe:**
- **Jest** - test runner
- **React Testing Library** - testowanie komponentów
- **Supertest** - testowanie API endpoints

### Przykłady testów

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
    
    const editButton = screen.getByTitle('Edytuj użytkownika');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
  });
});
```

## 🎨 Zasady czystego kodu

### 1. Single Responsibility Principle (SRP)
```typescript
// ❌ Złe - jedna klasa robi za dużo
class UserManager {
  createUser() { /* ... */ }
  sendEmail() { /* ... */ }
  logActivity() { /* ... */ }
  validateData() { /* ... */ }
}

// ✅ Dobre - każda klasa ma jedną odpowiedzialność
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
// ✅ Łatwe rozszerzanie bez modyfikacji istniejącego kodu
class NotificationService {
  private strategies: NotificationStrategy[] = [];
  
  public addStrategy(strategy: NotificationStrategy): void {
    this.strategies.push(strategy);
  }
}

// Nowa strategia bez modyfikacji NotificationService
class SlackNotificationStrategy implements NotificationStrategy {
  // implementacja...
}
```

### 3. Interface Segregation Principle (ISP)
```typescript
// ✅ Małe, skupione interfejsy
interface IRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
}

interface IUserRepository extends IRepository<User, UserId> {
  findByEmail(email: string): Promise<User | null>;
}

// ❌ Złe - duży interfejs z wieloma odpowiedzialnościami
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
// ✅ Zależność od abstrakcji, nie konkretnej implementacji
class UserService {
  constructor(
    private readonly userRepository: IUserRepository,  // Abstrakcja
    private readonly eventPublisher: IEventPublisher   // Abstrakcja
  ) {}
}

// ❌ Złe - zależność od konkretnej implementacji
class UserService {
  constructor(
    private readonly userRepository: InMemoryUserRepository  // Konkretna klasa
  ) {}
}
```

## 🔧 Technologie i narzędzia

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

## 📊 Metryki jakości kodu

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

## 🚀 Funkcjonalności

### Backend API
- **Users Management**
  - `POST /api/users` - Tworzenie użytkownika
  - `GET /api/users` - Lista użytkowników
  - `GET /api/users/:id` - Pobieranie użytkownika
  - `PUT /api/users/:id` - Aktualizacja użytkownika
  - `DELETE /api/users/:id` - Usuwanie użytkownika
  - `GET /api/users/email?email=...` - Wyszukiwanie po email

- **Products Management**
  - `POST /api/products` - Tworzenie produktu
  - `GET /api/products` - Lista produktów
  - `GET /api/products/:id` - Pobieranie produktu
  - `PUT /api/products/:id` - Aktualizacja produktu
  - `DELETE /api/products/:id` - Usuwanie produktu
  - `GET /api/products/category/:category` - Produkty po kategorii
  - `GET /api/products/search?q=...` - Wyszukiwanie produktów
  - `GET /api/products/in-stock` - Dostępne produkty

- **Health Check**
  - `GET /health` - Status API

### Frontend Features
- **User Management**
  - Lista użytkowników z wyszukiwaniem
  - Tworzenie nowych użytkowników
  - Edycja istniejących użytkowników
  - Usuwanie użytkowników
  - Walidacja formularzy

- **Product Management**
  - Lista produktów z filtrowaniem
  - Tworzenie nowych produktów
  - Edycja istniejących produktów
  - Usuwanie produktów
  - Wyszukiwanie po nazwie i opisie
  - Filtrowanie po kategorii

- **UI/UX Features**
  - Responsywny design
  - Loading states
  - Error handling
  - Form validation
  - Real-time API status

## 📚 Nauka i rozwój

### Co możesz nauczyć się z tego projektu:

1. **Wzorce projektowe w praktyce**
   - Kiedy i jak używać różnych wzorców
   - Kombinowanie wzorców w aplikacji
   - Trade-offs między wzorcami

2. **Czysty kod**
   - Nazewnictwo zmiennych i funkcji
   - Długość funkcji i klas
   - Struktura kodu
   - Dokumentacja

3. **Testowanie**
   - Pisanie dobrych testów
   - Różne typy testów
   - Mocking i stubbing
   - Test coverage

4. **Architektura aplikacji**
   - Layered architecture
   - Separation of concerns
   - Dependency injection
   - Event-driven architecture

5. **TypeScript**
   - Type safety
   - Interfaces i types
   - Generic types
   - Utility types

## 🤝 Wkład w projekt

Jeśli chcesz dodać nowe funkcjonalności lub poprawić istniejące:

1. Fork projektu
2. Utwórz branch dla nowej funkcjonalności
3. Dodaj testy dla nowego kodu
4. Upewnij się, że wszystkie testy przechodzą
5. Utwórz Pull Request

## 📝 Licencja

MIT License - możesz swobodnie używać tego kodu do nauki i projektów.

## 🎓 Dalsze kroki

Po przeanalizowaniu tego projektu możesz:

1. **Rozszerzyć funkcjonalności**
   - Dodaj autentykację i autoryzację
   - Implementuj prawdziwą bazę danych
   - Dodaj cache'owanie
   - Implementuj real-time features

2. **Dodaj nowe wzorce**
   - Builder Pattern
   - Command Pattern
   - Decorator Pattern
   - Facade Pattern

3. **Popraw jakość kodu**
   - Dodaj więcej testów
   - Implementuj logging
   - Dodaj monitoring
   - Popraw error handling

4. **Deployment**
   - Docker containerization
   - CI/CD pipeline
   - Cloud deployment
   - Production monitoring

---

**Powodzenia w nauce! 🚀**

*Ten projekt jest doskonałym punktem wyjścia do zrozumienia zaawansowanych konceptów programowania. Każdy wzorzec i technika ma swoje zastosowanie w rzeczywistych projektach.*
