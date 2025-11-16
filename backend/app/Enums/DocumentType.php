<?php

namespace App\Enums;

enum DocumentType: string
{
    case PHOTO = 'photo';
    case RG_FRONT = 'rg_front';
    case RG_BACK = 'rg_back';
    case CNH_FRONT = 'cnh_front';
    case CNH_BACK = 'cnh_back';

    public function label(): string
    {
        return match ($this) {
            self::PHOTO => 'Foto (Selfie)',
            self::RG_FRONT => 'RG - Frente',
            self::RG_BACK => 'RG - Verso',
            self::CNH_FRONT => 'CNH - Frente',
            self::CNH_BACK => 'CNH - Verso',
        };
    }
}
