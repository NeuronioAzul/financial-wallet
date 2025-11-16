<?php

namespace Tests\Unit\Enums;

use App\Enums\DocumentStatus;
use Tests\TestCase;

class DocumentStatusTest extends TestCase
{
    public function test_has_all_expected_values(): void
    {
        $this->assertEquals('pending', DocumentStatus::PENDING->value);
        $this->assertEquals('approved', DocumentStatus::APPROVED->value);
        $this->assertEquals('rejected', DocumentStatus::REJECTED->value);
    }

    public function test_can_get_all_cases(): void
    {
        $cases = DocumentStatus::cases();

        $this->assertCount(3, $cases);
    }

    public function test_can_create_from_value(): void
    {
        $status = DocumentStatus::from('approved');

        $this->assertEquals(DocumentStatus::APPROVED, $status);
    }
}
