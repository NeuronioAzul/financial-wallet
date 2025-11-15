# Financial Wallet MVP

Carteira financeira digital desenvolvida com Laravel 12, React.js e PostgreSQL 16.

## 🚀 Tecnologias

- **Backend:** PHP 8.4 + Laravel 12
- **Frontend:** React.js 18 + Vite + TailwindCSS
- **Database:** PostgreSQL 16 com UUID v7
- **Infrastructure:** Docker + Docker Compose
- **Tests:** Pest (backend) + Jest (frontend)
- **CI/CD:** GitHub Actions

## 📋 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ Transferências entre usuários
- ✅ Depósitos na carteira
- ✅ Reversão de transações
- ✅ Validação de saldo
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
