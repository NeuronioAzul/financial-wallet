# O Que Foi Feito

## Estrutura do Repositório

Monorepositório contendo backend Laravel, frontend React, documentação e scripts de automação.
A estrutura do repositório foi organizada para separar claramente as responsabilidades e facilitar a manutenção do código. Abaixo está a estrutura principal:

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

## Configurações Docker

As configurações Docker foram organizadas na pasta `.docker/`, contendo subpastas para cada serviço do projeto:

- `backend/` - Dockerfile e configurações para o backend Laravel
- `frontend/` - Dockerfile para o frontend React
- `postgres/` - Schema inicial do banco de dados PostgreSQL

## Configuração do POSTGRESQL

PostgreSQL 18 foi escolhido como banco de dados devido à sua robustez, suporte a UUID v7 e compliance com a LGPD.
A configuração inicial do banco de dados está localizada em `.docker/postgres/init.sql`

## Backend Laravel 12

O backend foi desenvolvido utilizando Laravel 12, aproveitando suas funcionalidades modernas e suporte a PHP 8.4.

A estrutura do backend está organizada na pasta `backend/`, contendo todas as pastas e arquivos necessários para o funcionamento da API.

- Adicionado:

composer require laravel/sanctum
composer require ramsey/uuid

`sudo chown -R $USER:$USER storage bootstrap/cache && chmod -R 775 storage bootstrap/cache`

`chown -R $USER:$USER storage bootstrap/cache && chmod -R 775 storage bootstrap/cache && composer dump-autoload`

`php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`

`php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`

HasUuidV7.php




