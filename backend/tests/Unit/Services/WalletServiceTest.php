<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletServiceTest extends TestCase
{
    use RefreshDatabase;

    private WalletService $service;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new WalletService();
        $this->user = User::factory()->create();
    }

    public function test_get_user_wallet(): void
    {
        $wallet = Wallet::factory()->create(['user_id' => $this->user->id]);

        $result = $this->service->getUserWallet($this->user);

        $this->assertInstanceOf(Wallet::class, $result);
        $this->assertEquals($wallet->id, $result->id);
    }

    public function test_get_balance_returns_array(): void
    {
        $wallet = Wallet::factory()->create(['user_id' => $this->user->id, 'balance' => 1000]);

        $result = $this->service->getBalance($wallet);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('balance', $result);
        $this->assertEquals(1000, $result['balance']);
    }

    public function test_validate_wallet_ownership_returns_true(): void
    {
        $wallet = Wallet::factory()->create(['user_id' => $this->user->id]);

        $result = $this->service->validateWalletOwnership($wallet, $this->user);

        $this->assertTrue($result);
    }

    public function test_validate_wallet_ownership_returns_false_for_different_user(): void
    {
        $otherUser = User::factory()->create();
        $wallet = Wallet::factory()->create(['user_id' => $otherUser->id]);

        $result = $this->service->validateWalletOwnership($wallet, $this->user);

        $this->assertFalse($result);
    }
}
