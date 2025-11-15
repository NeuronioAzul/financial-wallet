# Backend - Financial Wallet API

API REST da carteira financeira digital desenvolvida com Laravel 12 e PostgreSQL 16.

## 🚀 Stack

- **PHP 8.4** + **Laravel 12**
- **PostgreSQL 16** com UUID v7
- **Pest 3** para testes
- **Docker** para desenvolvimento

## 🛠️ Setup

```bash
# Iniciar serviços (da raiz do projeto)
docker compose up -d postgres backend

# Executar migrations
docker compose exec backend php artisan migrate
```

## 🧪 Testes

```bash
# Com Pest
docker compose exec backend php artisan test

# Com cobertura
docker compose exec backend php artisan test --coverage
```

## 📖 API

Documentação Swagger: http://localhost:8080

## 🔄 Comandos Úteis

```bash
# Acessar container
docker compose exec backend bash

# Limpar cache
php artisan optimize:clear

# Ver rotas
php artisan route:list

# Executar tinker
php artisan tinker
```

## 📊 Schema do Banco

Schema completo em `/.docker/postgres/init.sql` com:
- UUID v7
- LGPD compliance
- Audit trail
- Functions e triggers
