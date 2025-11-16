<?php

namespace App\Models;

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'document_type',
        'file_path',
        'file_name',
        'mime_type',
        'size',
        'status',
        'rejection_reason',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'document_type' => DocumentType::class,
        'status' => DocumentStatus::class,
        'verified_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function isPending(): bool
    {
        return $this->status === DocumentStatus::PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === DocumentStatus::APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === DocumentStatus::REJECTED;
    }
}
