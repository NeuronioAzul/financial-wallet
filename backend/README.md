# Backend - Financial Wallet API

API REST da carteira financeira digital desenvolvida com Laravel 12, PHP 8.4 e PostgreSQL 18.

## 🚀 Stack

- **PHP 8.4** + **Laravel 12**
- **PostgreSQL 18** com UUID v7
- **Laravel Sanctum** para autenticação
- **Pest 3** para testes
- **Docker** para desenvolvimento

## 📋 Funcionalidades

### Autenticação

- ✅ Registro de usuários com validação de CPF
- ✅ Login com email/password
- ✅ Logout com revogação de tokens
- ✅ Endpoint `/me` para usuário autenticado

### Perfil do Usuário

- ✅ Visualizar perfil
- ✅ Atualizar dados do perfil
- ✅ Validação completa

### Endereços

- ✅ CRUD completo de endereços
- ✅ Múltiplos endereços por usuário
- ✅ Validação de CEP

### Documentos

- ✅ Upload de documentos (CPF, RG, CNH, etc.)
- ✅ Status de aprovação
- ✅ Listagem e consulta

### Carteira Digital

- ✅ Consulta de carteira
- ✅ Consulta de saldo
- ✅ Validação de propriedade

### Transações

- ✅ Depósitos
- ✅ Transferências entre usuários
- ✅ Estornos (reversões)
- ✅ Histórico completo
- ✅ Concurrency control com row locking
- ✅ Validação de saldo em tempo real

### LGPD & Auditoria

- ✅ Arquivamento de usuários
- ✅ Log de auditoria
- ✅ Histórico de transações
- ✅ Compliance completo

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

## 🧪 Testes

```bash
# Executar todos os testes
cd /home/mauro/projects/grupo-adriano/backend && docker compose exec backend php artisan test

# Testes com cobertura
cd /home/mauro/projects/grupo-adriano/backend && docker compose exec backend php artisan test --coverage

# Testes específicos
cd /home/mauro/projects/grupo-adriano/backend && docker compose exec backend php artisan test --filter=AuthTest
```

## 📖 API Endpoints

### Públicos

```http
GET  /api/health          # Health check
POST /api/v1/register     # Registro
POST /api/v1/login        # Login
```

### Autenticados (requer token Bearer)

#### Auth

```http
POST /api/v1/logout       # Logout
GET  /api/v1/me           # Usuário autenticado
```

#### Profile

```http
GET  /api/v1/profile      # Ver perfil
PUT  /api/v1/profile      # Atualizar perfil
```

#### Addresses

```http
GET    /api/v1/addresses         # Listar endereços
POST   /api/v1/addresses         # Criar endereço
GET    /api/v1/addresses/{id}    # Ver endereço
PUT    /api/v1/addresses/{id}    # Atualizar endereço
DELETE /api/v1/addresses/{id}    # Deletar endereço
```

#### Documents

```http
GET    /api/v1/documents          # Listar documentos
POST   /api/v1/documents          # Upload documento
GET    /api/v1/documents/status   # Status dos documentos
GET    /api/v1/documents/{id}     # Ver documento
DELETE /api/v1/documents/{id}     # Deletar documento
```

#### Wallet

```http
GET /api/v1/wallet          # Ver carteira
GET /api/v1/wallet/balance  # Ver saldo
```

#### Transactions

```http
GET  /api/v1/transactions              # Histórico
GET  /api/v1/transactions/{id}         # Detalhes
POST /api/v1/transactions/deposit      # Depósito
POST /api/v1/transactions/transfer     # Transferência
POST /api/v1/transactions/{id}/reverse # Estorno
```

**Total:** 23 endpoints RESTful

Documentação completa: <http://localhost:8080> (Swagger UI)

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

- **User** - Usuários
- **Address** - Endereços
- **UserDocument** - Documentos
- **Wallet** - Carteiras
- **Transaction** - Transações
- **TransactionLog** - Logs
- **LgpdAuditLog** - Auditoria

### Enums (6)

- **UserStatus** - active, inactive, blocked
- **WalletStatus** - active, inactive, blocked
- **TransactionType** - deposit, transfer, reversal
- **TransactionStatus** - pending, processing, completed, failed, reversed
- **DocumentType** - CPF, RG, CNH, passport, etc.
- **ArchiveReason** - user_request, lgpd_compliance, etc.

Schema completo: `docs/architecture/database-schema.md`

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

## 🔐 Segurança

- ✅ Laravel Sanctum (tokens Bearer)
- ✅ Hashing BCrypt de senhas
- ✅ Validação em todos os endpoints
- ✅ Rate limiting (60 req/min)
- ✅ CORS configurado
- ✅ CSRF protection
- ✅ UUID v7 (não sequenciais)
- ✅ Row locking em transações

## 📝 Configuração

Principais arquivos de configuração:

- `config/database.php` - Configuração do PostgreSQL
- `config/sanctum.php` - Configuração do Sanctum
- `config/cors.php` - Configuração de CORS
- `.env` - Variáveis de ambiente

## 🌍 Timezone

Todas as datas/horas estão em **America/Sao_Paulo** (UTC-3).

## 📚 Documentação Adicional

- [Setup Guide](../docs/SETUP.md)
- [Database Schema](../docs/architecture/database-schema.md)
- [Implementation Journey](../docs/implementation-journey.md)
- [Swagger UI](http://localhost:8080)
