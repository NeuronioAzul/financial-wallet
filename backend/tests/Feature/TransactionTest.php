<?php

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can deposit money to their wallet', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create([
        'user_id' => $user->id,
        'balance' => 100.00,
    ]);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/v1/transactions/deposit', [
            'amount' => 50.00,
            'description' => 'Test deposit',
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'data' => ['transaction_id', 'transaction_code', 'amount', 'new_balance', 'status'],
        ])
        ->assertJson([
            'data' => [
                'amount' => 50.00,
                'new_balance' => 150.00,
            ],
        ]);

    $this->assertDatabaseHas('wallets', [
        'id' => $wallet->id,
        'balance' => 150.00,
    ]);

    $this->assertDatabaseHas('transactions', [
        'receiver_wallet_id' => $wallet->id,
        'amount' => 50.00,
        'type' => TransactionType::DEPOSIT->value,
        'status' => TransactionStatus::COMPLETED->value,
    ]);
});

test('user cannot deposit negative amount', function () {
    $user = User::factory()->create();
    Wallet::factory()->create(['user_id' => $user->id]);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/v1/transactions/deposit', [
            'amount' => -50.00,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['amount']);
});

test('user can transfer money to another user', function () {
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

    $token = $sender->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/v1/transactions/transfer', [
            'receiver_email' => 'receiver@example.com',
            'amount' => 200.00,
            'description' => 'Test transfer',
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'data' => ['transaction_id', 'transaction_code', 'amount', 'receiver', 'new_balance', 'status'],
        ])
        ->assertJson([
            'data' => [
                'amount' => 200.00,
                'new_balance' => 300.00,
            ],
        ]);

    $this->assertDatabaseHas('wallets', [
        'id' => $senderWallet->id,
        'balance' => 300.00,
    ]);

    $this->assertDatabaseHas('wallets', [
        'id' => $receiverWallet->id,
        'balance' => 300.00,
    ]);

    $this->assertDatabaseHas('transactions', [
        'sender_wallet_id' => $senderWallet->id,
        'receiver_wallet_id' => $receiverWallet->id,
        'amount' => 200.00,
        'type' => TransactionType::TRANSFER->value,
        'status' => TransactionStatus::COMPLETED->value,
    ]);
});

test('user cannot transfer more than their balance', function () {
    $sender = User::factory()->create();
    $receiver = User::factory()->create(['email' => 'receiver@example.com']);

    Wallet::factory()->create([
        'user_id' => $sender->id,
        'balance' => 50.00,
    ]);

    Wallet::factory()->create(['user_id' => $receiver->id]);

    $token = $sender->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/v1/transactions/transfer', [
            'receiver_email' => 'receiver@example.com',
            'amount' => 100.00,
        ]);

    $response->assertStatus(500)
        ->assertJson([
            'message' => 'Transfer failed',
            'error' => 'Insufficient balance',
        ]);
});

test('user cannot transfer to themselves', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    Wallet::factory()->create(['user_id' => $user->id]);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/v1/transactions/transfer', [
            'receiver_email' => 'test@example.com',
            'amount' => 50.00,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['receiver_email']);
});

test('user can reverse a completed transaction', function () {
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

    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson("/api/v1/transactions/{$transaction->id}/reverse", [
            'reason' => 'Test reversal',
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'data' => ['reversal_transaction_id', 'original_transaction_id', 'amount', 'status'],
        ]);

    $this->assertDatabaseHas('transactions', [
        'id' => $transaction->id,
        'status' => TransactionStatus::REVERSED->value,
    ]);

    $this->assertDatabaseHas('wallets', [
        'id' => $userWallet->id,
        'balance' => 500.00, // Balance restored
    ]);

    $this->assertDatabaseHas('wallets', [
        'id' => $receiverWallet->id,
        'balance' => 100.00, // Balance deducted
    ]);
});

test('user can list their transactions', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);

    Transaction::factory()->count(5)->create([
        'receiver_wallet_id' => $wallet->id,
        'receiver_user_id' => $user->id,
    ]);

    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->getJson('/api/v1/transactions');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data',
            'meta' => ['current_page', 'per_page', 'total'],
        ]);
});

test('user can view transaction details', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);

    $transaction = Transaction::factory()->create([
        'receiver_wallet_id' => $wallet->id,
        'receiver_user_id' => $user->id,
    ]);

    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->getJson("/api/v1/transactions/{$transaction->id}");

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'id',
                'transaction_code',
                'type',
                'status',
                'amount',
                'currency',
                'created_at',
            ],
        ]);
});
