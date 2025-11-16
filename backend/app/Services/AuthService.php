<?php

namespace App\Services;

use App\Enums\UserStatus;
use App\Enums\WalletStatus;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Register a new user with wallet.
     */
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'document' => $data['document'],
                'phone' => $data['phone'] ?? null,
                'status' => UserStatus::ACTIVE,
            ]);

            // Create default wallet (BRL)
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance' => 0.00,
                'currency' => 'BRL',
                'status' => WalletStatus::ACTIVE,
            ]);

            // Create authentication token
            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'user' => $user,
                'wallet' => $wallet,
                'token' => $token,
            ];
        });
    }

    /**
     * Authenticate user and return token.
     */
    public function login(string $email, string $password): ?array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            return null;
        }

        if (! $user->isActive()) {
            throw new \Exception('Account is not active');
        }

        // Revoke all previous tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}
