<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_data(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '12345678901',
            'phone' => '11987654321',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'document', 'phone'],
                    'wallet' => ['id', 'balance', 'currency'],
                    'token',
                ],
            ])
            ->assertJson([
                'message' => 'User registered successfully',
                'data' => [
                    'user' => [
                        'name' => 'John Doe',
                        'email' => 'john@example.com',
                        'document' => '12345678901',
                        'phone' => '11987654321',
                    ],
                    'wallet' => [
                        'balance' => 0,
                        'currency' => 'BRL',
                    ],
                ],
            ]);

        // Verifica se o usuário foi criado no banco
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'document' => '12345678901',
        ]);

        // Verifica se a carteira foi criada
        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user->wallet);
        $this->assertEquals(0, $user->wallet->balance);
    }

    public function test_registration_requires_name(): void
    {
        $userData = [
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_registration_requires_email(): void
    {
        $userData = [
            'name' => 'John Doe',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_requires_valid_email(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_requires_unique_email(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $userData = [
            'name' => 'John Doe',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_requires_password(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_requires_password_confirmation(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_requires_matching_password_confirmation(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different-password',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_requires_strong_password(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'weak',
            'password_confirmation' => 'weak',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_requires_document(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document']);
    }

    public function test_registration_requires_document_with_11_digits(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '123456789', // Only 9 digits
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document']);
    }

    public function test_registration_requires_unique_document(): void
    {
        User::factory()->create(['document' => '12345678901']);

        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document']);
    }

    public function test_registration_accepts_formatted_document(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '123.456.789-01', // Formatted CPF
            'phone' => '(11) 98765-4321', // Formatted phone
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(201);

        // Verifica se foi salvo sem formatação
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'document' => '12345678901',
            'phone' => '11987654321',
        ]);
    }

    public function test_registration_phone_is_optional(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(201);
    }

    public function test_registration_returns_auth_token(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'document' => '12345678901',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(201);

        $token = $response->json('data.token');
        $this->assertNotEmpty($token);

        // Verifica se o token é válido
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'email' => 'john@example.com',
                ],
            ]);
    }

    public function test_login_endpoint_exists(): void
    {
        $response = $this->postJson('/api/v1/login', []);

        $response->assertStatus(422); // Espera validação falhar sem dados
    }
}
