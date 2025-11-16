<?php

namespace Tests\Unit\Models;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $wallet->user);
        $this->assertEquals($user->id, $wallet->user->id);
    }

    public function test_has_currency_attribute(): void
    {
        $wallet = Wallet::factory()->create();

        $this->assertNotEmpty($wallet->currency);
        $this->assertEquals('BRL', $wallet->currency);
    }

    public function test_default_balance_is_zero(): void
    {
        $user = User::factory()->create();
        $wallet = Wallet::create(['user_id' => $user->id]);

        $this->assertEquals(0, $wallet->balance);
    }

    public function test_fillable_attributes(): void
    {
        $data = [
            'user_id' => User::factory()->create()->id,
            'balance' => 500,
        ];

        $wallet = Wallet::create($data);

        $this->assertEquals(500, $wallet->balance);
    }

    public function test_balance_is_numeric(): void
    {
        $wallet = Wallet::factory()->create(['balance' => 1000]);

        $this->assertIsNumeric($wallet->balance);
        $this->assertEquals(1000, $wallet->balance);
    }
}
