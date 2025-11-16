<?php

namespace App\Enums;

enum DocumentType: string
{
    case PHOTO = 'photo';
    case RG = 'rg';
    case RG_FRONT = 'rg_front';
    case RG_BACK = 'rg_back';
    case CNH = 'cnh';
    case CNH_FRONT = 'cnh_front';
    case CNH_BACK = 'cnh_back';
    case CPF = 'cpf';
    case COMPROVANTE_RESIDENCIA = 'comprovante_residencia';
    case CARTAO_CREDITO = 'cartao_credito';
    case OUTROS = 'outros';

    public function label(): string
    {
        return match ($this) {
            self::PHOTO => 'Foto (Selfie)',
            self::RG => 'RG',
            self::RG_FRONT => 'RG - Frente',
            self::RG_BACK => 'RG - Verso',
            self::CNH => 'CNH',
            self::CNH_FRONT => 'CNH - Frente',
            self::CNH_BACK => 'CNH - Verso',
            self::CPF => 'CPF',
            self::COMPROVANTE_RESIDENCIA => 'Comprovante de Residência',
            self::CARTAO_CREDITO => 'Cartão de Crédito',
            self::OUTROS => 'Outros',
        };
    }
}
