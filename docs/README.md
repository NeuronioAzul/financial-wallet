# Documentação - Financial Wallet

Documentação técnica completa do projeto Financial Wallet.

## 📚 Estrutura da Documentação

### Guias Principais

- **[SETUP.md](./SETUP.md)** - Guia completo de configuração do ambiente de desenvolvimento
- **[O-QUE-FOI-FEITO.md](./O-QUE-FOI-FEITO.md)** - Histórico de desenvolvimento e features implementadas
- **[implementation-journey.md](./implementation-journey.md)** - Jornada detalhada de implementação do MVP
- **[design-system.md](./design-system.md)** - Paleta de cores, tipografia e componentes do design system

### Documentação Técnica

#### Arquitetura

- **[architecture/database-schema.md](./architecture/database-schema.md)** - Schema completo do PostgreSQL 18
- **[architecture/laravel-installation.md](./architecture/laravel-installation.md)** - Instalação e configuração do Laravel 12

#### Testes

- **[testes-resumo.md](./testes-resumo.md)** - Resumo dos testes implementados
- **[test-fixtures.md](./test-fixtures.md)** - Dados de teste e fixtures

### Recursos Adicionais

- **[profile-feature.md](./profile-feature.md)** - Documentação da feature de perfil do usuário
- **[prompts.md](./prompts.md)** - Prompts utilizados durante o desenvolvimento
- **[LOVABLE_PROMPT.md](./LOVABLE_PROMPT.md)** - Prompt original do projeto

## 🗂️ Arquivos de Configuração

- **[db_schema_mvp.sql](./db_schema_mvp.sql)** - Schema SQL inicial do MVP
- **../.docker/postgres/init.sql** - Script de inicialização do PostgreSQL
- **../docker-compose.yml** - Configuração dos containers Docker

## 🔗 Links Rápidos

### Backend (Laravel 12)

- **Rotas da API:** `backend/routes/api.php`
- **Controllers:** `backend/app/Http/Controllers/Api/`
- **Models:** `backend/app/Models/`
- **Services:** `backend/app/Services/`
- **Testes:** `backend/tests/`
- **Migrations:** `backend/database/migrations/`

### Frontend (React 18)

- **Páginas:** `frontend/src/pages/`
- **Componentes:** `frontend/src/components/`
- **Serviços API:** `frontend/src/services/`
- **Contexts:** `frontend/src/contexts/`
- **Types:** `frontend/src/types/`

### API Documentation

- **Swagger UI:** <http://localhost:8080> (quando o ambiente estiver rodando)
- **Especificação OpenAPI:** `swagger/swagger.yml`

## 📊 Diagramas e Schemas

### Database Schema (PostgreSQL 18)

```text
users
├── id (UUID v7)
├── name
├── email (unique)
├── document (unique)
├── password (bcrypt)
└── status (1=active, 2=inactive, 3=blocked)

wallets
├── id (UUID v7)
├── user_id (FK)
├── currency (default: BRL)
├── balance (decimal 15,2)
└── status (1=active, 2=inactive, 3=blocked)

transactions
├── id (UUID v7)
├── wallet_id (FK)
├── type (1=deposit, 2=transfer, 3=reversal)
├── status (1=pending, 2=processing, 3=completed, 4=failed, 5=reversed)
├── amount (decimal 15,2)
├── sender_wallet_id (nullable)
├── receiver_wallet_id (nullable)
└── metadata (jsonb)
```

### Tabelas de Auditoria LGPD

- `users_history` - Usuários arquivados
- `wallets_history` - Carteiras arquivadas
- `transaction_logs` - Logs de transações
- `lgpd_audit_log` - Log de auditoria LGPD

## 🎯 Principais Features Documentadas

### Backend

1. **Autenticação** - Laravel Sanctum com tokens Bearer
2. **Carteira Digital** - Gerenciamento de saldo e operações
3. **Transações** - Depósitos, transferências e reversões
4. **Perfil do Usuário** - CRUD completo de perfil
5. **Endereços** - Gerenciamento de endereços
6. **Documentos** - Upload e validação de documentos
7. **LGPD Compliance** - Arquivamento e auditoria

### Frontend

1. **Autenticação** - Login, registro e recuperação de senha
2. **Dashboard** - Resumo financeiro e saldo
3. **Transações** - Histórico com filtros e paginação
4. **Operações** - Modais de depósito e transferência
5. **Perfil** - Visualização e edição de dados
6. **Design System** - Ocean Blue theme

## 🔍 Como Usar Esta Documentação

1. **Novo no projeto?** Comece pelo [SETUP.md](./SETUP.md)
2. **Quer entender o que foi feito?** Veja [O-QUE-FOI-FEITO.md](./O-QUE-FOI-FEITO.md)
3. **Precisa entender o banco de dados?** Consulte [architecture/database-schema.md](./architecture/database-schema.md)
4. **Quer saber sobre o design?** Acesse [design-system.md](./design-system.md)
5. **Procurando a jornada completa?** Leia [implementation-journey.md](./implementation-journey.md)

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação relevante acima
2. Consulte os arquivos README específicos (`backend/README.md`, `frontend/README.md`)
3. Verifique os comentários no código
4. Consulte o Swagger UI para documentação da API
