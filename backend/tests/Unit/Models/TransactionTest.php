<?php

namespace Tests\Unit\Models;

use App\Enums\TransactionType;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_has_transaction_code(): void
    {
        $transaction = Transaction::factory()->create();

        $this->assertNotEmpty($transaction->transaction_code);
        $this->assertStringStartsWith('TXN-', $transaction->transaction_code);
    }

    public function test_casts_type_to_enum(): void
    {
        $transaction = Transaction::factory()->create(['type' => TransactionType::DEPOSIT]);

        $this->assertInstanceOf(TransactionType::class, $transaction->type);
        $this->assertEquals(TransactionType::DEPOSIT, $transaction->type);
    }

    public function test_belongs_to_receiver_wallet(): void
    {
        $wallet = Wallet::factory()->create();
        $transaction = Transaction::factory()->create(['receiver_wallet_id' => $wallet->id]);

        $this->assertInstanceOf(Wallet::class, $transaction->receiverWallet);
        $this->assertEquals($wallet->id, $transaction->receiverWallet->id);
    }
}
