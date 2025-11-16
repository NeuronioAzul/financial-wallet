<?php

namespace Tests\Unit\Enums;

use App\Enums\TransactionType;
use Tests\TestCase;

class TransactionTypeTest extends TestCase
{
    public function test_has_all_expected_values(): void
    {
        $this->assertEquals(1, TransactionType::DEPOSIT->value);
        $this->assertEquals(2, TransactionType::TRANSFER->value);
        $this->assertEquals(3, TransactionType::REVERSAL->value);
    }

    public function test_can_get_all_cases(): void
    {
        $cases = TransactionType::cases();

        $this->assertCount(3, $cases);
    }

    public function test_can_create_from_value(): void
    {
        $type = TransactionType::from(1);

        $this->assertEquals(TransactionType::DEPOSIT, $type);
    }

    public function test_has_label_method(): void
    {
        $this->assertEquals('Deposit', TransactionType::DEPOSIT->label());
        $this->assertEquals('Transfer', TransactionType::TRANSFER->label());
        $this->assertEquals('Reversal', TransactionType::REVERSAL->label());
    }
}
