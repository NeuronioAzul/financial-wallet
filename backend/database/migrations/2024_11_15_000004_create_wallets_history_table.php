<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wallets_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('original_wallet_id');
            $table->uuid('original_user_id');

            // Wallet data snapshot
            $table->decimal('balance', 15, 2);
            $table->string('currency', 3);
            $table->smallInteger('status');

            // Archive metadata
            $table->smallInteger('archive_reason')->comment('1=user_request, 2=lgpd_compliance, 3=account_closure, 4=fraud_detection, 5=inactivity, 6=administrative');
            $table->text('archive_description')->nullable();
            $table->uuid('archived_by')->nullable();
            $table->ipAddress('archived_by_ip')->nullable();

            // Original timestamps
            $table->timestamp('original_created_at');
            $table->timestamp('original_updated_at');

            // Archive timestamp
            $table->timestamp('archived_at')->useCurrent();

            // Indexes
            $table->index('original_wallet_id');
            $table->index('original_user_id');
            $table->index('archived_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets_history');
    }
};
