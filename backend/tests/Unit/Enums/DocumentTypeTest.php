<?php

namespace Tests\Unit\Enums;

use App\Enums\DocumentType;
use Tests\TestCase;

class DocumentTypeTest extends TestCase
{
    public function test_has_all_expected_values(): void
    {
        $this->assertEquals('photo', DocumentType::PHOTO->value);
        $this->assertEquals('rg', DocumentType::RG->value);
        $this->assertEquals('rg_front', DocumentType::RG_FRONT->value);
        $this->assertEquals('rg_back', DocumentType::RG_BACK->value);
        $this->assertEquals('cnh', DocumentType::CNH->value);
        $this->assertEquals('cnh_front', DocumentType::CNH_FRONT->value);
        $this->assertEquals('cnh_back', DocumentType::CNH_BACK->value);
        $this->assertEquals('cpf', DocumentType::CPF->value);
        $this->assertEquals('comprovante_residencia', DocumentType::COMPROVANTE_RESIDENCIA->value);
        $this->assertEquals('cartao_credito', DocumentType::CARTAO_CREDITO->value);
        $this->assertEquals('outros', DocumentType::OUTROS->value);
    }

    public function test_can_get_all_cases(): void
    {
        $cases = DocumentType::cases();

        $this->assertCount(11, $cases);
    }

    public function test_can_create_from_value(): void
    {
        $type = DocumentType::from('photo');

        $this->assertEquals(DocumentType::PHOTO, $type);
    }
}
