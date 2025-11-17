# GitHub Copilot Instructions

## Projeto: Financial Wallet MVP

Sistema de carteira digital desenvolvido com Laravel 12, React 18 e PostgreSQL 18.

### Stack Tecnológica

**Backend:**
- Laravel 12 + PHP 8.4 + Sanctum
- PostgreSQL 18 (UUID v7)
- PHPUnit 12 (testes)
- Docker

**Frontend:**
- React 18 + TypeScript 5.5
- Vite 5.3 + TailwindCSS 3.4
- React Router v6
- React Hook Form + Zod
- Axios

**Infraestrutura:**
- Docker Compose
- Nginx (Swagger UI)

### Estrutura do Projeto

```
grupo-adriano/
├── .docker/          # Configs Docker (backend, frontend, postgres)
├── .github/          # Copilot instructions, workflows
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Enums/           # UserStatus, TransactionType, etc
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # Auth, Profile, Wallet, Transaction, etc
│   │   │   └── Requests/         # FormRequests com validação
│   │   ├── Models/          # User, Wallet, Transaction, Address, etc
│   │   └── Services/        # Lógica de negócio
│   ├── database/
│   │   ├── migrations/      # Schema do banco
│   │   └── seeders/
│   ├── routes/api.php       # 23 endpoints RESTful
│   └── tests/               # Feature + Unit tests
├── frontend/         # React SPA
│   └── src/
│       ├── components/      # UI + features
│       ├── contexts/        # AuthContext
│       ├── pages/           # Login, Dashboard, etc
│       ├── services/        # API clients
│       └── types/
├── docs/             # Documentação
├── scripts/          # Scripts de automação
└── swagger/          # OpenAPI docs
```

### Funcionalidades Implementadas

**Backend (23 endpoints):**
- Autenticação (Sanctum): register, login, logout, me
- Perfil: CRUD de perfil do usuário
- Endereços: CRUD de endereços
- Documentos: Upload e gestão (CPF, RG, CNH, etc)
- Wallet: consulta de saldo e carteira
- Transações: depósito, transferência, estorno, histórico
- LGPD: auditoria e arquivamento

**Frontend:**
- Páginas: Login, Register, ForgotPassword, Dashboard, TransactionHistory, Profile
- Componentes: DashboardHeader, WalletCard, RecentTransactions, Modals (Deposit/Transfer)
- Design System: Ocean Blue theme
- Validação: Zod + React Hook Form
- Auth: Bearer token via AuthContext

### Database (PostgreSQL 18)

**Tabelas Principais:**
- users, addresses, user_documents
- wallets, transactions
- transaction_logs

**LGPD:**
- users_history, wallets_history
- lgpd_audit_log

**Features:**
- UUID v7 em todas as tabelas
- Function `archive_user()` para LGPD
- Triggers, Views, Indexes

### Git Commits

Padrão Airbnb (validado por git hook):

**Formato:** `type(scope): subject`

**Types:** feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

**Regras:**
- Subject em lowercase
- Sem ponto final
- Máximo 72 caracteres
- Imperativo (add, não added)

**Exemplos:**
- `feat(auth): add jwt authentication`
- `fix(wallet): correct balance calculation`
- `docs: update api documentation`
- `refactor(transaction): extract validation logic`

### Docker

**Services:**
- backend: Laravel (porta 8000)
- frontend: React (porta 3000)
- postgres: PostgreSQL 18 (porta 5432)
- swagger: Docs (porta 8080)

**Configuração Importante:**
```yaml
user: "${UID:-1000}:${GID:-1000}"  # Previne problemas de permissão
environment:
  TZ: America/Sao_Paulo            # Timezone São Paulo (UTC-3)
```

**Problemas Comuns:**

*Permissões (Backend):*
```bash
docker compose exec -u root backend chown -R www-data:www-data /var/www/html/storage
docker compose exec -u root backend chmod -R 775 /var/www/html/storage
```

*PostgreSQL:*
```bash
docker compose ps postgres
docker compose logs postgres
docker compose restart postgres
```

### Comandos Essenciais

**Setup:**
```bash
./scripts/inicia-ambiente-dev.sh
```

**Testes:**
```bash
.../grupo-adriano/backend && docker compose exec backend php artisan test
```

**Database:**
```bash
docker compose exec backend php artisan migrate [--fresh] [--seed]
```

**Cache:**
```bash
docker compose exec backend php artisan optimize:clear
```

**Logs:**
```bash
docker compose logs -f [backend|frontend|postgres]
```

### Design System

**Cores:**
- Primary: `#003161` (Ocean Blue)
- Secondary: `#00610D` (Forest Green)
- Accent: `#DAB655` (Golden Sand)
- Success: `#00610D`
- Danger: `#610019`
- Royal Blue: `#3D58B6`

**Tipografia:**
- Fonte: Noto Sans
- Border Radius: 12-16px
- Transições: Cubic-bezier elastic

### Arquitetura Backend

```
Request → FormRequest → Controller → Service → Model → Database
```

**Models (7):** User, Address, UserDocument, Wallet, Transaction, TransactionLog, LgpdAuditLog  
**Enums (6):** UserStatus, WalletStatus, TransactionType, TransactionStatus, DocumentType, ArchiveReason  
**Services (5):** Auth, Profile, Address, Wallet, Transaction

### Segurança

- Sanctum (Bearer tokens)
- BCrypt password hashing
- Form Request validation
- Rate limiting (60 req/min)
- CORS, CSRF protection
- UUID v7 (não sequenciais)
- Row locking em transações

### Testes

**Backend:**
- Feature tests (endpoints)
- Unit tests (services)
- RefreshDatabase trait
- Factories para User, Wallet, Transaction

### Credenciais de Teste

- User 1: `joao@example.com` / `password` (R$ 1.000)
- User 2: `maria@example.com` / `password` (R$ 500)

### URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8080`
- Database: `localhost:5432`

### Documentação

- Setup: `docs/setup-guide.md`
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Database: `docs/architecture/database-schema.md`
- Design: `docs/design-system.md`
- Features: `docs/features/changelog-detalhado.md`
- API: `docs/api-reference.md`
- Architecture: `docs/architecture.md`

### Boas Práticas

1. **Sempre** usar UUID v7 para novos models
2. **Sempre** criar FormRequest para validação
3. **Sempre** usar Services para lógica de negócio
4. **Sempre** criar testes para novos endpoints
5. **Sempre** seguir o padrão de commits Airbnb
6. **Sempre** colocar docs em `docs/`
7. **Timezone:** America/Sao_Paulo em todos os containers
8. **Permissões:** usar `user: "${UID:-1000}:${GID:-1000}"` no docker-compose

