# Development Environment Setup

Complete guide to configure the Financial Wallet development environment.

## 📋 Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git** (version 2.0+)
- **Node.js** 18+ (optional, for local frontend development)
- **PHP** 8.4+ (optional, for local backend development)

## 🚀 Initial Setup

```bash
# Clone the repository
git clone https://github.com/NeuronioAzul/financial-wallet.git
cd financial-wallet

# Configure Git (commit template + hooks)
./scripts/setup-git.sh

# Configure environment
cp .env.example .env

# Start Docker environment
./scripts/inicia-ambiente-dev.sh
```

## 📝 Git Configuration

### Commit Message Hook

A git hook automatically validates all commits following the Airbnb convention.

**Location:** `.git/hooks/commit-msg`

**Validation:**
- ✅ Correct format: `type(scope): subject`
- ✅ Valid type (feat, fix, docs, etc)
- ✅ Subject in lowercase
- ✅ No period at the end of subject
- ✅ Header max 72 characters

### Commit Template

Automatic template when running `git commit`:

```bash
# Already configured by setup-git.sh
git config commit.template .gitmessage

# When committing, you'll see the template with guidelines
git commit
```

## 🎯 Commit Examples

### Valid ✅

```bash
git commit -m "feat(auth): add jwt authentication"
git commit -m "fix(wallet): correct balance calculation"
git commit -m "docs: update api documentation"
git commit -m "style(backend): format code with pint"
git commit -m "refactor(transaction): extract validation logic"
git commit -m "test(wallet): add deposit unit tests"
git commit -m "chore(deps): update laravel to 12.1"
```

### Invalid ❌

```bash
git commit -m "Added new feature"          # Missing type
git commit -m "feat(Auth): Add feature"    # Uppercase scope
git commit -m "feat: Add feature."         # Period at end
git commit -m "FEAT: add feature"          # Uppercase type
```

## 🛠️ Useful Commands

```bash
# Start complete environment
./scripts/inicia-ambiente-dev.sh

# Run backend tests
docker compose exec backend php artisan test
# Or use the script
./scripts/test.sh

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Access backend container
docker compose exec backend bash

# Access frontend container
docker compose exec frontend sh

# Run migrations
docker compose exec backend php artisan migrate

# Run seeders
docker compose exec backend php artisan db:seed

# Clear Laravel cache
docker compose exec backend php artisan optimize:clear

# Stop environment
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

## 🐛 Troubleshooting

### File Permission Issues (Backend)

If you encounter permission errors in Laravel:

```bash
# Fix storage and cache permissions
docker compose exec -u root backend chown -R www-data:www-data /var/www/html/storage
docker compose exec -u root backend chmod -R 775 /var/www/html/storage
```

### PostgreSQL Connection Issues

```bash
# Check if container is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Restart service
docker compose restart postgres
```

### Frontend Not Updating

```bash
# Clear node_modules and reinstall
docker compose exec frontend rm -rf node_modules
docker compose exec frontend npm install

# Restart service
docker compose restart frontend
```

### Port Already in Use

If a port is already in use, edit the `.env` file and change the ports:

```bash
BACKEND_PORT=8001  # default: 8000
FRONTEND_PORT=3001 # default: 3000
SWAGGER_PORT=8081  # default: 8080
DB_PORT=5433       # default: 5432
```

### Migration Failures

```bash
# Reset database
docker compose exec backend php artisan migrate:fresh

# Reset and populate with test data
docker compose exec backend php artisan migrate:fresh --seed
```

## 🔍 Health Check

After starting the environment, verify everything is working:

```bash
# API health check
curl http://localhost:8000/api/health

# Verify all containers are running
docker compose ps

# Check backend logs
docker compose logs backend | tail -20

# Check frontend logs
docker compose logs frontend | tail -20
```

## 🌐 Service Access

After starting the environment, services are available at:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React interface |
| Backend API | http://localhost:8000 | Laravel API |
| Swagger UI | http://localhost:8080 | API documentation |
| PostgreSQL | localhost:5432 | Database |

### Test Credentials

**User 1:**
- Email: `joao@example.com`
- Password: `password`
- Initial balance: R$ 1,000.00

**User 2:**
- Email: `maria@example.com`
- Password: `password`
- Initial balance: R$ 500.00

## 📚 Additional Documentation

- [Main README](../README.md) - Project overview
- [Commit Convention](../.github/COMMIT_CONVENTION.md) - Complete commit guide
- [Backend README](../backend/README.md) - Backend documentation
- [Frontend README](../frontend/README.md) - Frontend documentation
- [Database Schema](./architecture/database-schema.md) - Database schema
- [Design System](./design-system.md) - Color palette and components
