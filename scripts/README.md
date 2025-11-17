# Scripts de Automação

Scripts bash para automação de tarefas de desenvolvimento, setup e testes do projeto Financial Wallet.

## 📋 Scripts Disponíveis

### 1. inicia-ambiente-dev.sh

**Descrição:** Script principal que configura e inicia todo o ambiente de desenvolvimento.

**O que faz:**

- ✅ Verifica se Docker e Docker Compose estão instalados
- ✅ Cria arquivo `.env` se não existir
- ✅ Inicia todos os containers (backend, frontend, postgres, swagger)
- ✅ Aguarda o PostgreSQL ficar pronto (health check)
- ✅ Executa migrations automaticamente
- ✅ Executa seeders (dados de teste)
- ✅ Exibe URLs de acesso aos serviços
- ✅ Mostra status dos containers

**Uso:**

```bash
./scripts/inicia-ambiente-dev.sh
```

**Pré-requisitos:**

- Docker 20.10+
- Docker Compose 2.0+

**Saída esperada:**

```text
🚀 Iniciando ambiente de desenvolvimento...
✅ Docker instalado
✅ Docker Compose instalado
✅ Arquivo .env criado
🐳 Iniciando containers...
⏳ Aguardando PostgreSQL...
✅ PostgreSQL pronto
📊 Executando migrations...
✅ Migrations concluídas
🌱 Populando banco de dados...
✅ Seeders executados

🎉 Ambiente pronto!

📍 URLs de acesso:
   Frontend:  http://localhost:3000
   Backend:   http://localhost:8000
   Swagger:   http://localhost:8080
   Postgres:  localhost:5432
```

---

### 2. setup-git.sh

**Descrição:** Configura Git hooks e templates para o projeto.

**O que faz:**

- ✅ Configura commit template com guidelines
- ✅ Instala git hook para validação de commits
- ✅ Valida formato Airbnb de commits
- ✅ Cria estrutura necessária em `.git/hooks/`

**Uso:**

```bash
./scripts/setup-git.sh
```

**Hook de Validação:**

O script instala um hook `commit-msg` que valida:

- ✅ Formato: `type(scope): subject`
- ✅ Types válidos: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
- ✅ Subject em lowercase
- ✅ Sem ponto final no subject
- ✅ Header com máximo 72 caracteres

**Exemplo de commits válidos:**

```bash
feat(auth): add jwt authentication
fix(wallet): correct balance calculation
docs: update api documentation
```

---

### 3. test.sh

**Descrição:** Executa todos os testes do backend.

**O que faz:**

- ✅ Verifica se os containers estão rodando
- ✅ Executa testes do backend com PHPUnit
- ✅ Exibe resultados formatados
- ✅ Retorna código de saída apropriado

**Uso:**

```bash
# Método recomendado
cd /home/mauro/projects/grupo-adriano/backend && docker compose exec backend php artisan test

# Ou use o script
./scripts/test.sh

# Com cobertura
cd /home/mauro/projects/grupo-adriano/backend && docker compose exec backend php artisan test --coverage

# Filtrar testes específicos
cd /home/mauro/projects/grupo-adriano/backend && docker compose exec backend php artisan test --filter=AuthTest
```

**Testes executados:**

- Feature tests (endpoints da API)
- Unit tests (services e lógica de negócio)

**Saída esperada:**

```text
🧪 Executando testes do backend...

PASS  Tests\Feature\AuthTest
✓ user can register
✓ user can login
✓ user can logout
...

Tests:    18 passed
Duration: 2.34s
```

---

### 4. test-api.sh

**Descrição:** Testa os principais endpoints da API REST usando curl.

**O que faz:**

- ✅ Health check da API
- ✅ Teste de registro de usuário
- ✅ Teste de login
- ✅ Teste de endpoint autenticado (/me)
- ✅ Teste de consulta de saldo
- ✅ Formatação de output JSON

**Uso:**

```bash
./scripts/test-api.sh
```

**O que é testado:**

1. `GET /api/health` - Verifica se API está online
2. `POST /api/v1/register` - Testa registro
3. `POST /api/v1/login` - Testa login e pega token
4. `GET /api/v1/me` - Testa autenticação
5. `GET /api/v1/wallet/balance` - Testa endpoint protegido

**Saída esperada:**

```text
🔍 Testando API...

1. Health Check...
✅ API online

2. Registro de usuário...
✅ Usuário registrado

3. Login...
✅ Login realizado
Token: 1|abc123...

4. Endpoint /me...
✅ Autenticação funcionando

5. Saldo da carteira...
✅ Saldo obtido
```

---

## 🚀 Uso Comum

### Setup Inicial do Projeto

```bash
# 1. Configurar Git
./scripts/setup-git.sh

# 2. Iniciar ambiente
./scripts/inicia-ambiente-dev.sh

# 3. Executar testes
./scripts/test.sh
```

### Dia a Dia de Desenvolvimento

```bash
# Iniciar ambiente
./scripts/inicia-ambiente-dev.sh

# Executar testes após mudanças
./scripts/test.sh

# Testar API manualmente
./scripts/test-api.sh
```

### Debug e Troubleshooting

```bash
# Ver logs dos containers
docker compose logs -f

# Reiniciar ambiente
docker compose restart

# Limpar e reiniciar
docker compose down
./scripts/inicia-ambiente-dev.sh
```

## 📝 Notas Importantes

### Permissões

Todos os scripts precisam de permissão de execução:

```bash
chmod +x scripts/*.sh
```

### Execução

Os scripts devem ser executados da **raiz do projeto**:

```bash
# ✅ Correto
./scripts/inicia-ambiente-dev.sh

# ❌ Errado
cd scripts
./inicia-ambiente-dev.sh
```

### Dependências

Certifique-se de ter instalado:

- Docker 20.10+
- Docker Compose 2.0+
- Git 2.0+
- curl (para test-api.sh)
- jq (opcional, para formatação JSON)

## 🛠️ Customização

### Variáveis de Ambiente

Crie/edite `.env` na raiz do projeto:

```bash
# Portas
BACKEND_PORT=8000
FRONTEND_PORT=3000
DB_PORT=5432
SWAGGER_PORT=8080

# Database
DB_DATABASE=financial_wallet
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### Modificar Scripts

Os scripts são arquivos bash simples e podem ser modificados conforme necessário.

## 📚 Documentação Adicional

- [Setup Guide](../docs/SETUP.md) - Setup completo do ambiente
- [Backend README](../backend/README.md) - Comandos do Laravel
- [Frontend README](../frontend/README.md) - Comandos do React
- [README Principal](../README.md) - Visão geral do projeto
