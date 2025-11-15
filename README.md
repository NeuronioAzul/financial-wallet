# Financial Wallet MVP 💰

[![Laravel](https://img.shields.io/badge/Laravel-12.38-FF2D20?logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?logo=php)](https://php.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql)](https://postgresql.org)
[![Tests](https://img.shields.io/badge/Tests-18%20passed-success)](backend/tests)

Carteira digital completa desenvolvida com Laravel 12, React.js e PostgreSQL 18.

## 🚀 Tecnologias

- **Backend:** PHP 8.4-FPM + Laravel 12 + Sanctum
- **Frontend:** React.js 18 + Vite + TailwindCSS *(em desenvolvimento)*
- **Database:** PostgreSQL 18 com UUID v7
- **Infrastructure:** Docker + Docker Compose
- **Tests:** Pest (backend - 18/18 ✅) + Jest (frontend)
- **API Docs:** Swagger UI

## 📋 Funcionalidades

### ✅ Implementado (MVP Backend)

- ✅ Cadastro e autenticação de usuários (Sanctum)
- ✅ Transferências entre usuários com concurrency control
- ✅ Depósitos na carteira
- ✅ Reversão de transações (estornos)
- ✅ Validação de saldo em tempo real
- ✅ Auditoria LGPD completa
- ✅ Rate limiting (60 req/min)
- ✅ UUID v7 em todas as entidades
- ✅ 11 endpoints RESTful testados
- ✅ Histórico de transações
- ✅ Compliance LGPD

## 🏗️ Estrutura do Projeto

```text
grupo-adriano/
├── .docker/          # Configurações Docker
├── .github/          # CI/CD workflows
├── backend/          # API Laravel
├── frontend/         # Interface React
├── docs/             # Documentação
├── scripts/          # Scripts de automação
└── docker-compose.yml
```

## ⚡ Quick Start

```bash
# 1. Clone o repositório
git clone <repository-url>
cd grupo-adriano

# 2. Configure o ambiente
cp .env.example .env

# 3. Inicie o ambiente de desenvolvimento
./scripts/inicia-ambiente-dev.sh
```

Acesse:

- Backend API: <http://localhost:8000>
- Frontend: <http://localhost:3000>
- Swagger: <http://localhost:8080>
- PostgreSQL: localhost:5432

## 🧪 Testes

```bash
./scripts/test.sh
```

## 📋 Commit Guidelines

Este projeto usa o padrão Airbnb para commits:

```bash
type(scope): subject
```

**Exemplos:**

- `feat(auth): add jwt authentication`
- `fix(wallet): correct balance calculation`
- `docs: update api documentation`

Ver [Commit Convention](.github/COMMIT_CONVENTION.md) para detalhes completos.

Um git hook valida automaticamente todos os commits.

## 📚 Documentação

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)
- [Docker](/.docker/README.md)
- [API Docs](./docs/api/)

## 🔒 Segurança

- Senhas hasheadas com bcrypt
- UUID v7 para IDs
- Validação de dados no backend
- Proteção contra SQL injection
- Audit trail completo
- Compliance LGPD

## 👥 Usuários de Teste

- **Email:** <joao@example.com> | **Senha:** password
- **Email:** <maria@example.com> | **Senha:** password

## 📄 Licença

Este projeto é um MVP para teste técnico.
