<?php

namespace Database\Factories;

use App\Enums\WalletStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class WalletFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'user_id' => User::factory(),
            'balance' => 0.00,
            'currency' => 'BRL',
            'status' => WalletStatus::ACTIVE,
        ];
    }

    public function withBalance(float $amount): static
    {
        return $this->state(fn (array $attributes) => [
            'balance' => $amount,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => WalletStatus::INACTIVE,
        ]);
    }
}
