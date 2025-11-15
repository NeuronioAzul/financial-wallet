<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('transaction_code', 50)->unique();
            $table->smallInteger('type')->comment('1=deposit, 2=transfer, 3=reversal');
            $table->smallInteger('status')->default(1)->comment('1=pending, 2=processing, 3=completed, 4=failed, 5=reversed');

            // Sender information (nullable for deposits)
            $table->uuid('sender_wallet_id')->nullable();
            $table->uuid('sender_user_id')->nullable();
            $table->decimal('sender_previous_balance', 15, 2)->nullable();
            $table->decimal('sender_new_balance', 15, 2)->nullable();

            // Receiver information
            $table->uuid('receiver_wallet_id')->nullable();
            $table->uuid('receiver_user_id')->nullable();
            $table->decimal('receiver_previous_balance', 15, 2)->nullable();
            $table->decimal('receiver_new_balance', 15, 2)->nullable();

            // Transaction details
            $table->decimal('amount', 15, 2);
            $table->string('currency', 3)->default('BRL');
            $table->text('description')->nullable();
            $table->jsonb('metadata')->nullable();

            // Reversal tracking
            $table->uuid('reversed_transaction_id')->nullable();
            $table->text('reversal_reason')->nullable();

            // Timestamps
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('reversed_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('sender_wallet_id');
            $table->index('receiver_wallet_id');
            $table->index('sender_user_id');
            $table->index('receiver_user_id');
            $table->index('type');
            $table->index('status');
            $table->index('created_at');
            $table->index('reversed_transaction_id');
            $table->index(['type', 'status']);
        });

        // Add GIN index for JSONB (PostgreSQL only)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE INDEX idx_transactions_metadata ON transactions USING GIN (metadata)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
