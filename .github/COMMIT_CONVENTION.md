# Commit Message Guidelines (Airbnb Style)

Follow the Airbnb commit message convention for all commits in this project.

## Format

```
type(scope): subject

body (optional)

footer (optional)
```

## Rules

1. **All lowercase** - Types, scopes, and subjects must be lowercase
2. **No period** - Subject must not end with a period
3. **Max 72 characters** - Header (type + scope + subject) limited to 72 chars
4. **Imperative mood** - Use "add" not "added" or "adds"
5. **Blank lines** - Separate body and footer with blank lines

## Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style (formatting, semicolons, etc)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (dependencies, config, etc)
- `perf:` - Performance improvements
- `ci:` - CI/CD configuration changes
- `build:` - Build system changes
- `revert:` - Revert previous commit

## Scope (optional)

The scope provides context:
- `auth` - Authentication
- `wallet` - Wallet functionality
- `transaction` - Transactions
- `user` - User management
- `api` - API endpoints
- `db` - Database
- `docker` - Docker configuration

## Examples

### Good commits ✅

```bash
feat(auth): add jwt authentication
fix(wallet): correct balance calculation on transfer
docs: update api documentation
style(backend): format code with pint
refactor(transaction): extract validation logic to service
test(wallet): add unit tests for deposit method
chore(deps): update laravel to 12.1
perf(db): add index on transactions table
ci: add github actions workflow
```

### Bad commits ❌

```bash
Added new feature          # Missing type
feat(Auth): Add feature    # Uppercase
feat: Add feature.         # Ends with period
FEAT: add feature          # Type uppercase
feat add feature           # Missing colon
```

## Body (optional)

Explain **what** and **why**, not **how**:

```
feat(wallet): add transaction reversal

Implement reversal functionality to allow users to
reverse transactions in case of errors or fraud.

This adds a new endpoint POST /transactions/{id}/reverse
and updates the transaction status accordingly.
```

## Footer (optional)

Reference issues or breaking changes:

```
fix(api): correct validation error response

BREAKING CHANGE: API now returns 422 instead of 400
Closes #123
```

## Git Hook

A commit-msg hook is installed to validate all commits automatically.
Invalid commits will be rejected with helpful error messages.

## Quick Reference

```bash
# Feature
git commit -m "feat(auth): add password reset endpoint"

# Bug fix
git commit -m "fix(wallet): prevent negative balance"

# Documentation
git commit -m "docs: add api examples to readme"

# Code style
git commit -m "style: format with prettier"

# Refactoring
git commit -m "refactor(user): simplify validation logic"

# Tests
git commit -m "test(transaction): add reversal tests"

# Chores
git commit -m "chore(deps): update dependencies"
```
