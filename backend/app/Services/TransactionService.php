<?php

namespace App\Services;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\Transaction;
use App\Models\TransactionLog;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionService
{
    /**
     * Process a deposit transaction.
     */
    public function deposit(Wallet $wallet, float $amount, ?string $description = null): Transaction
    {
        return DB::transaction(function () use ($wallet, $amount, $description) {
            // Lock wallet for update
            $wallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();

            $previousBalance = $wallet->balance;
            $newBalance = $previousBalance + $amount;

            // Create transaction
            $transaction = Transaction::create([
                'transaction_code' => $this->generateTransactionCode(),
                'type' => TransactionType::DEPOSIT,
                'status' => TransactionStatus::PROCESSING,
                'receiver_wallet_id' => $wallet->id,
                'receiver_user_id' => $wallet->user_id,
                'receiver_previous_balance' => $previousBalance,
                'receiver_new_balance' => $newBalance,
                'amount' => $amount,
                'currency' => $wallet->currency,
                'description' => $description,
            ]);

            // Log transaction creation
            $this->logTransaction($transaction, null, TransactionStatus::PROCESSING, 'created');

            // Update wallet balance
            $wallet->update(['balance' => $newBalance]);

            // Mark transaction as completed
            $transaction->update([
                'status' => TransactionStatus::COMPLETED,
                'completed_at' => now(),
            ]);

            // Log completion
            $this->logTransaction($transaction, TransactionStatus::PROCESSING, TransactionStatus::COMPLETED, 'completed');

            return $transaction->fresh();
        });
    }

    /**
     * Process a transfer transaction.
     */
    public function transfer(Wallet $senderWallet, Wallet $receiverWallet, float $amount, ?string $description = null): Transaction
    {
        return DB::transaction(function () use ($senderWallet, $receiverWallet, $amount, $description) {
            // Lock both wallets for update (ordered by ID to prevent deadlocks)
            $wallets = Wallet::whereIn('id', [$senderWallet->id, $receiverWallet->id])
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $senderWallet = $wallets[$senderWallet->id];
            $receiverWallet = $wallets[$receiverWallet->id];

            // Validate sender balance
            if (! $senderWallet->hasSufficientBalance($amount)) {
                throw new \Exception('Insufficient balance');
            }

            $senderPreviousBalance = $senderWallet->balance;
            $senderNewBalance = $senderPreviousBalance - $amount;
            $receiverPreviousBalance = $receiverWallet->balance;
            $receiverNewBalance = $receiverPreviousBalance + $amount;

            // Create transaction
            $transaction = Transaction::create([
                'transaction_code' => $this->generateTransactionCode(),
                'type' => TransactionType::TRANSFER,
                'status' => TransactionStatus::PROCESSING,
                'sender_wallet_id' => $senderWallet->id,
                'sender_user_id' => $senderWallet->user_id,
                'sender_previous_balance' => $senderPreviousBalance,
                'sender_new_balance' => $senderNewBalance,
                'receiver_wallet_id' => $receiverWallet->id,
                'receiver_user_id' => $receiverWallet->user_id,
                'receiver_previous_balance' => $receiverPreviousBalance,
                'receiver_new_balance' => $receiverNewBalance,
                'amount' => $amount,
                'currency' => $senderWallet->currency,
                'description' => $description,
            ]);

            // Log transaction creation
            $this->logTransaction($transaction, null, TransactionStatus::PROCESSING, 'created');

            // Update both wallet balances
            $senderWallet->update(['balance' => $senderNewBalance]);
            $receiverWallet->update(['balance' => $receiverNewBalance]);

            // Mark transaction as completed
            $transaction->update([
                'status' => TransactionStatus::COMPLETED,
                'completed_at' => now(),
            ]);

            // Log completion
            $this->logTransaction($transaction, TransactionStatus::PROCESSING, TransactionStatus::COMPLETED, 'completed');

            return $transaction->fresh();
        });
    }

    /**
     * Reverse a transaction.
     */
    public function reverse(Transaction $originalTransaction, string $reason): Transaction
    {
        return DB::transaction(function () use ($originalTransaction, $reason) {
            // Validate transaction can be reversed
            if (! $originalTransaction->canBeReversed()) {
                throw new \Exception('Transaction cannot be reversed');
            }

            // Get wallets involved
            $walletsToLock = collect([
                $originalTransaction->sender_wallet_id,
                $originalTransaction->receiver_wallet_id,
            ])->filter()->unique()->sort()->values();

            $wallets = Wallet::whereIn('id', $walletsToLock)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $senderWallet = $originalTransaction->sender_wallet_id
                ? $wallets[$originalTransaction->sender_wallet_id]
                : null;
            $receiverWallet = $wallets[$originalTransaction->receiver_wallet_id];

            // Calculate reversal balances
            $receiverPreviousBalance = $receiverWallet->balance;
            $receiverNewBalance = $receiverPreviousBalance - $originalTransaction->amount;

            $senderPreviousBalance = $senderWallet?->balance;
            $senderNewBalance = $senderWallet ? $senderPreviousBalance + $originalTransaction->amount : null;

            // Validate receiver has sufficient balance for reversal
            if ($receiverNewBalance < 0) {
                throw new \Exception('Receiver has insufficient balance for reversal');
            }

            // Create reversal transaction
            $reversalTransaction = Transaction::create([
                'transaction_code' => $this->generateTransactionCode(),
                'type' => TransactionType::REVERSAL,
                'status' => TransactionStatus::PROCESSING,
                'sender_wallet_id' => $originalTransaction->receiver_wallet_id,
                'sender_user_id' => $originalTransaction->receiver_user_id,
                'sender_previous_balance' => $receiverPreviousBalance,
                'sender_new_balance' => $receiverNewBalance,
                'receiver_wallet_id' => $originalTransaction->sender_wallet_id,
                'receiver_user_id' => $originalTransaction->sender_user_id,
                'receiver_previous_balance' => $senderPreviousBalance,
                'receiver_new_balance' => $senderNewBalance,
                'amount' => $originalTransaction->amount,
                'currency' => $originalTransaction->currency,
                'reversed_transaction_id' => $originalTransaction->id,
                'reversal_reason' => $reason,
            ]);

            // Log reversal creation
            $this->logTransaction($reversalTransaction, null, TransactionStatus::PROCESSING, 'created');

            // Update wallet balances
            $receiverWallet->update(['balance' => $receiverNewBalance]);
            if ($senderWallet) {
                $senderWallet->update(['balance' => $senderNewBalance]);
            }

            // Mark reversal as completed
            $reversalTransaction->update([
                'status' => TransactionStatus::COMPLETED,
                'completed_at' => now(),
            ]);

            // Mark original transaction as reversed
            $originalTransaction->update([
                'status' => TransactionStatus::REVERSED,
                'reversed_at' => now(),
            ]);

            // Log completion
            $this->logTransaction($reversalTransaction, TransactionStatus::PROCESSING, TransactionStatus::COMPLETED, 'completed');
            $this->logTransaction($originalTransaction, TransactionStatus::COMPLETED, TransactionStatus::REVERSED, 'reversed');

            return $reversalTransaction->fresh();
        });
    }

    /**
     * Generate unique transaction code.
     */
    private function generateTransactionCode(): string
    {
        return 'TXN-'.strtoupper(Str::random(10)).'-'.now()->format('YmdHis');
    }

    /**
     * Log transaction status change.
     */
    private function logTransaction(
        Transaction $transaction,
        ?TransactionStatus $previousStatus,
        TransactionStatus $newStatus,
        string $eventType,
        ?string $errorMessage = null
    ): void {
        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'previous_status' => $previousStatus?->value,
            'new_status' => $newStatus->value,
            'event_type' => $eventType,
            'error_message' => $errorMessage,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
