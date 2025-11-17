# Backend - Financial Wallet API

RESTful API for the digital wallet system built with Laravel 12, PHP 8.4, and PostgreSQL 18.

## 🚀 Tech Stack

- **PHP 8.4** + **Laravel 12**
- **PostgreSQL 18** with UUID v7
- **Laravel Sanctum** for authentication
- **Pest 3** for testing
- **Docker** for development

## 📋 Features

### Authentication
- ✅ User registration with CPF validation
- ✅ Login with email/password
- ✅ Logout with token revocation
- ✅ `/me` endpoint for authenticated user

### User Profile
- ✅ View profile
- ✅ Update profile data
- ✅ Complete validation

### Addresses
- ✅ Full CRUD operations
- ✅ Multiple addresses per user
- ✅ ZIP code validation

### Documents
- ✅ Document upload (CPF, RG, CNH, etc.)
- ✅ Approval status
- ✅ List and query

### Digital Wallet
- ✅ Wallet query
- ✅ Balance query
- ✅ Ownership validation

### Transactions
- ✅ Deposits
- ✅ User-to-user transfers
- ✅ Reversals (chargebacks)
- ✅ Complete history
- ✅ Concurrency control with row locking
- ✅ Real-time balance validation

### LGPD & Audit
- ✅ User archiving
- ✅ Audit log
- ✅ Transaction history
- ✅ Full compliance

### Admin & Permissions
- ✅ Role-based access control (Spatie Permission)
- ✅ Admin dashboard with statistics
- ✅ User management (list, suspend, activate)
- ✅ View all transactions
- ✅ Two-tier system: admin & customer

## 🛠️ Setup

```bash
# Iniciar serviços (da raiz do projeto)
docker compose up -d postgres backend

# Executar migrations
docker compose exec backend php artisan migrate

# Executar seeders (dados de teste)
docker compose exec backend php artisan db:seed

# Limpar cache
docker compose exec backend php artisan optimize:clear
```

## 🧪 Tests

```bash
# Run all tests
docker compose exec backend php artisan test

# Run with coverage
docker compose exec backend php artisan test --coverage

# Run specific test
docker compose exec backend php artisan test --filter=AuthTest
```

## 📖 API Endpoints

### Public Routes

```http
GET  /api/health          # Health check
POST /api/v1/register     # User registration
POST /api/v1/login        # Login
```

### Authenticated Routes (Bearer token required)

#### Authentication

```http
POST /api/v1/logout       # Logout
GET  /api/v1/me           # Get authenticated user
```

#### Profile

```http
GET  /api/v1/profile      # View profile
PUT  /api/v1/profile      # Update profile
```

#### Addresses

```http
GET    /api/v1/addresses         # List addresses
POST   /api/v1/addresses         # Create address
GET    /api/v1/addresses/{id}    # View address
PUT    /api/v1/addresses/{id}    # Update address
DELETE /api/v1/addresses/{id}    # Delete address
```

#### Documents

```http
GET    /api/v1/documents          # List documents
POST   /api/v1/documents          # Upload document
GET    /api/v1/documents/status   # Document status
GET    /api/v1/documents/{id}     # View document
DELETE /api/v1/documents/{id}     # Delete document
```

#### Wallet

```http
GET /api/v1/wallet          # View wallet
GET /api/v1/wallet/balance  # View balance
```

#### Transactions

```http
GET  /api/v1/transactions              # Transaction history
GET  /api/v1/transactions/{id}         # Transaction details
POST /api/v1/transactions/deposit      # Make deposit
POST /api/v1/transactions/transfer     # Make transfer
POST /api/v1/transactions/{id}/reverse # Reverse transaction
```

#### Admin (Admin role required)

```http
GET   /api/v1/admin/users              # List all users
GET   /api/v1/admin/users/{user}       # View specific user
PATCH /api/v1/admin/users/{user}/suspend   # Suspend user
PATCH /api/v1/admin/users/{user}/activate  # Activate user
GET   /api/v1/admin/stats              # Dashboard statistics
GET   /api/v1/admin/transactions       # All transactions
```

**Total:** 29 RESTful endpoints (23 regular + 6 admin)

Complete documentation: http://localhost:8080 (Swagger UI)

## 🔄 Comandos Úteis

```bash
# Acessar container
docker compose exec backend bash

# Ver rotas
php artisan route:list

# Executar tinker
php artisan tinker

# Criar migration
php artisan make:migration create_table_name

# Criar model com tudo
php artisan make:model ModelName -mfsc

# Executar migrations
php artisan migrate

# Rollback
php artisan migrate:rollback

# Fresh (⚠️ apaga dados)
php artisan migrate:fresh

# Fresh + seed
php artisan migrate:fresh --seed
```

## 📊 Models & Database

### Models (7)

- **User** - System users
- **Address** - User addresses
- **UserDocument** - User documents
- **Wallet** - Digital wallets
- **Transaction** - Financial transactions
- **TransactionLog** - Transaction logs
- **LgpdAuditLog** - LGPD audit trail

### Enums (6)

- **UserStatus** - active, inactive, blocked
- **WalletStatus** - active, inactive, blocked
- **TransactionType** - deposit, transfer, reversal
- **TransactionStatus** - pending, processing, completed, failed, reversed
- **DocumentType** - CPF, RG, CNH, passport, etc.
- **ArchiveReason** - user_request, lgpd_compliance, etc.

Complete schema: `docs/architecture/database-schema.md`

## 🏗️ Arquitetura

```text
Request → Route → FormRequest → Controller → Service → Model → Database
                                    ↓
                                 Response
```

### Camadas

- **Routes** (`routes/api.php`) - Definição de rotas
- **FormRequests** (`app/Http/Requests/`) - Validação de entrada
- **Controllers** (`app/Http/Controllers/Api/`) - Orquestração
- **Services** (`app/Services/`) - Lógica de negócio
- **Models** (`app/Models/`) - Entidades do domínio
- **Enums** (`app/Enums/`) - Constantes tipadas

## 🔐 Security

- ✅ Laravel Sanctum (Bearer tokens)
- ✅ BCrypt password hashing
- ✅ Validation on all endpoints
- ✅ Rate limiting (60 req/min)
- ✅ CORS configured
- ✅ CSRF protection
- ✅ UUID v7 (non-sequential)
- ✅ Row locking for transactions

## 📝 Configuration

Main configuration files:

- `config/database.php` - PostgreSQL configuration
- `config/sanctum.php` - Sanctum configuration
- `config/cors.php` - CORS configuration
- `.env` - Environment variables

## 🌍 Timezone

All dates/times are in **America/Sao_Paulo** (UTC-3).

## 📚 Additional Documentation

- [Setup Guide](../docs/setup-guide.md)
- [Database Schema](../docs/architecture/database-schema.md)
- [Swagger UI](http://localhost:8080)
