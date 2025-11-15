# Setup do Ambiente de Desenvolvimento

Guia rápido para configurar o ambiente de desenvolvimento do projeto.

## 📋 Pré-requisitos

- Docker & Docker Compose
- Git

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
# Iniciar ambiente
./scripts/inicia-ambiente-dev.sh

# Executar testes
./scripts/test.sh

# Ver logs
docker compose logs -f

# Parar ambiente
docker compose down
```

## 📚 Documentação Adicional

- [Commit Convention](.github/COMMIT_CONVENTION.md) - Guia completo de commits
- [Backend README](./backend/README.md) - Documentação do backend
- [Frontend README](./frontend/README.md) - Documentação do frontend
