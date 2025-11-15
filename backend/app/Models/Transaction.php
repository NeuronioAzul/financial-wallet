<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transaction extends Model
{
    use HasFactory, HasUuidV7;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'transaction_code',
        'type',
        'status',
        'sender_wallet_id',
        'sender_user_id',
        'sender_previous_balance',
        'sender_new_balance',
        'receiver_wallet_id',
        'receiver_user_id',
        'receiver_previous_balance',
        'receiver_new_balance',
        'amount',
        'currency',
        'description',
        'metadata',
        'reversed_transaction_id',
        'reversal_reason',
        'completed_at',
        'reversed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => TransactionType::class,
            'status' => TransactionStatus::class,
            'amount' => 'decimal:2',
            'sender_previous_balance' => 'decimal:2',
            'sender_new_balance' => 'decimal:2',
            'receiver_previous_balance' => 'decimal:2',
            'receiver_new_balance' => 'decimal:2',
            'metadata' => 'array',
            'completed_at' => 'datetime',
            'reversed_at' => 'datetime',
        ];
    }

    /**
     * Get the sender wallet.
     */
    public function senderWallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'sender_wallet_id');
    }

    /**
     * Get the receiver wallet.
     */
    public function receiverWallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'receiver_wallet_id');
    }

    /**
     * Get the sender user.
     */
    public function senderUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }

    /**
     * Get the receiver user.
     */
    public function receiverUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_user_id');
    }

    /**
     * Get the reversed transaction (if this is a reversal).
     */
    public function reversedTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'reversed_transaction_id');
    }

    /**
     * Get the reversal transaction (if this transaction was reversed).
     */
    public function reversal(): HasOne
    {
        return $this->hasOne(Transaction::class, 'reversed_transaction_id');
    }

    /**
     * Get the transaction logs.
     */
    public function logs(): HasMany
    {
        return $this->hasMany(TransactionLog::class);
    }

    /**
     * Check if transaction is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === TransactionStatus::COMPLETED;
    }

    /**
     * Check if transaction is reversed.
     */
    public function isReversed(): bool
    {
        return $this->status === TransactionStatus::REVERSED;
    }

    /**
     * Check if transaction can be reversed.
     */
    public function canBeReversed(): bool
    {
        return $this->status === TransactionStatus::COMPLETED
            && !$this->reversed_at
            && !$this->reversal()->exists();
    }
}
