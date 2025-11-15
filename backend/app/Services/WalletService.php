<?php

namespace App\Services;

use App\Models\User;
use App\Models\Wallet;

class WalletService
{
    /**
     * Get user's primary wallet (BRL).
     */
    public function getUserWallet(User $user): ?Wallet
    {
        return $user->wallet;
    }

    /**
     * Get wallet balance.
     */
    public function getBalance(Wallet $wallet): array
    {
        return [
            'balance' => $wallet->balance,
            'currency' => $wallet->currency,
            'status' => $wallet->status->label(),
        ];
    }

    /**
     * Check if wallet is active and belongs to user.
     */
    public function validateWalletOwnership(Wallet $wallet, User $user): bool
    {
        return $wallet->user_id === $user->id && $wallet->isActive();
    }
}
