<?php

namespace App\Enums;

enum TransactionType: int
{
    case DEPOSIT = 1;
    case TRANSFER = 2;
    case REVERSAL = 3;

    public function label(): string
    {
        return match($this) {
            self::DEPOSIT => 'Deposit',
            self::TRANSFER => 'Transfer',
            self::REVERSAL => 'Reversal',
        };
    }
}
