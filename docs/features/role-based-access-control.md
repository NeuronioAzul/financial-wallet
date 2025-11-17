# Role-Based Access Control (RBAC)

## Overview

The application implements a two-tier role-based access control system using [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission/v6/introduction).

## Roles

### Customer (Default)
- **Assigned to**: All new user registrations
- **Permissions**: Standard user permissions
  - View own wallet
  - Make deposits
  - Make transfers
  - View own transaction history
  - Manage own profile
  - Manage own addresses
  - Upload documents

### Admin
- **Assigned to**: Manually by database seeder or another admin
- **Permissions**: All customer permissions plus:
  - `view users` - View all users
  - `create users` - Create new users
  - `edit users` - Edit user details
  - `delete users` - Delete users
  - `suspend users` - Suspend/activate users
  - `view all transactions` - View all transactions
  - `reverse transactions` - Reverse transactions
  - `view audit logs` - View audit logs
  - `access admin dashboard` - Access admin panel

## Implementation

### User Model

The `User` model uses the `HasRoles` trait from Spatie:

```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
    // ...
}
```

### Auto-Assignment on Registration

When a user registers, they are automatically assigned the `customer` role:

```php
// app/Services/AuthService.php
public function register(array $data): array
{
    // ... user creation
    $user->assignRole('customer');
    // ...
}
```

### Admin Middleware

The `EnsureUserIsAdmin` middleware protects admin-only routes:

```php
// app/Http/Middleware/EnsureUserIsAdmin.php
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

### Protected Routes

Admin routes are protected with both `auth:sanctum` and `admin` middleware:

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

## Admin API Endpoints

### User Management

**List all users**
```
GET /api/v1/admin/users?status=active&search=john&per_page=15
```

**Show specific user**
```
GET /api/v1/admin/users/{user}
```

**Suspend user**
```
PATCH /api/v1/admin/users/{user}/suspend
```
Note: Cannot suspend another admin.

**Activate user**
```
PATCH /api/v1/admin/users/{user}/activate
```

### Statistics

**Get admin dashboard stats**
```
GET /api/v1/admin/stats
```

Response:
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

### Transactions

**List all transactions**
```
GET /api/v1/admin/transactions?type=transfer&status=completed&date_from=2024-01-01&user_id={uuid}
```

## Test Users

After running `php artisan migrate:fresh --seed`:

- **Admin**: `joao@example.com` / `password`
- **Customer**: `maria@example.com` / `password`

## Testing

Run admin access tests:
```bash
php artisan test --filter=AdminAccessTest
```

## Database Tables

Spatie creates the following tables:
- `roles` - Role definitions
- `permissions` - Permission definitions
- `model_has_roles` - User-role assignments (UUID-compatible)
- `model_has_permissions` - Direct user permissions
- `role_has_permissions` - Role-permission assignments

## Checking Roles and Permissions

```php
// Check if user has role
$user->hasRole('admin');

// Check if user has permission
$user->hasPermissionTo('view users');

// Get all user roles
$user->getRoleNames();

// Get all user permissions
$user->getAllPermissions();

// Assign role
$user->assignRole('admin');

// Remove role
$user->removeRole('customer');
```

## Security Notes

1. ✅ UUIDs are used for all user IDs (not sequential integers)
2. ✅ Admin role is required for all `/admin/*` endpoints
3. ✅ Admins cannot suspend other admins
4. ✅ Role assignment happens automatically on registration
5. ✅ All admin actions should be logged (future: audit log)
6. ✅ Frontend hides admin menu for non-admin users

## Future Enhancements

- [ ] Add more granular permissions for specific admin actions
- [ ] Implement audit logging for admin actions
- [ ] Add ability to create custom roles
- [ ] Add permission management UI in admin panel
- [ ] Add role management (assign/revoke admin role via UI)

