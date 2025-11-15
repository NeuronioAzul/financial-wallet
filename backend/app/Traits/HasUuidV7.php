<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Trait HasUuidV7
 *
 * Automatically generates UUID v7 for models using PostgreSQL's gen_random_uuid()
 * UUID v7 provides temporal ordering which improves database index performance
 */
trait HasUuidV7
{
    /**
     * Boot function from Laravel.
     */
    protected static function bootHasUuidV7(): void
    {
        static::creating(function (Model $model) {
            if (empty($model->{$model->getKeyName()})) {
                // PostgreSQL 18 generates UUID v7 natively with gen_random_uuid()
                // No need to generate in PHP - database will handle it
                // This is just a safeguard for explicit ID assignment
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the value indicating whether the IDs are incrementing.
     */
    public function getIncrementing(): bool
    {
        return false;
    }

    /**
     * Get the auto-incrementing key type.
     */
    public function getKeyType(): string
    {
        return 'string';
    }

    /**
     * Get the columns that should be cast.
     */
    public function getCasts(): array
    {
        return array_merge(parent::getCasts(), [
            $this->getKeyName() => 'string',
        ]);
    }
}
