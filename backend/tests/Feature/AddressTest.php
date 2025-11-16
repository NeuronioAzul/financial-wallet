<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddressTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Cria usuário autenticado para os testes
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_user_can_create_address_with_valid_data(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'complement' => 'Apto 45',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
            'country' => 'Brazil',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'zip_code',
                    'street',
                    'number',
                    'complement',
                    'neighborhood',
                    'city',
                    'state',
                    'country',
                    'is_primary',
                    'created_at',
                ],
            ])
            ->assertJson([
                'data' => [
                    'zip_code' => '12345678',
                    'street' => 'Rua Teste',
                    'number' => '123',
                    'city' => 'São Paulo',
                    'state' => 'SP',
                ],
            ]);

        $this->assertDatabaseHas('addresses', [
            'user_id' => $this->user->id,
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
        ]);
    }

    public function test_address_requires_authentication(): void
    {
        $response = $this->postJson('/api/v1/addresses', []);

        $response->assertStatus(401);
    }

    public function test_address_requires_zip_code(): void
    {
        $addressData = [
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['zip_code']);
    }

    public function test_address_requires_valid_zip_code_format(): void
    {
        $addressData = [
            'zip_code' => '123', // Invalid format
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['zip_code']);
    }

    public function test_address_accepts_formatted_zip_code(): void
    {
        $addressData = [
            'zip_code' => '12345-678', // Formatted
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(201);

        // Verifica se foi salvo sem formatação
        $this->assertDatabaseHas('addresses', [
            'user_id' => $this->user->id,
            'zip_code' => '12345678',
        ]);
    }

    public function test_address_requires_street(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['street']);
    }

    public function test_address_requires_number(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['number']);
    }

    public function test_address_complement_is_optional(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(201);
    }

    public function test_address_requires_neighborhood(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['neighborhood']);
    }

    public function test_address_requires_city(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['city']);
    }

    public function test_address_requires_state(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['state']);
    }

    public function test_address_requires_valid_state_format(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SAO', // Invalid - must be 2 characters
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['state']);
    }

    public function test_address_country_defaults_to_brazil(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'country' => 'Brazil',
                ],
            ]);
    }

    public function test_user_can_list_their_addresses(): void
    {
        Address::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/addresses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'zip_code', 'street', 'number', 'city', 'state'],
                ],
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_view_specific_address(): void
    {
        $address = Address::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/addresses/{$address->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $address->id,
                    'zip_code' => $address->zip_code,
                    'street' => $address->street,
                ],
            ]);
    }

    public function test_user_cannot_view_other_users_address(): void
    {
        $otherUser = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/addresses/{$address->id}");

        $response->assertStatus(403);
    }

    public function test_user_can_update_their_address(): void
    {
        $address = Address::factory()->create(['user_id' => $this->user->id]);

        $updateData = [
            'street' => 'Rua Atualizada',
            'number' => '456',
        ];

        $response = $this->withToken($this->token)
            ->putJson("/api/v1/addresses/{$address->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'street' => 'Rua Atualizada',
                    'number' => '456',
                ],
            ]);

        $this->assertDatabaseHas('addresses', [
            'id' => $address->id,
            'street' => 'Rua Atualizada',
            'number' => '456',
        ]);
    }

    public function test_user_cannot_update_other_users_address(): void
    {
        $otherUser = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $otherUser->id]);

        $updateData = [
            'street' => 'Rua Atualizada',
        ];

        $response = $this->withToken($this->token)
            ->putJson("/api/v1/addresses/{$address->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_their_address(): void
    {
        $address = Address::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->deleteJson("/api/v1/addresses/{$address->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('addresses', [
            'id' => $address->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_address(): void
    {
        $otherUser = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->deleteJson("/api/v1/addresses/{$address->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('addresses', [
            'id' => $address->id,
        ]);
    }

    public function test_first_address_is_set_as_primary(): void
    {
        $addressData = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/addresses', $addressData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'is_primary' => true,
                ],
            ]);
    }
}
