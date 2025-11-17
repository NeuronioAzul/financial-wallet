# Financial Wallet MVP - Version 1.0.0

## 🎉 Release Highlights

Este é o primeiro release oficial do **Financial Wallet MVP**, uma carteira digital completa desenvolvida com Laravel 12, React 18 e PostgreSQL 18.

## ✨ Principais Funcionalidades

### Backend (API RESTful - 23 endpoints)

- **Autenticação:** Sistema completo com Laravel Sanctum (register, login, logout, me)
- **Perfil:** CRUD completo de perfil do usuário
- **Endereços:** Gestão de endereços com validação de CEP
- **Documentos:** Upload e gerenciamento de documentos (CPF, RG, CNH, etc)
- **Wallet:** Consulta de saldo e informações da carteira
- **Transações:**
  - Depósito
  - Transferência entre usuários
  - Estorno de transações
  - Histórico completo com filtros e paginação
- **LGPD:** Sistema de auditoria e arquivamento de dados

### Frontend (React SPA)

- **Páginas:** Login, Register, ForgotPassword, Dashboard, TransactionHistory, Profile
- **Componentes:**
  - DashboardHeader
  - WalletCard
  - RecentTransactions
  - Modals (Deposit/Transfer)
- **Design System:** Ocean Blue theme com TailwindCSS
- **Validação:** Zod + React Hook Form
- **Auth:** Bearer token via AuthContext

## 🛠️ Stack Tecnológica

### Backend
- Laravel 12 + PHP 8.4
- Laravel Sanctum (autenticação)
- PostgreSQL 18 (UUID v7)
- PHPUnit 12 (testes)
- Docker

### Frontend
- React 18 + TypeScript 5.5
- Vite 5.3 + TailwindCSS 3.4
- React Router v6
- React Hook Form + Zod
- Axios

### Infraestrutura
- Docker Compose
- Nginx (Swagger UI)

## 🗄️ Database

- **UUID v7** em todas as tabelas
- **Tabelas principais:** users, addresses, user_documents, wallets, transactions, transaction_logs
- **LGPD:** users_history, wallets_history, lgpd_audit_log
- **Features:** Functions, Triggers, Views, Indexes otimizados

## 🔒 Segurança

- Sanctum (Bearer tokens)
- BCrypt password hashing
- Form Request validation
- Rate limiting (60 req/min)
- CORS, CSRF protection
- UUID v7 (não sequenciais)
- Row locking em transações

## 🧪 Testes

- Feature tests para todos os endpoints
- Unit tests para services
- PHPUnit + RefreshDatabase
- Factories para User, Wallet, Transaction

## 📚 Documentação

- API Documentation (Swagger UI)
- Setup Guide
- Architecture Documentation
- Database Schema
- Design System

## 🚀 Quick Start

```bash
# Clone o repositório
git clone https://github.com/NeuronioAzul/financial-wallet.git
cd financial-wallet

# Inicie o ambiente
./scripts/inicia-ambiente-dev.sh

# Acesse:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Swagger: http://localhost:8080
```

## 🧑‍💻 Credenciais de Teste

- **User 1:** joao@example.com / password (R$ 1.000)
- **User 2:** maria@example.com / password (R$ 500)

## 📝 Commit Guidelines

Padrão Airbnb validado por git hook:
- Format: `type(scope): subject`
- Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

## 🎨 Design System

**Cores:**
- Primary: #003161 (Ocean Blue)
- Secondary: #00610D (Forest Green)
- Accent: #DAB655 (Golden Sand)
- Success: #00610D
- Danger: #610019
- Royal Blue: #3D58B6

## 📦 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8080
- PostgreSQL: localhost:5432

---

**Desenvolvido por:** Mauro Rocha Tavares
**Licença:** MIT
