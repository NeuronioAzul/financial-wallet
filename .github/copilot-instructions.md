# GitHub Copilot Instructions

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

