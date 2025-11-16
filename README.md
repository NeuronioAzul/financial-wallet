# Financial Wallet MVP 💰

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?logo=php)](https://php.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql)](https://postgresql.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Tests](https://img.shields.io/badge/Tests-Passing-success)](backend/tests)

Carteira digital completa desenvolvida com Laravel 12, React.js 18 e PostgreSQL 18.

## 🚀 Tecnologias

- **Backend:** PHP 8.4-FPM + Laravel 12 + Sanctum
- **Frontend:** React.js 18 + TypeScript + Vite + TailwindCSS
- **Database:** PostgreSQL 18 com UUID v7
- **Infrastructure:** Docker + Docker Compose
- **Tests:** Pest (backend) + ESLint (frontend)
- **API Docs:** Swagger UI

## 📋 Funcionalidades

### ✅ Implementado (MVP Completo)

#### Backend

- ✅ Cadastro e autenticação de usuários (Sanctum)
- ✅ Transferências entre usuários com concurrency control
- ✅ Depósitos na carteira
- ✅ Reversão de transações (estornos)
- ✅ Validação de saldo em tempo real
- ✅ Gerenciamento de perfil do usuário
- ✅ Gerenciamento de endereços
- ✅ Gerenciamento de documentos (CPF, RG, CNH, etc.)
- ✅ Auditoria LGPD completa
- ✅ Rate limiting (60 req/min)
- ✅ UUID v7 em todas as entidades
- ✅ 23 endpoints RESTful
- ✅ Histórico completo de transações
- ✅ Compliance LGPD

#### Frontend

- ✅ Páginas de Login e Registro
- ✅ Recuperação de senha
- ✅ Dashboard com resumo financeiro
- ✅ Histórico de transações com filtros e paginação
- ✅ Página de perfil do usuário
- ✅ Modais de depósito e transferência
- ✅ Design system completo (Ocean Blue theme)
- ✅ Componentes reutilizáveis (UI components)
- ✅ Validação de formulários com Zod
- ✅ Notificações toast
- ✅ Layout responsivo

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
# Backend
cd /home/mauro/projects/grupo-adriano/backend && docker compose exec backend php artisan test

# Ou use o script
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

- [Setup Guide](./docs/SETUP.md)
- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)
- [Database Schema](./docs/architecture/database-schema.md)
- [Design System](./docs/design-system.md)
- [Implementation Journey](./docs/implementation-journey.md)
- [API Documentation (Swagger)](http://localhost:8080)
- [Commit Convention](.github/COMMIT_CONVENTION.md)

## 🔒 Segurança

- Autenticação via Laravel Sanctum (tokens Bearer)
- Hashing de senhas com BCrypt
- Validação de entrada em todas as requisições
- Rate limiting (60 requisições/minuto)
- CORS configurado
- Proteção CSRF
- UUID v7 para IDs (não sequenciais)

## 🐳 Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| Backend | financial-wallet-backend | 8000 | API Laravel + PHP 8.4 |
| Frontend | financial-wallet-frontend | 3000 | React 18 + Vite |
| PostgreSQL | financial-wallet-db | 5432 | PostgreSQL 18 |
| Swagger | financial-wallet-swagger | 8080 | API Documentation |

## 📊 Status do Projeto

- **Backend:** ✅ MVP Completo
- **Frontend:** ✅ MVP Completo
- **Database:** ✅ Schema implementado com LGPD
- **Tests:** ✅ Backend testado
- **Docker:** ✅ Ambiente containerizado
- **API Docs:** ✅ Swagger atualizado

## 🛠️ Comandos Úteis

```bash
# Iniciar ambiente completo
./scripts/inicia-ambiente-dev.sh

# Executar testes backend
./scripts/test.sh

# Ver logs
docker compose logs -f

# Acessar container backend
docker compose exec backend bash

# Acessar container frontend
docker compose exec frontend sh

# Parar ambiente
docker compose down

# Limpar volumes (⚠️ apaga dados)
docker compose down -v
```

## 📈 Próximos Passos

- [ ] Implementar notificações em tempo real (WebSockets)
- [ ] Adicionar suporte a múltiplas moedas
- [ ] Implementar 2FA (autenticação de dois fatores)
- [ ] Dashboard administrativo
- [ ] Relatórios e exportação de dados
- [ ] Testes E2E no frontend
- [ ] CI/CD pipeline
- [ ] Deploy em produção

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feat/nova-feature`)
3. Commit suas mudanças seguindo o padrão Airbnb
4. Push para a branch (`git push origin feat/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Mauro Rocha Tavares**

- Email: mauro.rocha.t@gmail.com
- GitHub: [@NeuronioAzul](https://github.com/NeuronioAzul)

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
