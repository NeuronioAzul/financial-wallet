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
        Schema::create('lgpd_audit_log', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('entity_type', 50)->comment('users, wallets, transactions');
            $table->uuid('entity_id');
            $table->string('action', 50)->comment('archive, anonymize, export, delete');
            $table->text('reason');
            $table->text('details')->nullable();
            $table->uuid('performed_by')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index('entity_type');
            $table->index('entity_id');
            $table->index('action');
            $table->index('performed_by');
            $table->index('created_at');
            $table->index(['entity_type', 'entity_id']);
        });

        // Add GIN index for JSONB (PostgreSQL only)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE INDEX idx_lgpd_audit_log_metadata ON lgpd_audit_log USING GIN (metadata)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lgpd_audit_log');
    }
};
