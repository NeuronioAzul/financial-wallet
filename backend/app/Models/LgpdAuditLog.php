<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LgpdAuditLog extends Model
{
    use HasFactory, HasUuidV7;

    /**
     * The table associated with the model.
     */
    protected $table = 'lgpd_audit_log';

    /**
     * Disable updated_at timestamp (only created_at is needed for audit logs).
     */
    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'entity_type',
        'entity_id',
        'action',
        'reason',
        'details',
        'performed_by',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }
}
