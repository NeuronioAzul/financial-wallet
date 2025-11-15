<?php

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Services\TransactionService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->transactionService = new TransactionService();
});

test('deposit increases wallet balance', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create([
        'user_id' => $user->id,
        'balance' => 100.00,
    ]);

    $result = $this->transactionService->deposit($user, 50.00, 'Test deposit');

    expect($result)->toHaveKeys(['transaction_id', 'transaction_code', 'amount', 'new_balance', 'status']);
    expect($result['amount'])->toBe(50.00);
    expect($result['new_balance'])->toBe(150.00);

    $wallet->refresh();
    expect($wallet->balance)->toBe(150.00);
});

test('deposit creates transaction record', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);

    $result = $this->transactionService->deposit($user, 50.00);

    $this->assertDatabaseHas('transactions', [
        'id' => $result['transaction_id'],
        'type' => TransactionType::DEPOSIT->value,
        'status' => TransactionStatus::COMPLETED->value,
        'amount' => 50.00,
        'receiver_wallet_id' => $wallet->id,
        'receiver_user_id' => $user->id,
    ]);
});

test('transfer moves money between wallets', function () {
    $sender = User::factory()->create();
    $receiver = User::factory()->create(['email' => 'receiver@example.com']);

    $senderWallet = Wallet::factory()->create([
        'user_id' => $sender->id,
        'balance' => 500.00,
    ]);

    $receiverWallet = Wallet::factory()->create([
        'user_id' => $receiver->id,
        'balance' => 100.00,
    ]);

    $result = $this->transactionService->transfer(
        $sender,
        'receiver@example.com',
        200.00,
        'Test transfer'
    );

    expect($result)->toHaveKeys(['transaction_id', 'transaction_code', 'amount', 'receiver', 'new_balance', 'status']);
    expect($result['amount'])->toBe(200.00);
    expect($result['new_balance'])->toBe(300.00);

    $senderWallet->refresh();
    $receiverWallet->refresh();

    expect($senderWallet->balance)->toBe(300.00);
    expect($receiverWallet->balance)->toBe(300.00);
});

test('transfer fails with insufficient balance', function () {
    $sender = User::factory()->create();
    $receiver = User::factory()->create(['email' => 'receiver@example.com']);

    Wallet::factory()->create([
        'user_id' => $sender->id,
        'balance' => 50.00,
    ]);

    Wallet::factory()->create(['user_id' => $receiver->id]);

    $this->transactionService->transfer($sender, 'receiver@example.com', 100.00);
})->throws(Exception::class, 'Insufficient balance');

test('transfer fails when receiver not found', function () {
    $sender = User::factory()->create();
    Wallet::factory()->create(['user_id' => $sender->id, 'balance' => 500.00]);

    $this->transactionService->transfer($sender, 'nonexistent@example.com', 100.00);
})->throws(Exception::class, 'Receiver not found');

test('transfer creates transaction record with both wallets', function () {
    $sender = User::factory()->create();
    $receiver = User::factory()->create(['email' => 'receiver@example.com']);

    $senderWallet = Wallet::factory()->create([
        'user_id' => $sender->id,
        'balance' => 500.00,
    ]);

    $receiverWallet = Wallet::factory()->create([
        'user_id' => $receiver->id,
        'balance' => 100.00,
    ]);

    $result = $this->transactionService->transfer($sender, 'receiver@example.com', 200.00);

    $this->assertDatabaseHas('transactions', [
        'id' => $result['transaction_id'],
        'type' => TransactionType::TRANSFER->value,
        'status' => TransactionStatus::COMPLETED->value,
        'amount' => 200.00,
        'sender_wallet_id' => $senderWallet->id,
        'sender_user_id' => $sender->id,
        'receiver_wallet_id' => $receiverWallet->id,
        'receiver_user_id' => $receiver->id,
    ]);
});

test('reverse restores balances for completed transaction', function () {
    $user = User::factory()->create();
    $receiver = User::factory()->create();

    $userWallet = Wallet::factory()->create([
        'user_id' => $user->id,
        'balance' => 300.00,
    ]);

    $receiverWallet = Wallet::factory()->create([
        'user_id' => $receiver->id,
        'balance' => 300.00,
    ]);

    $transaction = Transaction::factory()->create([
        'type' => TransactionType::TRANSFER,
        'status' => TransactionStatus::COMPLETED,
        'sender_wallet_id' => $userWallet->id,
        'sender_user_id' => $user->id,
        'sender_previous_balance' => 500.00,
        'sender_new_balance' => 300.00,
        'receiver_wallet_id' => $receiverWallet->id,
        'receiver_user_id' => $receiver->id,
        'receiver_previous_balance' => 100.00,
        'receiver_new_balance' => 300.00,
        'amount' => 200.00,
        'completed_at' => now(),
    ]);

    $result = $this->transactionService->reverse($user, $transaction->id, 'Test reversal');

    expect($result)->toHaveKeys(['reversal_transaction_id', 'original_transaction_id', 'amount', 'status']);

    $userWallet->refresh();
    $receiverWallet->refresh();
    $transaction->refresh();

    expect($userWallet->balance)->toBe(500.00);
    expect($receiverWallet->balance)->toBe(100.00);
    expect($transaction->status)->toBe(TransactionStatus::REVERSED);
});

test('reverse fails when transaction not found', function () {
    $user = User::factory()->create();

    $this->transactionService->reverse($user, 'non-existent-id', 'Test reversal');
})->throws(Exception::class, 'Transaction not found');

test('reverse fails when transaction already reversed', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);

    $transaction = Transaction::factory()->create([
        'sender_wallet_id' => $wallet->id,
        'sender_user_id' => $user->id,
        'status' => TransactionStatus::REVERSED,
    ]);

    $this->transactionService->reverse($user, $transaction->id, 'Test reversal');
})->throws(Exception::class, 'Transaction cannot be reversed');

test('reverse fails when receiver has insufficient balance', function () {
    $user = User::factory()->create();
    $receiver = User::factory()->create();

    $userWallet = Wallet::factory()->create([
        'user_id' => $user->id,
        'balance' => 300.00,
    ]);

    $receiverWallet = Wallet::factory()->create([
        'user_id' => $receiver->id,
        'balance' => 50.00, // Less than transaction amount
    ]);

    $transaction = Transaction::factory()->create([
        'type' => TransactionType::TRANSFER,
        'status' => TransactionStatus::COMPLETED,
        'sender_wallet_id' => $userWallet->id,
        'sender_user_id' => $user->id,
        'receiver_wallet_id' => $receiverWallet->id,
        'receiver_user_id' => $receiver->id,
        'amount' => 200.00,
        'sender_previous_balance' => 500.00,
        'completed_at' => now(),
    ]);

    $this->transactionService->reverse($user, $transaction->id, 'Test reversal');
})->throws(Exception::class, 'Receiver has insufficient balance for reversal');
