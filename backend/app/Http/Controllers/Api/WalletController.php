<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function __construct(
        private WalletService $walletService
    ) {}

    /**
     * Get user's wallet information.
     */
    public function show(Request $request): JsonResponse
    {
        $wallet = $this->walletService->getUserWallet($request->user());

        if (!$wallet) {
            return response()->json([
                'message' => 'Wallet not found',
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'currency' => $wallet->currency,
                'status' => $wallet->status->label(),
                'created_at' => $wallet->created_at,
                'updated_at' => $wallet->updated_at,
            ],
        ]);
    }

    /**
     * Get wallet balance.
     */
    public function balance(Request $request): JsonResponse
    {
        $wallet = $this->walletService->getUserWallet($request->user());

        if (!$wallet) {
            return response()->json([
                'message' => 'Wallet not found',
            ], 404);
        }

        $balance = $this->walletService->getBalance($wallet);

        return response()->json([
            'data' => $balance,
        ]);
    }
}
