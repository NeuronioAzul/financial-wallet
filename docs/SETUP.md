# Setup do Ambiente de Desenvolvimento

Guia completo para configurar o ambiente de desenvolvimento do projeto Financial Wallet.

## 📋 Pré-requisitos

- **Docker** (versão 20.10+)
- **Docker Compose** (versão 2.0+)
- **Git** (versão 2.0+)
- **Node.js** 18+ (opcional, para desenvolvimento local do frontend)
- **PHP** 8.4+ (opcional, para desenvolvimento local do backend)

## 🚀 Setup Inicial

```bash
# 1. Clone o repositório
git clone <repository-url>
cd grupo-adriano

# 2. Configure o Git (commit template + hooks)
./scripts/setup-git.sh

# 3. Configure o ambiente
cp .env.example .env

# 4. Inicie o ambiente Docker
./scripts/inicia-ambiente-dev.sh
```

## 📝 Configuração do Git

### Commit Message Hook

Um git hook valida automaticamente todos os commits seguindo o padrão Airbnb.

**Localização:** `.git/hooks/commit-msg`

**O que valida:**

- ✅ Formato correto: `type(scope): subject`
- ✅ Type válido (feat, fix, docs, etc)
- ✅ Subject em lowercase
- ✅ Sem ponto final no subject
- ✅ Header com max 72 caracteres

### Commit Template

Template automático ao executar `git commit`:

```bash
# Configure (já feito pelo script setup-git.sh)
git config commit.template .gitmessage

# Ao fazer commit, você verá o template com guidelines
git commit
```

## 🎯 Exemplos de Commits

### Válidos ✅

```bash
git commit -m "feat(auth): add jwt authentication"
git commit -m "fix(wallet): correct balance calculation"
git commit -m "docs: update api documentation"
git commit -m "style(backend): format code with pint"
git commit -m "refactor(transaction): extract validation logic"
git commit -m "test(wallet): add deposit unit tests"
git commit -m "chore(deps): update laravel to 12.1"
```

### Inválidos ❌

```bash
git commit -m "Added new feature"          # Falta type
git commit -m "feat(Auth): Add feature"    # Uppercase
git commit -m "feat: Add feature."         # Ponto final
git commit -m "FEAT: add feature"          # Type uppercase
```

## 🛠️ Comandos Úteis

```bash
# Iniciar ambiente completo
./scripts/inicia-ambiente-dev.sh

# Executar testes backend
cd /home/mauro/projects/grupo-adriano/backend && docker compose exec backend php artisan test

# Ou use o script
./scripts/test.sh

# Ver logs de todos os serviços
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Acessar container backend
docker compose exec backend bash

# Acessar container frontend
docker compose exec frontend sh

# Executar migrations
docker compose exec backend php artisan migrate

# Executar seeders
docker compose exec backend php artisan db:seed

# Limpar cache do Laravel
docker compose exec backend php artisan optimize:clear

# Parar ambiente
docker compose down

# Parar e remover volumes (⚠️ apaga dados)
docker compose down -v
```

## 🐛 Troubleshooting

### Problema: Permissões de arquivo (Backend)

Se você encontrar erros de permissão no Laravel:

```bash
# Corrigir permissões do storage e cache
docker compose exec -u root backend chown -R www-data:www-data /var/www/html/storage
docker compose exec -u root backend chmod -R 775 /var/www/html/storage
```

### Problema: PostgreSQL não conecta

```bash
# Verificar se o container está rodando
docker compose ps postgres

# Verificar logs do PostgreSQL
docker compose logs postgres

# Reiniciar o serviço
docker compose restart postgres
```

### Problema: Frontend não atualiza

```bash
# Limpar node_modules e reinstalar
docker compose exec frontend rm -rf node_modules
docker compose exec frontend npm install

# Reiniciar o serviço
docker compose restart frontend
```

### Problema: Porta já em uso

Se alguma porta estiver em uso, edite o arquivo `.env` e mude as portas:

```bash
BACKEND_PORT=8001  # default: 8000
FRONTEND_PORT=3001 # default: 3000
SWAGGER_PORT=8081  # default: 8080
DB_PORT=5433       # default: 5432
```

### Problema: Migrations falham

```bash
# Resetar banco de dados
docker compose exec backend php artisan migrate:fresh

# Resetar e popular com dados de teste
docker compose exec backend php artisan migrate:fresh --seed
```

## 🔍 Verificação de Saúde

Após iniciar o ambiente, verifique se tudo está funcionando:

```bash
# Health check da API
curl http://localhost:8000/api/health

# Verificar se todos os containers estão rodando
docker compose ps

# Verificar logs do backend
docker compose logs backend | tail -20

# Verificar logs do frontend
docker compose logs frontend | tail -20
```

## 🌐 Acesso aos Serviços

Após iniciar o ambiente, os serviços estarão disponíveis em:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | <http://localhost:3000> | Interface React |
| Backend API | <http://localhost:8000> | API Laravel |
| Swagger UI | <http://localhost:8080> | Documentação da API |
| PostgreSQL | localhost:5432 | Banco de dados |

### Credenciais de Teste

**Usuário 1:**

- Email: `joao@example.com`
- Senha: `password`
- Saldo inicial: R$ 1.000,00

**Usuário 2:**

- Email: `maria@example.com`
- Senha: `password`
- Saldo inicial: R$ 500,00

## 📚 Documentação Adicional

- [README Principal](../README.md) - Visão geral do projeto
- [Commit Convention](../.github/COMMIT_CONVENTION.md) - Guia completo de commits
- [Backend README](../backend/README.md) - Documentação do backend
- [Frontend README](../frontend/README.md) - Documentação do frontend
- [Database Schema](./architecture/database-schema.md) - Schema do banco de dados
- [Design System](./design-system.md) - Paleta de cores e componentes
