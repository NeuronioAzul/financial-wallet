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

    public function test_deposit_works_with_negative_balance(): void
    {
        // Set wallet balance to negative
        $this->wallet->update(['balance' => -50]);

        $transaction = $this->service->deposit($this->wallet, 100, 'Recovery deposit');

        $this->assertEquals(50, $this->wallet->fresh()->balance);
        $this->assertEquals(-50, $transaction->receiver_previous_balance);
        $this->assertEquals(50, $transaction->receiver_new_balance);
    }

    public function test_deposit_throws_exception_for_negative_amount(): void
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Deposit amount must be positive');

        $this->service->deposit($this->wallet, -50);
    }

    public function test_deposit_throws_exception_for_zero_amount(): void
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Deposit amount must be positive');

        $this->service->deposit($this->wallet, 0);
    }

    public function test_transfer_validates_insufficient_balance(): void
    {
        $receiver = User::factory()->create();
        $receiverWallet = Wallet::factory()->create(['user_id' => $receiver->id]);

        $this->wallet->update(['balance' => 50]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Insufficient balance');

        $this->service->transfer($this->wallet, $receiverWallet, 100, 'Test transfer');
    }

    public function test_transfer_shows_detailed_balance_error(): void
    {
        $receiver = User::factory()->create();
        $receiverWallet = Wallet::factory()->create(['user_id' => $receiver->id]);

        $this->wallet->update(['balance' => 50.75]);

        try {
            $this->service->transfer($this->wallet, $receiverWallet, 100.50, 'Test transfer');
            $this->fail('Expected exception was not thrown');
        } catch (\Exception $e) {
            $this->assertStringContainsString('Insufficient balance', $e->getMessage());
            $this->assertStringContainsString('50,75', $e->getMessage());
            $this->assertStringContainsString('100,50', $e->getMessage());
        }
    }

    public function test_reversal_works_even_with_insufficient_balance(): void
    {
        $receiver = User::factory()->create();
        $receiverWallet = Wallet::factory()->create(['user_id' => $receiver->id, 'balance' => 500]);

        // Create original transfer
        $originalTransaction = $this->service->transfer($this->wallet, $receiverWallet, 100, 'Original transfer');

        // Receiver spends the money, leaving insufficient balance
        $receiverWallet->update(['balance' => 30]);

        // Reversal should still work (even though it results in negative balance)
        $reversalTransaction = $this->service->reverse($originalTransaction, 'User request');

        $this->assertInstanceOf(Transaction::class, $reversalTransaction);
        $this->assertEquals(TransactionType::REVERSAL, $reversalTransaction->type);
        $this->assertEquals(-70, $receiverWallet->fresh()->balance); // 30 - 100 = -70
        $this->assertEquals(1000, $this->wallet->fresh()->balance); // Back to original
    }

    public function test_deposit_reversal_allows_negative_balance(): void
    {
        // User deposits
        $depositTransaction = $this->service->deposit($this->wallet, 200, 'Test deposit');

        // User spends most of the money
        $this->wallet->update(['balance' => 50]);

        // Reversal of deposit should work even if it results in negative balance
        $reversalTransaction = $this->service->reverse($depositTransaction, 'Inconsistency detected');

        $this->assertEquals(-150, $this->wallet->fresh()->balance); // 50 - 200 = -150
        $this->assertEquals(TransactionType::REVERSAL, $reversalTransaction->type);
    }
}

