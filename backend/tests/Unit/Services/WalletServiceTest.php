<?php

use App\Enums\WalletStatus;
use App\Models\User;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->walletService = new WalletService();
});

test('getUserWallet returns user wallet', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);

    $result = $this->walletService->getUserWallet($user);

    expect($result->id)->toBe($wallet->id);
    expect($result->user_id)->toBe($user->id);
});

test('getUserWallet throws exception when wallet not found', function () {
    $user = User::factory()->create();

    $this->walletService->getUserWallet($user);
})->throws(Exception::class, 'Wallet not found');

test('getBalance returns wallet balance and currency', function () {
    $user = User::factory()->create();
    Wallet::factory()->create([
        'user_id' => $user->id,
        'balance' => 1234.56,
        'currency' => 'BRL',
    ]);

    $result = $this->walletService->getBalance($user);

    expect($result)->toHaveKeys(['balance', 'currency', 'status']);
    expect($result['balance'])->toBe(1234.56);
    expect($result['currency'])->toBe('BRL');
    expect($result['status'])->toBe(WalletStatus::ACTIVE);
});

test('validateWalletOwnership passes when user owns wallet', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);

    expect(fn() => $this->walletService->validateWalletOwnership($wallet, $user))
        ->not->toThrow(Exception::class);
});

test('validateWalletOwnership throws exception when user does not own wallet', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $wallet = Wallet::factory()->create(['user_id' => $user2->id]);

    $this->walletService->validateWalletOwnership($wallet, $user1);
})->throws(Exception::class, 'Unauthorized access to wallet');
