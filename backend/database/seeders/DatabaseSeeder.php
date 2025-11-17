<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Enums\WalletStatus;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles and permissions first
        $this->call(RolesAndPermissionsSeeder::class);

        // Create test user 1: João
        $user1 = User::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => 'João Silva',
            'email' => 'joao@example.com',
            'password' => Hash::make('password'),
            'document' => '12345678901',
            'phone' => '11987654321',
            'status' => UserStatus::ACTIVE,
            'theme_mode' => 'light',
            'email_verified_at' => now(),
        ]);

        Wallet::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'user_id' => $user1->id,
            'balance' => 1000.00,
            'currency' => 'BRL',
            'status' => WalletStatus::ACTIVE,
        ]);

        // Assign admin role to João
        $user1->assignRole('admin');

        // Create test user 2: Maria
        $user2 = User::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'password' => Hash::make('password'),
            'document' => '98765432109',
            'phone' => '11912345678',
            'status' => UserStatus::ACTIVE,
            'theme_mode' => 'dark',
            'email_verified_at' => now(),
        ]);

        Wallet::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'user_id' => $user2->id,
            'balance' => 500.00,
            'currency' => 'BRL',
            'status' => WalletStatus::ACTIVE,
        ]);

        // Assign customer role to Maria
        $user2->assignRole('customer');

        $this->command->info('Test users created successfully!');
        $this->command->info('João (admin): joao@example.com / password (Balance: R$ 1000.00)');
        $this->command->info('Maria (customer): maria@example.com / password (Balance: R$ 500.00)');
    }
}
