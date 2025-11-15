<?php

namespace App\Enums;

enum WalletStatus: int
{
    case ACTIVE = 1;
    case INACTIVE = 2;
    case BLOCKED = 3;

    public function label(): string
    {
        return match($this) {
            self::ACTIVE => 'Active',
            self::INACTIVE => 'Inactive',
            self::BLOCKED => 'Blocked',
        };
    }
}
