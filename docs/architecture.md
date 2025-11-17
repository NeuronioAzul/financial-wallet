# Architecture Overview

Complete architecture documentation for the Financial Wallet system.

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Architecture](#database-architecture)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

## 🏗️ System Architecture

### Overview

Financial Wallet is a monorepo-based digital wallet system following a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React 18 SPA (TypeScript + Vite + TailwindCSS)       │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST (Bearer Token)
┌───────────────────────────┴─────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Laravel 12 API (PHP 8.4 + Sanctum)                   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐              │ │
│  │  │Controllers│→│ Services │→│  Models  │              │ │
│  │  └──────────┘ └──────────┘ └──────────┘              │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ PDO/PostgreSQL
┌───────────────────────────┴─────────────────────────────────┐
│                         Data Layer                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL 18 (UUID v7 + LGPD Compliance)            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

**Frontend:**
- React 18.3 with TypeScript 5.5
- Vite 5.3 for build tooling
- TailwindCSS 3.4 for styling
- React Router v6 for routing
- Axios for HTTP requests
- Zod for validation

**Backend:**
- PHP 8.4 with Laravel 12
- Laravel Sanctum for authentication
- PHPUnit 12 for testing
- PostgreSQL 18 database

**Infrastructure:**
- Docker + Docker Compose
- Nginx (for Swagger UI)
- Git with commit hooks

## 🔧 Backend Architecture

### Layered Architecture

The backend follows a clean layered architecture:

```
HTTP Request
     ↓
[Routes] (routes/api.php)
     ↓
[Middleware] (auth, throttle)
     ↓
[FormRequest] (validation)
     ↓
[Controller] (orchestration)
     ↓
[Service] (business logic)
     ↓
[Model] (data access)
     ↓
[Database]
     ↓
HTTP Response
```

### Components

#### 1. Routes (`routes/api.php`)
- Define all API endpoints
- Group by authentication requirement
- Apply middleware (auth, throttle)

#### 2. Controllers (`app/Http/Controllers/Api/`)
- Thin controllers pattern
- Request orchestration only
- Delegate to services
- Return JSON responses

**Example:**
```php
class TransactionController extends Controller
{
    public function deposit(DepositRequest $request): JsonResponse
    {
        $transaction = $this->transactionService->deposit(
            $request->user(),
            $request->validated()
        );
        
        return response()->json($transaction, 201);
    }
}
```

#### 3. Form Requests (`app/Http/Requests/`)
- Input validation
- Authorization rules
- Custom error messages

**Example:**
```php
class DepositRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
```

#### 4. Services (`app/Services/`)
- Business logic
- Transaction management
- Error handling
- Database operations

**Example:**
```php
class TransactionService
{
    public function deposit(User $user, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $data) {
            $wallet = $user->wallet;
            $wallet->balance += $data['amount'];
            $wallet->save();
            
            return Transaction::create([...]);
        });
    }
}
```

#### 5. Models (`app/Models/`)
- Eloquent ORM models
- Relationships
- Accessors/Mutators
- Business rules

**Models:**
- User
- Wallet
- Transaction
- Address
- UserDocument
- TransactionLog
- LgpdAuditLog

#### 6. Enums (`app/Enums/`)
- Type-safe constants
- Status codes
- Document types

**Enums:**
- UserStatus
- WalletStatus
- TransactionType
- TransactionStatus
- DocumentType
- ArchiveReason

### API Endpoints

**23 RESTful endpoints organized by feature:**

- **Auth (4):** register, login, logout, me
- **Profile (2):** get, update
- **Addresses (5):** list, create, get, update, delete
- **Documents (5):** list, upload, status, get, delete
- **Wallet (2):** get wallet, get balance
- **Transactions (5):** list, get, deposit, transfer, reverse

## ⚛️ Frontend Architecture

### Component Architecture

```
src/
├── pages/              # Page components (routes)
│   ├── LoginPage
│   ├── DashboardPage
│   └── ...
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   │   ├── Button
│   │   ├── Input
│   │   └── Modal
│   └── features/      # Feature-specific components
│       ├── WalletCard
│       └── TransactionItem
├── contexts/          # React contexts
│   └── AuthContext
├── services/          # API services
│   ├── apiClient
│   ├── authService
│   └── walletService
└── types/             # TypeScript types
```

### State Management

**AuthContext:**
- Global authentication state
- User information
- Token management
- Login/logout actions

**Component State:**
- Local state with useState
- Form state with React Hook Form
- Server state via API calls

### Routing

**Protected Routes:**
- Dashboard
- Transaction History
- Profile

**Public Routes:**
- Login
- Register
- Forgot Password

### Data Flow

```
User Interaction
     ↓
[Component Event Handler]
     ↓
[API Service Call] (axios)
     ↓
[Backend API]
     ↓
[Response]
     ↓
[State Update]
     ↓
[Component Re-render]
```

## 🗄️ Database Architecture

### Schema Design

**Active Data Tables:**
- `users` - Active users
- `wallets` - Active wallets
- `transactions` - All transactions (immutable)
- `addresses` - User addresses
- `user_documents` - User documents

**Historical/Audit Tables:**
- `users_history` - Archived users
- `wallets_history` - Archived wallets
- `transaction_logs` - Transaction changes
- `lgpd_audit_log` - LGPD compliance audit

### Key Features

**UUID v7:**
- Time-ordered UUIDs
- Better indexing performance
- Non-sequential for security
- Sortable by creation time

**LGPD Compliance:**
- Separate historical tables
- Complete audit trail
- User archiving function
- Right to be forgotten

**Data Integrity:**
- Foreign key constraints
- Unique constraints
- Check constraints
- NOT NULL where applicable

### Database Functions

**archive_user(user_id, reason, archived_by, ip_address):**
- Atomically archives user data
- Copies to history tables
- Logs to audit trail
- Removes active data

## 🔒 Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Backend validates credentials
3. Generate Sanctum token
4. Return token to frontend
5. Frontend stores token
6. Include token in all requests (Bearer)
7. Backend validates token on each request
```

### Security Layers

**Application Security:**
- Laravel Sanctum authentication
- BCrypt password hashing
- CSRF protection
- XSS protection
- SQL injection prevention

**API Security:**
- Bearer token authentication
- Rate limiting (60 req/min)
- Input validation
- Output sanitization

**Database Security:**
- UUID v7 (non-sequential IDs)
- Row-level locking
- Transaction isolation
- Audit logging

**Infrastructure Security:**
- Docker container isolation
- Environment variable secrets
- CORS configuration
- HTTPS in production

## 🐳 Deployment Architecture

### Development Environment

```
Docker Compose
├── Backend Container
│   ├── PHP 8.4-FPM
│   ├── Laravel 12
│   └── Port: 8000
├── Frontend Container
│   ├── Node 18
│   ├── Vite dev server
│   └── Port: 3000
├── PostgreSQL Container
│   ├── PostgreSQL 18
│   └── Port: 5432
└── Swagger Container
    ├── Nginx
    └── Port: 8080
```

### Container Configuration

**Backend:**
- Base: php:8.4-fpm-alpine
- User: www-data (configured via UID/GID)
- Timezone: America/Sao_Paulo
- Volume: ./backend:/var/www/html

**Frontend:**
- Base: node:18-alpine
- User: node
- Command: npm run dev
- Volume: ./frontend:/app

**PostgreSQL:**
- Base: postgres:18-alpine
- Health checks enabled
- Persistent volume
- Init scripts support

### Production Considerations

**Backend:**
- PHP-FPM + Nginx
- OPcache enabled
- Environment-based config
- Log rotation

**Frontend:**
- Static build (npm run build)
- Nginx for serving
- Asset compression
- CDN integration

**Database:**
- Managed PostgreSQL service
- Automated backups
- Connection pooling
- Read replicas

**Monitoring:**
- Application logging
- Error tracking
- Performance monitoring
- Uptime monitoring

## 📊 Data Flow Diagrams

### Deposit Transaction

```
User → Frontend → Backend → Validation
                       ↓
                  Start Transaction
                       ↓
                  Lock Wallet
                       ↓
                  Update Balance
                       ↓
                  Create Transaction
                       ↓
                  Commit Transaction
                       ↓
                  Return Success → Frontend → User
```

### Transfer Transaction

```
User → Frontend → Backend → Validation
                       ↓
                  Check Sender Balance
                       ↓
                  Start Transaction
                       ↓
                  Lock Both Wallets
                       ↓
                  Debit Sender
                       ↓
                  Credit Receiver
                       ↓
                  Create Transaction
                       ↓
                  Commit Transaction
                       ↓
                  Return Success → Frontend → User
```

## 🔄 Integration Points

### Frontend ↔ Backend

**Protocol:** HTTP/REST  
**Format:** JSON  
**Auth:** Bearer Token  
**Base URL:** `http://localhost:8000/api`

### Backend ↔ Database

**Protocol:** PostgreSQL wire protocol  
**Driver:** PDO (PHP Data Objects)  
**ORM:** Eloquent  
**Connection Pool:** Laravel default

## 📈 Scalability Considerations

### Horizontal Scaling

**Frontend:**
- Stateless SPA
- CDN distribution
- Load balancer ready

**Backend:**
- Stateless API
- Session in database
- Multiple instances supported

**Database:**
- Read replicas
- Connection pooling
- Query optimization

### Vertical Scaling

- Resource limits configurable
- Memory optimization
- CPU affinity
- Disk I/O optimization

## 🔍 Monitoring & Observability

### Logging

- Application logs (Laravel)
- Access logs (Nginx)
- Error logs
- Transaction logs

### Metrics

- Request rate
- Response time
- Error rate
- Database queries

### Tracing

- Request ID tracking
- Transaction tracing
- User action audit

---

**Last Updated:** 2024-11-17  
**Version:** 1.0.0  
**Maintained by:** Mauro Rocha Tavares
