<?php

namespace Tests\Unit\Enums;

use App\Enums\DocumentType;
use Tests\TestCase;

class DocumentTypeTest extends TestCase
{
    public function test_has_all_expected_values(): void
    {
        $this->assertEquals('photo', DocumentType::PHOTO->value);
        $this->assertEquals('rg_front', DocumentType::RG_FRONT->value);
        $this->assertEquals('rg_back', DocumentType::RG_BACK->value);
        $this->assertEquals('cnh_front', DocumentType::CNH_FRONT->value);
        $this->assertEquals('cnh_back', DocumentType::CNH_BACK->value);
    }

    public function test_can_get_all_cases(): void
    {
        $cases = DocumentType::cases();

        $this->assertCount(5, $cases);
    }

    public function test_can_create_from_value(): void
    {
        $type = DocumentType::from('photo');

        $this->assertEquals(DocumentType::PHOTO, $type);
    }
}
