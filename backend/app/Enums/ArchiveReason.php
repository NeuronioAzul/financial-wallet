<?php

namespace App\Enums;

enum ArchiveReason: int
{
    case USER_REQUEST = 1;
    case LGPD_COMPLIANCE = 2;
    case ACCOUNT_CLOSURE = 3;
    case FRAUD_DETECTION = 4;
    case INACTIVITY = 5;
    case ADMINISTRATIVE = 6;

    public function label(): string
    {
        return match($this) {
            self::USER_REQUEST => 'User Request',
            self::LGPD_COMPLIANCE => 'LGPD Compliance',
            self::ACCOUNT_CLOSURE => 'Account Closure',
            self::FRAUD_DETECTION => 'Fraud Detection',
            self::INACTIVITY => 'Inactivity',
            self::ADMINISTRATIVE => 'Administrative',
        };
    }
}
