<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\TransactionStatus;
use App\Enums\UserStatus;
use App\Enums\WalletStatus;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard overview statistics
     */
    public function overview(): JsonResponse
    {
        $totalUsers = User::count();
        $activeUsers = User::where('status', UserStatus::ACTIVE)->count();
        $totalWallets = Wallet::count();
        $totalBalance = Wallet::sum('balance');

        $totalTransactions = Transaction::count();
        $totalTransactionValue = Transaction::where('status', TransactionStatus::COMPLETED)->sum('amount');

        // Transactions by type
        $transactionsByType = Transaction::select('type', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
            ->where('status', TransactionStatus::COMPLETED)
            ->groupBy('type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->type->value => [
                    'count' => $item->count,
                    'total' => $item->total,
                ]];
            });

        // Recent transactions (last 7 days)
        $recentTransactions = Transaction::where('created_at', '>=', now()->subDays(7))
            ->where('status', TransactionStatus::COMPLETED)
            ->count();

        // New users (last 7 days)
        $newUsers = User::where('created_at', '>=', now()->subDays(7))->count();

        return response()->json([
            'data' => [
                'users' => [
                    'total' => $totalUsers,
                    'active' => $activeUsers,
                    'new_last_7_days' => $newUsers,
                ],
                'wallets' => [
                    'total' => $totalWallets,
                    'total_balance' => $totalBalance,
                ],
                'transactions' => [
                    'total' => $totalTransactions,
                    'total_value' => $totalTransactionValue,
                    'recent_7_days' => $recentTransactions,
                    'by_type' => $transactionsByType,
                ],
            ],
        ]);
    }

    /**
     * Get transactions chart data (last 30 days)
     */
    public function transactionsChart(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);

        $data = Transaction::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count'),
            DB::raw('sum(amount) as total')
        )
            ->where('created_at', '>=', now()->subDays($days))
            ->where('status', TransactionStatus::COMPLETED)
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Get transactions by type chart data
     */
    public function transactionsByType(): JsonResponse
    {
        $data = Transaction::select('type', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
            ->where('status', TransactionStatus::COMPLETED)
            ->groupBy('type')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => $item->type->value,
                    'label' => $item->type->name,
                    'count' => $item->count,
                    'total' => $item->total,
                ];
            });

        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Get user growth chart data
     */
    public function userGrowth(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);

        $data = User::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count')
        )
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Calculate cumulative total
        $cumulative = 0;
        $result = $data->map(function ($item) use (&$cumulative) {
            $cumulative += $item->count;
            return [
                'date' => $item->date,
                'new_users' => $item->count,
                'total_users' => $cumulative,
            ];
        });

        return response()->json([
            'data' => $result,
        ]);
    }

    /**
     * Get top users by transaction volume
     */
    public function topUsers(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);

        $topUsers = User::select('users.id', 'users.name', 'users.email')
            ->join('transactions', function ($join) {
                $join->on('users.id', '=', 'transactions.sender_user_id')
                    ->orOn('users.id', '=', 'transactions.receiver_user_id');
            })
            ->where('transactions.status', TransactionStatus::COMPLETED)
            ->groupBy('users.id', 'users.name', 'users.email')
            ->selectRaw('count(transactions.id) as transaction_count')
            ->selectRaw('sum(transactions.amount) as total_volume')
            ->orderBy('total_volume', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $topUsers,
        ]);
    }

    /**
     * Get recent activity (transactions and new users)
     */
    public function recentActivity(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 20);

        // Recent transactions
        $recentTransactions = Transaction::with([
            'senderUser:id,name,email',
            'receiverUser:id,name,email',
        ])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($transaction) {
                return [
                    'type' => 'transaction',
                    'id' => $transaction->id,
                    'transaction_code' => $transaction->transaction_code,
                    'transaction_type' => $transaction->type->value,
                    'amount' => $transaction->amount,
                    'status' => $transaction->status->value,
                    'sender' => $transaction->senderUser ? [
                        'id' => $transaction->senderUser->id,
                        'name' => $transaction->senderUser->name,
                        'email' => $transaction->senderUser->email,
                    ] : null,
                    'receiver' => $transaction->receiverUser ? [
                        'id' => $transaction->receiverUser->id,
                        'name' => $transaction->receiverUser->name,
                        'email' => $transaction->receiverUser->email,
                    ] : null,
                    'created_at' => $transaction->created_at,
                ];
            });

        // Recent users
        $recentUsers = User::select('id', 'name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($user) {
                return [
                    'type' => 'user',
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                ];
            });

        // Merge and sort by created_at
        $activity = $recentTransactions->concat($recentUsers)
            ->sortByDesc('created_at')
            ->take($limit)
            ->values();

        return response()->json([
            'data' => $activity,
        ]);
    }

    /**
     * Get wallet statistics
     */
    public function walletStats(): JsonResponse
    {
        $stats = [
            'total_wallets' => Wallet::count(),
            'active_wallets' => Wallet::where('status', WalletStatus::ACTIVE)->count(),
            'total_balance' => Wallet::sum('balance'),
            'average_balance' => Wallet::avg('balance'),
            'max_balance' => Wallet::max('balance'),
            'min_balance' => Wallet::min('balance'),
        ];

        // Balance distribution (ranges)
        $distribution = [
            '0-100' => Wallet::whereBetween('balance', [0, 100])->count(),
            '101-500' => Wallet::whereBetween('balance', [101, 500])->count(),
            '501-1000' => Wallet::whereBetween('balance', [501, 1000])->count(),
            '1001-5000' => Wallet::whereBetween('balance', [1001, 5000])->count(),
            '5001+' => Wallet::where('balance', '>', 5000)->count(),
        ];

        return response()->json([
            'data' => [
                'stats' => $stats,
                'distribution' => $distribution,
            ],
        ]);
    }

    /**
     * Get transaction statistics by status
     */
    public function transactionStats(): JsonResponse
    {
        $byStatus = Transaction::select('status', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status->value => [
                    'count' => $item->count,
                    'total' => $item->total,
                ]];
            });

        $byType = Transaction::select('type', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
            ->where('status', TransactionStatus::COMPLETED)
            ->groupBy('type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->type->value => [
                    'count' => $item->count,
                    'total' => $item->total,
                ]];
            });

        // Average transaction value
        $avgAmount = Transaction::where('status', TransactionStatus::COMPLETED)->avg('amount');

        // Transaction success rate
        $totalTransactions = Transaction::count();
        $completedTransactions = Transaction::where('status', TransactionStatus::COMPLETED)->count();
        $successRate = $totalTransactions > 0 ? ($completedTransactions / $totalTransactions) * 100 : 0;

        return response()->json([
            'data' => [
                'by_status' => $byStatus,
                'by_type' => $byType,
                'average_amount' => $avgAmount,
                'success_rate' => round($successRate, 2),
                'total_transactions' => $totalTransactions,
                'completed_transactions' => $completedTransactions,
            ],
        ]);
    }
}
