<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_admin_endpoints(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(200);
    }

    public function test_customer_cannot_access_admin_endpoints(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole('customer');

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Acesso negado. Apenas administradores podem acessar este recurso.'
            ]);
    }

    public function test_unauthenticated_user_cannot_access_admin_endpoints(): void
    {
        $response = $this->getJson('/api/v1/admin/users');

        $response->assertStatus(401);
    }

    public function test_admin_can_list_all_users(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        User::factory()->count(5)->create()->each(function ($user) {
            $user->assignRole('customer');
        });

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'status', 'created_at']
                ]
            ]);
    }

    public function test_admin_can_get_stats(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'users' => ['total', 'active', 'inactive', 'blocked'],
                'transactions' => ['total', 'today', 'this_month'],
            ]);
    }

    public function test_admin_can_suspend_user(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $customer = User::factory()->create();
        $customer->assignRole('customer');

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$customer->id}/suspend");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Usuário suspenso com sucesso.'
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'status' => 3, // BLOCKED
        ]);
    }

    public function test_admin_cannot_suspend_another_admin(): void
    {
        $admin1 = User::factory()->create();
        $admin1->assignRole('admin');

        $admin2 = User::factory()->create();
        $admin2->assignRole('admin');

        $response = $this->actingAs($admin1, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$admin2->id}/suspend");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Não é possível suspender um administrador.'
            ]);
    }

    public function test_admin_can_activate_user(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $customer = User::factory()->create(['status' => 3]); // BLOCKED
        $customer->assignRole('customer');

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$customer->id}/activate");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Usuário ativado com sucesso.'
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'status' => 1, // ACTIVE
        ]);
    }
}
