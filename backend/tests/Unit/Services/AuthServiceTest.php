<?php

use App\Enums\UserStatus;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->authService = new AuthService();
});

test('register creates user with hashed password', function () {
    $data = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'document' => '12345678901',
        'phone' => '11987654321',
    ];

    $result = $this->authService->register($data);

    expect($result)->toHaveKeys(['user', 'wallet', 'token']);
    expect($result['user'])->toBeInstanceOf(User::class);
    expect($result['user']->email)->toBe('test@example.com');
    expect($result['user']->status)->toBe(UserStatus::ACTIVE);
    expect(Hash::check('password123', $result['user']->password))->toBeTrue();
});

test('register creates wallet for new user', function () {
    $data = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'document' => '12345678901',
    ];

    $result = $this->authService->register($data);

    expect($result['wallet'])->not->toBeNull();
    expect($result['wallet']->balance)->toBe(0.0);
    expect($result['wallet']->currency)->toBe('BRL');
    expect($result['wallet']->user_id)->toBe($result['user']->id);
});

test('register generates authentication token', function () {
    $data = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'document' => '12345678901',
    ];

    $result = $this->authService->register($data);

    expect($result['token'])->toBeString();
    expect(strlen($result['token']))->toBeGreaterThan(0);
});

test('login authenticates user with correct credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $result = $this->authService->login('test@example.com', 'password123');

    expect($result)->toHaveKeys(['user', 'token']);
    expect($result['user']->id)->toBe($user->id);
    expect($result['token'])->toBeString();
});

test('login fails with incorrect password', function () {
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $this->authService->login('test@example.com', 'wrongpassword');
})->throws(Exception::class, 'Invalid credentials');

test('login fails with non-existent email', function () {
    $this->authService->login('nonexistent@example.com', 'password123');
})->throws(Exception::class, 'Invalid credentials');

test('login revokes previous tokens', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $oldToken = $user->createToken('old-token')->plainTextToken;

    $this->authService->login('test@example.com', 'password123');

    $this->assertDatabaseMissing('personal_access_tokens', [
        'tokenable_id' => $user->id,
        'name' => 'old-token',
    ]);
});

test('logout revokes all user tokens', function () {
    $user = User::factory()->create();
    $user->createToken('token-1');
    $user->createToken('token-2');

    $this->authService->logout($user);

    $this->assertDatabaseMissing('personal_access_tokens', [
        'tokenable_id' => $user->id,
    ]);
});
