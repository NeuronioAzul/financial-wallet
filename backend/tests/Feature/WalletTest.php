<?php

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can view their wallet', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->getJson('/api/v1/wallet');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => ['id', 'balance', 'currency', 'status', 'created_at', 'updated_at'],
        ])
        ->assertJson([
            'data' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
            ],
        ]);
});

test('authenticated user can view their wallet balance', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->create([
        'user_id' => $user->id,
        'balance' => 1000.00,
    ]);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->getJson('/api/v1/wallet/balance');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => ['balance', 'currency', 'status'],
        ])
        ->assertJson([
            'data' => [
                'balance' => 1000.00,
            ],
        ]);
});

test('unauthenticated user cannot view wallet', function () {
    $response = $this->getJson('/api/v1/wallet');

    $response->assertStatus(401);
});
