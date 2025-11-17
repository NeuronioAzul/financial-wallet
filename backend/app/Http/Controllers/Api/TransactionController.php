<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepositRequest;
use App\Http\Requests\ReverseTransactionRequest;
use App\Http\Requests\TransferRequest;
use App\Models\Transaction;
use App\Models\User;
use App\Services\TransactionService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        private TransactionService $transactionService,
        private WalletService $walletService
    ) {}

    /**
     * List user's transactions.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $transactions = Transaction::where(function ($query) use ($user) {
            $query->where('sender_user_id', $user->id)
                ->orWhere('receiver_user_id', $user->id);
        })
            ->with(['senderUser', 'receiverUser'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    /**
     * Get transaction details.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $transaction = Transaction::where('id', $id)
            ->where(function ($query) use ($user) {
                $query->where('sender_user_id', $user->id)
                    ->orWhere('receiver_user_id', $user->id);
            })
            ->with(['senderUser', 'receiverUser', 'logs'])
            ->first();

        if (! $transaction) {
            return response()->json([
                'message' => 'Transaction not found',
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $transaction->id,
                'transaction_code' => $transaction->transaction_code,
                'type' => $transaction->type->label(),
                'status' => $transaction->status->label(),
                'amount' => $transaction->amount,
                'currency' => $transaction->currency,
                'description' => $transaction->description,
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
                'completed_at' => $transaction->completed_at,
                'reversed_at' => $transaction->reversed_at,
            ],
        ]);
    }

    /**
     * Process a deposit.
     */
    public function deposit(DepositRequest $request): JsonResponse
    {
        try {
            $wallet = $this->walletService->getUserWallet($request->user());

            if (! $wallet) {
                return response()->json([
                    'message' => 'Wallet not found',
                ], 404);
            }

            $transaction = $this->transactionService->deposit(
                $wallet,
                $request->amount,
                $request->description
            );

            return response()->json([
                'message' => 'Deposit successful',
                'data' => [
                    'transaction_id' => $transaction->id,
                    'transaction_code' => $transaction->transaction_code,
                    'amount' => $transaction->amount,
                    'new_balance' => $transaction->receiver_new_balance,
                    'status' => $transaction->status->label(),
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Deposit failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Process a transfer.
     */
    public function transfer(TransferRequest $request): JsonResponse
    {
        try {
            $senderWallet = $this->walletService->getUserWallet($request->user());

            if (! $senderWallet) {
                return response()->json([
                    'message' => 'Sender wallet not found',
                ], 404);
            }

            $receiver = User::where('email', $request->receiver_email)->first();
            $receiverWallet = $this->walletService->getUserWallet($receiver);

            if (! $receiverWallet) {
                return response()->json([
                    'message' => 'Receiver wallet not found',
                ], 404);
            }

            $transaction = $this->transactionService->transfer(
                $senderWallet,
                $receiverWallet,
                $request->amount,
                $request->description
            );

            return response()->json([
                'message' => 'Transfer successful',
                'data' => [
                    'transaction_id' => $transaction->id,
                    'transaction_code' => $transaction->transaction_code,
                    'amount' => $transaction->amount,
                    'receiver' => [
                        'name' => $receiver->name,
                        'email' => $receiver->email,
                    ],
                    'new_balance' => $transaction->sender_new_balance,
                    'status' => $transaction->status->label(),
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transfer failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reverse a transaction.
     */
    public function reverse(ReverseTransactionRequest $request, string $id): JsonResponse
    {
        try {
            $user = $request->user();

            $transaction = Transaction::where('id', $id)
                ->where(function ($query) use ($user) {
                    $query->where('sender_user_id', $user->id)
                        ->orWhere('receiver_user_id', $user->id);
                })
                ->first();

            if (! $transaction) {
                return response()->json([
                    'message' => 'Transaction not found',
                ], 404);
            }

            // Determine reversal type based on who is requesting
            $isSender = $transaction->sender_user_id === $user->id;
            $isReceiver = $transaction->receiver_user_id === $user->id;

            // Validate permissions
            if ($isSender && ! $transaction->canBeReversedBySender($user->id)) {
                return response()->json([
                    'message' => 'You cannot reverse this transaction',
                ], 422);
            }

            if ($isReceiver && ! $transaction->canBeReversedByReceiver($user->id)) {
                return response()->json([
                    'message' => 'You cannot refund this transaction',
                ], 422);
            }

            // Set reversal type
            $reversalType = $isSender ? 'sender_request' : 'receiver_refusal';

            $reversalTransaction = $this->transactionService->reverse(
                $transaction,
                $request->reason ?? '',
                $reversalType
            );

            return response()->json([
                'message' => 'Transaction reversed successfully',
                'data' => [
                    'reversal_transaction_id' => $reversalTransaction->id,
                    'reversal_transaction_code' => $reversalTransaction->transaction_code,
                    'original_transaction_id' => $transaction->id,
                    'amount' => $reversalTransaction->amount,
                    'status' => $reversalTransaction->status->label(),
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Reversal failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
