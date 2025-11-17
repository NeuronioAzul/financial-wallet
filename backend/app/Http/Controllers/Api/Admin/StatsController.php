<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    /**
     * Get admin dashboard statistics.
     */
    public function index(): JsonResponse
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'active' => User::where('status', UserStatus::ACTIVE)->count(),
                'inactive' => User::where('status', UserStatus::INACTIVE)->count(),
                'blocked' => User::where('status', UserStatus::BLOCKED)->count(),
            ],
            'transactions' => [
                'total' => Transaction::count(),
                'today' => Transaction::whereDate('created_at', today())->count(),
                'this_month' => Transaction::whereMonth('created_at', now()->month)->count(),
                'total_volume' => Transaction::sum('amount'),
                'volume_today' => Transaction::whereDate('created_at', today())->sum('amount'),
                'volume_this_month' => Transaction::whereMonth('created_at', now()->month)->sum('amount'),
            ],
            'wallets' => [
                'total_balance' => \App\Models\Wallet::sum('balance'),
            ],
        ];

        return response()->json($stats);
    }
}
