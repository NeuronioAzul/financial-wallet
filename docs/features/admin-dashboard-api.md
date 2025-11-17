# Admin Dashboard API - Endpoints

## Visão Geral

Todos os endpoints do dashboard administrativo estão protegidos por autenticação Sanctum e pelo middleware `admin`, que verifica se o usuário possui a role de administrador.

**Base URL:** `http://localhost:8000/api/v1/admin/dashboard`

**Autenticação:** Bearer Token (Sanctum)

**Permissão Necessária:** Role `admin`

## Credenciais de Admin (Teste)

```
Email: admin@example.com
Password: admin123
```

## Endpoints Disponíveis

### 1. Overview do Dashboard

**GET** `/v1/admin/dashboard/overview`

Retorna estatísticas gerais do sistema.

**Resposta:**
```json
{
  "data": {
    "users": {
      "total": 3,
      "active": 3,
      "new_last_7_days": 2
    },
    "wallets": {
      "total": 3,
      "total_balance": "11600.00"
    },
    "transactions": {
      "total": 10,
      "total_value": "5000.00",
      "recent_7_days": 8,
      "by_type": {
        "deposit": { "count": 5, "total": "2000.00" },
        "transfer": { "count": 3, "total": "1500.00" },
        "withdrawal": { "count": 2, "total": "1500.00" }
      }
    }
  }
}
```

---

### 2. Gráfico de Transações

**GET** `/v1/admin/dashboard/transactions-chart`

**Query Parameters:**
- `days` (opcional): Número de dias para buscar dados (padrão: 30)

Retorna dados para gráfico de transações ao longo do tempo.

**Resposta:**
```json
{
  "data": [
    {
      "date": "2025-11-01",
      "count": 5,
      "total": "500.00"
    },
    {
      "date": "2025-11-02",
      "count": 8,
      "total": "850.00"
    }
  ]
}
```

---

### 3. Transações por Tipo

**GET** `/v1/admin/dashboard/transactions-by-type`

Retorna distribuição de transações por tipo.

**Resposta:**
```json
{
  "data": [
    {
      "type": "deposit",
      "label": "Deposit",
      "count": 50,
      "total": "10000.00"
    },
    {
      "type": "transfer",
      "label": "Transfer",
      "count": 30,
      "total": "5000.00"
    }
  ]
}
```

---

### 4. Crescimento de Usuários

**GET** `/v1/admin/dashboard/user-growth`

**Query Parameters:**
- `days` (opcional): Número de dias para buscar dados (padrão: 30)

Retorna dados de crescimento de usuários ao longo do tempo.

**Resposta:**
```json
{
  "data": [
    {
      "date": "2025-11-01",
      "new_users": 5,
      "total_users": 105
    },
    {
      "date": "2025-11-02",
      "new_users": 3,
      "total_users": 108
    }
  ]
}
```

---

### 5. Top Usuários

**GET** `/v1/admin/dashboard/top-users`

**Query Parameters:**
- `limit` (opcional): Número de usuários a retornar (padrão: 10)

Retorna usuários com maior volume de transações.

**Resposta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "transaction_count": 50,
      "total_volume": "15000.00"
    }
  ]
}
```

---

### 6. Atividade Recente

**GET** `/v1/admin/dashboard/recent-activity`

**Query Parameters:**
- `limit` (opcional): Número de atividades a retornar (padrão: 20)

Retorna atividades recentes (transações e novos usuários).

**Resposta:**
```json
{
  "data": [
    {
      "type": "transaction",
      "id": "uuid",
      "transaction_code": "TXN-001",
      "transaction_type": "transfer",
      "amount": "100.00",
      "status": "completed",
      "sender": {
        "id": "uuid",
        "name": "João",
        "email": "joao@example.com"
      },
      "receiver": {
        "id": "uuid",
        "name": "Maria",
        "email": "maria@example.com"
      },
      "created_at": "2025-11-17T10:30:00.000000Z"
    },
    {
      "type": "user",
      "id": "uuid",
      "name": "Pedro Santos",
      "email": "pedro@example.com",
      "created_at": "2025-11-17T09:15:00.000000Z"
    }
  ]
}
```

---

### 7. Estatísticas de Carteiras

**GET** `/v1/admin/dashboard/wallet-stats`

Retorna estatísticas detalhadas sobre carteiras.

**Resposta:**
```json
{
  "data": {
    "stats": {
      "total_wallets": 100,
      "active_wallets": 95,
      "total_balance": "250000.00",
      "average_balance": "2500.00",
      "max_balance": "50000.00",
      "min_balance": "0.00"
    },
    "distribution": {
      "0-100": 20,
      "101-500": 30,
      "501-1000": 25,
      "1001-5000": 20,
      "5001+": 5
    }
  }
}
```

---

### 8. Estatísticas de Transações

**GET** `/v1/admin/dashboard/transaction-stats`

Retorna estatísticas detalhadas sobre transações.

**Resposta:**
```json
{
  "data": {
    "by_status": {
      "completed": { "count": 100, "total": "50000.00" },
      "pending": { "count": 5, "total": "500.00" },
      "failed": { "count": 2, "total": "200.00" }
    },
    "by_type": {
      "deposit": { "count": 50, "total": "25000.00" },
      "transfer": { "count": 40, "total": "20000.00" },
      "withdrawal": { "count": 10, "total": "5000.00" }
    },
    "average_amount": "500.00",
    "success_rate": 93.46,
    "total_transactions": 107,
    "completed_transactions": 100
  }
}
```

---

## Middleware de Proteção

O middleware `EnsureUserIsAdmin` verifica:

1. Se o usuário está autenticado
2. Se o usuário possui a role `admin` (via Spatie Permission)

**Resposta de erro (403 Forbidden):**
```json
{
  "message": "Acesso negado. Apenas administradores podem acessar este recurso."
}
```

## Exemplos de Uso

### Fazer Login como Admin

```bash
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Acessar Dashboard Overview

```bash
curl -X GET http://localhost:8000/api/v1/admin/dashboard/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Obter Gráfico de Transações (últimos 7 dias)

```bash
curl -X GET "http://localhost:8000/api/v1/admin/dashboard/transactions-chart?days=7" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## Arquivos Criados

- **Controller:** `backend/app/Http/Controllers/Api/Admin/DashboardController.php`
- **Middleware:** `backend/app/Http/Middleware/EnsureUserIsAdmin.php` (já existia)
- **Seeder:** `backend/database/seeders/AdminUserSeeder.php`
- **Rotas:** Adicionadas em `backend/routes/api.php`

## Tecnologias Utilizadas

- Laravel 12
- Spatie Laravel Permission (roles & permissions)
- Laravel Sanctum (autenticação)
- PostgreSQL 18
- UUID v7

## Notas Importantes

1. Todos os endpoints retornam apenas dados de transações com status `COMPLETED` para cálculos financeiros
2. As datas nos gráficos são agrupadas por dia
3. Os valores monetários são retornados como strings para evitar problemas de precisão
4. O cálculo de success_rate considera todas as transações vs transações completadas
5. A distribuição de saldos em carteiras usa ranges pré-definidos
