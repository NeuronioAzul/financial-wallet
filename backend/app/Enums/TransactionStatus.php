<?php

namespace App\Enums;

enum TransactionStatus: int
{
    case PENDING = 1;
    case PROCESSING = 2;
    case COMPLETED = 3;
    case FAILED = 4;
    case REVERSED = 5;

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::PROCESSING => 'Processing',
            self::COMPLETED => 'Completed',
            self::FAILED => 'Failed',
            self::REVERSED => 'Reversed',
        };
    }
}
