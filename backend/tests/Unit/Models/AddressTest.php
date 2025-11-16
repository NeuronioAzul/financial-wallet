<?php

namespace Tests\Unit\Models;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddressTest extends TestCase
{
    use RefreshDatabase;

    public function test_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $address->user);
        $this->assertEquals($user->id, $address->user->id);
    }

    public function test_has_default_is_primary_false(): void
    {
        $address = new Address();

        $this->assertFalse($address->is_primary);
    }

    public function test_has_default_country_brazil(): void
    {
        $address = new Address();

        $this->assertEquals('Brazil', $address->country);
    }

    public function test_fillable_attributes(): void
    {
        $data = [
            'user_id' => User::factory()->create()->id,
            'zip_code' => '12345678',
            'street' => 'Rua Teste',
            'number' => '123',
            'complement' => 'Apto 1',
            'neighborhood' => 'Centro',
            'city' => 'São Paulo',
            'state' => 'SP',
            'country' => 'Brazil',
            'is_primary' => true,
        ];

        $address = Address::create($data);

        $this->assertEquals('Rua Teste', $address->street);
        $this->assertTrue($address->is_primary);
    }

    public function test_casts_is_primary_to_boolean(): void
    {
        $address = Address::factory()->create(['is_primary' => 1]);

        $this->assertIsBool($address->is_primary);
        $this->assertTrue($address->is_primary);
    }
}
