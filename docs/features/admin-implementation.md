# Admin Implementation - Role-Based Access Control

## 📋 Overview

Implementação completa de controle de acesso baseado em roles (RBAC) utilizando **Spatie Laravel Permission** com dois níveis de acesso: **Admin** (acesso total) e **Customer** (acesso padrão).

**Data de Implementação:** 17 de Novembro de 2025  
**Pacote:** spatie/laravel-permission v6.23  
**Testes:** 145 passando (423 assertions)

---

## 🎯 Objetivos

1. Separar permissões entre administradores e clientes
2. Proteger rotas administrativas
3. Criar dashboard admin para gestão de usuários
4. Implementar estatísticas e relatórios administrativos
5. Garantir que novos usuários sejam automaticamente "customer"

---

## 🏗️ Arquitetura

### Backend

#### 1. Spatie Permission Package

**Instalação:**

```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

#### 2. Database Tables

Tabelas criadas (com adaptação para UUID):

- `roles` - Definição de roles
- `permissions` - Definição de permissões
- `model_has_roles` - Atribuição user-role (UUID-compatible)
- `model_has_permissions` - Permissões diretas de usuários
- `role_has_permissions` - Atribuição role-permission

**Adaptação UUID:**

O migration padrão do Spatie usa `unsignedBigInteger` para `model_id`, mas nosso sistema usa UUID. A migration foi modificada para usar `uuid()` em vez de `unsignedBigInteger()` nos campos `model_morph_key`.

#### 3. Roles & Permissions

**Roles:**

- **admin** - Acesso total ao sistema
- **customer** - Acesso padrão (carteira, transações próprias)

**Permissions (10 total):**

1. `view users` - Ver todos os usuários
2. `create users` - Criar novos usuários
3. `edit users` - Editar dados de usuários
4. `delete users` - Deletar usuários
5. `suspend users` - Suspender/ativar usuários
6. `view all transactions` - Ver todas as transações
7. `reverse transactions` - Estornar transações
8. `view audit logs` - Ver logs de auditoria
9. `access admin dashboard` - Acessar painel admin

**Seeder:**

```php
// database/seeders/RolesAndPermissionsSeeder.php
Role::create(['name' => 'admin'])->givePermissionTo(Permission::all());
Role::create(['name' => 'customer']); // sem permissões especiais
```

#### 4. User Model

**Modificação:**

```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
    // ...
}
```

#### 5. AuthService

**Auto-assignment de role:**

```php
public function register(array $data): array
{
    // ... criação do usuário
    $user->assignRole('customer'); // Automático
    // ...
}
```

#### 6. Middleware

**EnsureUserIsAdmin:**

```php
public function handle(Request $request, Closure $next): Response
{
    if (!$request->user() || !$request->user()->hasRole('admin')) {
        return response()->json([
            'message' => 'Acesso negado. Apenas administradores podem acessar este recurso.'
        ], 403);
    }
    return $next($request);
}
```

**Registro:**

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
    ]);
})
```

#### 7. Admin Controllers

**Admin\UserController:**

- `index()` - Lista todos os usuários (com filtros e busca)
- `show($user)` - Detalhes de usuário específico
- `suspend($user)` - Suspender usuário (não pode suspender outro admin)
- `activate($user)` - Ativar usuário suspenso

**Admin\StatsController:**

- `index()` - Estatísticas do dashboard (usuários, transações, volume)

**Admin\TransactionController:**

- `index()` - Lista todas as transações (com filtros)

#### 8. API Routes

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::patch('/users/{user}/suspend', [UserController::class, 'suspend']);
    Route::patch('/users/{user}/activate', [UserController::class, 'activate']);
    Route::get('/stats', [StatsController::class, 'index']);
    Route::get('/transactions', [TransactionController::class, 'index']);
});
```

#### 9. Auth Endpoints

**Modificação em `/login` e `/me`:**

```json
{
  "user": {
    "id": "...",
    "name": "João Silva",
    "email": "joao@example.com",
    "roles": ["admin"]  // Array de roles
  },
  "token": "..."
}
```

---

### Frontend

#### 1. Types

**User Interface:**

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  document: string;
  roles: string[];  // Array, não singular
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

// Helpers
export const isAdmin = (user: User | null): boolean => {
  return user?.roles?.includes('admin') ?? false;
};

export const isCustomer = (user: User | null): boolean => {
  return user?.roles?.includes('customer') ?? false;
};
```

#### 2. AdminPage Component

**Estrutura:**

- 3 abas: Users, Transactions, Audit
- Cards de estatísticas (total users, active, suspended, volume)
- Tabela de usuários com:
  - Busca por nome/email/documento
  - Filtro por status
  - Ações: Suspender/Ativar
- Proteção: `useEffect` verifica `isAdmin(user)` e redireciona se não for admin

#### 3. DashboardHeader

**Badge de Role:**

```tsx
const getRoleBadge = (roles: string[]) => {
  const isAdminUser = roles?.includes('admin');
  return isAdminUser ? badges.admin : badges.customer;
};
```

**Menu Admin:**

```tsx
{isAdmin(user) && (
  <button onClick={() => navigate("/admin")}>
    <Shield size={16} />
    Painel Admin
  </button>
)}
```

#### 4. Legal Pages

- **TermsPage** - Termos e Condições
- **PrivacyPage** - Política de Privacidade LGPD

---

## 🧪 Testes

### AdminAccessTest (8 testes)

1. ✅ `test_admin_can_access_admin_endpoints`
2. ✅ `test_customer_cannot_access_admin_endpoints`
3. ✅ `test_unauthenticated_user_cannot_access_admin_endpoints`
4. ✅ `test_admin_can_list_all_users`
5. ✅ `test_admin_can_get_stats`
6. ✅ `test_admin_can_suspend_user`
7. ✅ `test_admin_cannot_suspend_another_admin`
8. ✅ `test_admin_can_activate_user`

### Test Setup

**TestCase modificado:**

```php
protected function setUp(): void
{
    parent::setUp();
    
    // Seed roles automaticamente em todos os testes
    if ($this->usesRefreshDatabase()) {
        $this->seed(RolesAndPermissionsSeeder::class);
    }
}
```

**Resultado:**

- Total: 145 testes passando
- Assertions: 423
- Duração: ~9s

---

## 📊 Endpoints Admin

### GET /api/v1/admin/users

Lista todos os usuários com paginação.

**Query Params:**

- `status` - Filtrar por status (active, inactive, blocked)
- `search` - Buscar por nome/email/documento
- `per_page` - Itens por página (padrão: 15)

**Response:**

```json
{
  "current_page": 1,
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "status": 1,
      "wallet": {
        "balance": "1000.00",
        "currency": "BRL"
      },
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "per_page": 15,
  "total": 150
}
```

### GET /api/v1/admin/users/{user}

Detalhes de usuário específico.

**Response:**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "document": "12345678901",
  "wallet": {...},
  "addresses": [...],
  "documents": [...]
}
```

### PATCH /api/v1/admin/users/{user}/suspend

Suspender usuário (não pode suspender admin).

**Response (200):**

```json
{
  "message": "Usuário suspenso com sucesso.",
  "user": {...}
}
```

**Response (403):**

```json
{
  "message": "Não é possível suspender um administrador."
}
```

### PATCH /api/v1/admin/users/{user}/activate

Ativar usuário suspenso.

### GET /api/v1/admin/stats

Estatísticas do dashboard.

**Response:**

```json
{
  "users": {
    "total": 150,
    "active": 140,
    "inactive": 5,
    "blocked": 5
  },
  "transactions": {
    "total": 1250,
    "today": 25,
    "this_month": 380,
    "total_volume": "125000.00",
    "volume_today": "2500.00",
    "volume_this_month": "38000.00"
  },
  "wallets": {
    "total_balance": "45000.00"
  }
}
```

### GET /api/v1/admin/transactions

Lista todas as transações.

**Query Params:**

- `type` - Filtrar por tipo (transfer, deposit, reversal)
- `status` - Filtrar por status
- `date_from` - Data início (Y-m-d)
- `date_to` - Data fim (Y-m-d)
- `user_id` - Filtrar por usuário
- `per_page` - Itens por página (padrão: 15)

---

## 🔐 Segurança

### Medidas Implementadas

1. ✅ **Middleware Admin** - Todas as rotas `/admin/*` protegidas
2. ✅ **UUID v7** - IDs não-sequenciais previnem enumeração
3. ✅ **Role Check** - Frontend verifica role antes de mostrar UI
4. ✅ **Admin Protection** - Admins não podem suspender outros admins
5. ✅ **Auto-Assignment** - Novos usuários automaticamente "customer"
6. ✅ **Bearer Token** - Autenticação Sanctum obrigatória

### Responses de Erro

**401 Unauthorized:**

```json
{
  "message": "Unauthenticated."
}
```

**403 Forbidden:**

```json
{
  "message": "Acesso negado. Apenas administradores podem acessar este recurso."
}
```

---

## 👥 Usuários de Teste

Após executar `php artisan migrate:fresh --seed`:

**Admin:**

- Email: `joao@example.com`
- Senha: `password`
- Role: `admin`
- Saldo: R$ 1.000,00

**Customer:**

- Email: `maria@example.com`
- Senha: `password`
- Role: `customer`
- Saldo: R$ 500,00

---

## 📝 Checagem de Roles

### Backend (PHP)

```php
// Verificar role
$user->hasRole('admin');

// Verificar permissão
$user->hasPermissionTo('view users');

// Obter roles
$user->getRoleNames(); // ['admin']

// Atribuir role
$user->assignRole('admin');

// Remover role
$user->removeRole('customer');
```

### Frontend (TypeScript)

```typescript
// Verificar se é admin
isAdmin(user);

// Verificar se é customer
isCustomer(user);

// Obter roles
user.roles; // ['admin']

// Verificar role específica
user.roles?.includes('admin');
```

---

## 🎨 UI Changes

### Badges

- **Admin:** Azul royal (`bg-royal-blue-light/20 text-royal-blue-dark`)
- **Customer:** Ocean blue (`bg-ocean-blue/10 text-ocean-blue`)

### Menu

Link "Painel Admin" aparece apenas para usuários com role `admin`.

### Proteção de Rotas

`AdminPage` verifica `isAdmin(user)` no `useEffect` e redireciona para `/dashboard` se não for admin.

---

## 🚀 Future Enhancements

- [ ] Adicionar mais permissões granulares
- [ ] Implementar audit logging para ações admin
- [ ] Criar UI para gerenciar roles e permissions
- [ ] Adicionar capacidade de criar roles customizadas
- [ ] Implementar gestão de permissões por usuário (além de roles)
- [ ] Adicionar filtros avançados na listagem de usuários
- [ ] Implementar exportação de relatórios admin
- [ ] Adicionar charts e gráficos no dashboard admin

---

## 📚 Documentação Relacionada

- [Role-Based Access Control](./role-based-access-control.md)
- [API Reference](../api-reference.md)
- [Backend README](../../backend/README.md)
- [Frontend README](../../frontend/README.md)
- [Changelog Detalhado](./changelog-detalhado.md)

---

**Última Atualização:** 17 de Novembro de 2025  
**Status:** ✅ Completo e Testado

