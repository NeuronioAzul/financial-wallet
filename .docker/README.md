# .docker

Configurações Docker para todos os serviços do projeto.

## Estrutura

- `backend/` - Dockerfile PHP 8.4 + configurações
- `frontend/` - Dockerfile Node.js 20 + React
- `postgres/` - Schema inicial do banco de dados

## Serviços

- **PostgreSQL 16** - Banco de dados com UUID v7 e LGPD compliance
- **PHP 8.4 FPM** - Backend Laravel 12
- **Node.js 20** - Frontend React + Vite

Todos os containers configurados com timezone `America/Sao_Paulo` e user/group do host para evitar problemas de permissão.
