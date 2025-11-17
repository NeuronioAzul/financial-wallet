# Contributing to Financial Wallet

Thank you for considering contributing to the Financial Wallet project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's coding standards

## 🚀 Getting Started

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git 2.0+
- Node.js 18+ (for local development)
- PHP 8.4+ (for local development)

### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/financial-wallet.git
cd financial-wallet

# Add upstream remote
git remote add upstream https://github.com/NeuronioAzul/financial-wallet.git

# Setup Git hooks and templates
./scripts/setup-git.sh

# Configure environment
cp .env.example .env

# Start development environment
./scripts/inicia-ambiente-dev.sh
```

## 💻 Development Workflow

### 1. Create a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feat/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the project's coding standards
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run backend tests
docker compose exec backend php artisan test

# Run linter
docker compose exec backend composer pint
```

### 4. Commit Your Changes

Follow the Airbnb commit convention (see below).

```bash
git add .
git commit -m "feat(scope): add new feature"
```

### 5. Push and Create Pull Request

```bash
git push origin feat/your-feature-name
```

Then create a pull request on GitHub.

## 📝 Commit Convention

This project follows the **Airbnb commit message convention**. A git hook automatically validates all commits.

### Format

```
type(scope): subject

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config, etc.)
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert a previous commit

### Rules

- Use lowercase for type and scope
- Use imperative mood in subject ("add" not "added")
- Don't end subject with a period
- Keep subject line under 72 characters
- Separate subject from body with a blank line

### Examples

**Good commits ✅**
```bash
feat(auth): add jwt authentication
fix(wallet): correct balance calculation
docs: update api documentation
refactor(transaction): extract validation logic
test(wallet): add deposit unit tests
```

**Bad commits ❌**
```bash
Added new feature              # Missing type and scope
feat(Auth): Add feature        # Uppercase scope
feat: Add feature.             # Period at end
FEAT: add feature              # Uppercase type
```

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Ensure all tests pass
2. ✅ Update documentation
3. ✅ Follow commit convention
4. ✅ Rebase on latest main
5. ✅ Resolve conflicts

### PR Description

Provide a clear description:

- What does this PR do?
- Why is this change needed?
- How does it work?
- Any breaking changes?
- Screenshots (for UI changes)

### Review Process

- At least one approval required
- All checks must pass
- Address reviewer feedback
- Keep discussions professional

## 💎 Coding Standards

### Backend (Laravel/PHP)

- Follow PSR-12 coding standard
- Use Laravel Pint for code formatting
- Use type hints for method parameters and return types
- Write PHPDoc comments for complex methods
- Keep controllers thin, use services for business logic
- Use Form Requests for validation

```php
// Good ✅
public function transfer(TransferRequest $request): JsonResponse
{
    $result = $this->transactionService->transfer(
        $request->validated()
    );
    
    return response()->json($result);
}

// Bad ❌
public function transfer(Request $request)
{
    // Business logic in controller
    // Missing type hints
    // No validation
}
```

### Frontend (React/TypeScript)

- Use TypeScript for type safety
- Follow functional components with hooks
- Use named exports for components
- Keep components small and focused
- Use proper prop types
- Follow the established folder structure

```typescript
// Good ✅
export function WalletCard({ balance, currency }: WalletCardProps) {
  return (
    <div className="wallet-card">
      {formatCurrency(balance, currency)}
    </div>
  );
}

// Bad ❌
export default function Card(props: any) {
  // Using any type
  // Missing prop destructuring
  // Using default export
}
```

### Database

- Use UUID v7 for primary keys
- Add indexes for foreign keys
- Include proper constraints
- Write migrations that can be rolled back
- Document complex queries

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
docker compose exec backend php artisan test

# Run specific test
docker compose exec backend php artisan test --filter=TransactionTest

# Run with coverage
docker compose exec backend php artisan test --coverage
```

### Test Structure

```php
<?php

use Tests\TestCase;
use Database\Factories\UserFactory;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_make_deposit(): void
    {
        // Arrange
        $user = User::factory()->create();
        
        // Act
        $response = $this->actingAs($user)
            ->postJson('/api/v1/transactions/deposit', [
                'amount' => 100.00
            ]);
        
        // Assert
        $response->assertStatus(200);
        $this->assertEquals(100.00, $user->wallet->balance);
    }
}
```

## 📚 Documentation

### When to Update Documentation

- Adding new features
- Changing existing functionality
- Adding new configuration options
- Changing API endpoints
- Updating dependencies

### Documentation Files

- `README.md` - Project overview
- `docs/SETUP.md` - Setup instructions
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation
- `docs/architecture/` - Architecture docs
- `swagger/swagger.yml` - API documentation

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep it up to date
- Use proper markdown formatting

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test on latest version

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Ubuntu 22.04]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots.
```

## 📞 Getting Help

- Check the [documentation](./docs/)
- Search [existing issues](https://github.com/NeuronioAzul/financial-wallet/issues)
- Ask in pull request comments
- Contact: mauro.rocha.t@gmail.com

## 🙏 Thank You

Your contributions make this project better! Thank you for taking the time to contribute.

---

**Author:** Mauro Rocha Tavares  
**GitHub:** [@NeuronioAzul](https://github.com/NeuronioAzul)  
**Email:** mauro.rocha.t@gmail.com
