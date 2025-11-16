<?php

namespace Tests\Unit\Services;

use App\Models\Address;
use App\Models\User;
use App\Services\AddressService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddressServiceTest extends TestCase
{
    use RefreshDatabase;

    private AddressService $service;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new AddressService();
        $this->user = User::factory()->create();
    }

    public function test_create_address_sets_first_as_primary(): void
    {
        $data = [
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];

        $address = $this->service->createAddress($this->user, $data);

        $this->assertTrue($address->is_primary);
    }

    public function test_create_address_marks_only_one_as_primary(): void
    {
        Address::factory()->create(['user_id' => $this->user->id, 'is_primary' => true]);

        $data = [
            'zip_code' => '87654321',
            'street' => 'Rua Nova',
            'number' => '456',
            'neighborhood' => 'Bairro',
            'city' => 'Rio de Janeiro',
            'state' => 'RJ',
            'is_primary' => true,
        ];

        $this->service->createAddress($this->user, $data);

        $this->assertEquals(1, $this->user->addresses()->where('is_primary', true)->count());
    }

    public function test_update_address(): void
    {
        $address = Address::factory()->create(['user_id' => $this->user->id]);

        $updated = $this->service->updateAddress($address, ['street' => 'Rua Atualizada']);

        $this->assertEquals('Rua Atualizada', $updated->street);
    }

    public function test_delete_address(): void
    {
        $address = Address::factory()->create(['user_id' => $this->user->id]);

        $result = $this->service->deleteAddress($address);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
    }

    public function test_get_user_addresses_orders_by_primary_first(): void
    {
        Address::factory()->create(['user_id' => $this->user->id, 'is_primary' => false]);
        Address::factory()->create(['user_id' => $this->user->id, 'is_primary' => true]);

        $addresses = $this->service->getUserAddresses($this->user);

        $this->assertTrue($addresses->first()->is_primary);
    }
}
