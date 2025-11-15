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
        Schema::create('transaction_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('transaction_id');
            $table->smallInteger('previous_status')->nullable();
            $table->smallInteger('new_status');
            $table->string('event_type', 50)->comment('created, processing, completed, failed, reversed');
            $table->text('error_message')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Foreign key
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');

            // Indexes
            $table->index('transaction_id');
            $table->index('created_at');
            $table->index('event_type');
        });

        // Add GIN index for JSONB (PostgreSQL only)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE INDEX idx_transaction_logs_metadata ON transaction_logs USING GIN (metadata)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_logs');
    }
};
