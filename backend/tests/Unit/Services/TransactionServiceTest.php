<?php

namespace Tests\Unit\Services;

use App\Enums\TransactionType;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Services\TransactionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionServiceTest extends TestCase
{
    use RefreshDatabase;

    private TransactionService $service;
    private User $user;
    private Wallet $wallet;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TransactionService();
        $this->user = User::factory()->create();
        $this->wallet = Wallet::factory()->create(['user_id' => $this->user->id, 'balance' => 1000]);
    }

    public function test_deposit_creates_transaction(): void
    {
        $transaction = $this->service->deposit($this->wallet, 100, 'Test deposit');

        $this->assertInstanceOf(Transaction::class, $transaction);
        $this->assertEquals(TransactionType::DEPOSIT, $transaction->type);
        $this->assertEquals(100, $transaction->amount);
        $this->assertEquals('Test deposit', $transaction->description);
    }

    public function test_deposit_updates_wallet_balance(): void
    {
        $this->service->deposit($this->wallet, 100);

        $this->assertEquals(1100, $this->wallet->fresh()->balance);
    }
}
