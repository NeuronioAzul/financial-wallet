<?php

namespace Database\Factories;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'transaction_code' => 'TXN-' . strtoupper(Str::random(8)) . '-' . time(),
            'type' => fake()->randomElement([
                TransactionType::DEPOSIT,
                TransactionType::TRANSFER,
            ]),
            'status' => TransactionStatus::COMPLETED,
            'sender_wallet_id' => null,
            'sender_user_id' => null,
            'sender_previous_balance' => null,
            'sender_new_balance' => null,
            'receiver_wallet_id' => Wallet::factory(),
            'receiver_user_id' => User::factory(),
            'receiver_previous_balance' => 0.00,
            'receiver_new_balance' => 100.00,
            'amount' => 100.00,
            'currency' => 'BRL',
            'description' => fake()->sentence(),
            'completed_at' => now(),
        ];
    }

    public function deposit(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TransactionType::DEPOSIT,
            'sender_wallet_id' => null,
            'sender_user_id' => null,
            'sender_previous_balance' => null,
            'sender_new_balance' => null,
        ]);
    }

    public function transfer(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TransactionType::TRANSFER,
            'sender_wallet_id' => Wallet::factory(),
            'sender_user_id' => User::factory(),
            'sender_previous_balance' => 500.00,
            'sender_new_balance' => 400.00,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TransactionStatus::PENDING,
            'completed_at' => null,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TransactionStatus::FAILED,
            'failed_at' => now(),
        ]);
    }

    public function reversed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TransactionStatus::REVERSED,
            'reversed_at' => now(),
        ]);
    }
}
