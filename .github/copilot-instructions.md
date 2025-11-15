# GitHub Copilot Instructions

## Git coments

When writing git commit messages, follow these guidelines:
- Use the Airbnb style guide:
  - always write in English and small letters
  - Format: `type(scope): subject`
  - Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
  - Scope is optional but recommended (e.g., auth, wallet, transaction)
  - Subject must be lowercase
  - Do not end the subject with a period
  - Limit the header to 72 characters
  - Use the imperative mood (e.g., "add feature" not "added feature")
  - Separate body and footer with blank lines
- Examples:
  - `feat(auth): add jwt authentication`
  - `fix(wallet): correct balance calculation`
  - `docs: update api documentation`
  - `refactor(transaction): extract validation logic`
- A git hook validates all commits automatically




## Docs

Put all documentation md files in the `docs/` folder.

## Docker File Permissions Issue

**Prevention:** Add to `docker-compose.yml` services:

```
  user: "${UID:-1000}:${GID:-1000}"
```

**Problem:** Docker creates files as root, causing permission errors when editing in VSCode.

**Solution Applied:** Added `user: "${UID:-1000}:${GID:-1000}"` to all services in `docker-compose.yml`:

**Issue:** Docker containers use UTC by default, causing 3-hour difference from São Paulo time.

**Prevention:** `docker-compose.yml` is already configured with `user: "${UID:-1000}:${GID:-1000}"`.

**Solution Applied:** All containers configured with `TZ: America/Sao_Paulo`:

