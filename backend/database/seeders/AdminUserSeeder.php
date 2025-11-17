<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $this->command->info('Admin role created or already exists.');

        // Create admin user if doesn't exist
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('admin123'),
                'document' => '99999999999',
                'phone' => '11999999999',
                'status' => UserStatus::ACTIVE,
            ]
        );

        // Assign admin role
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
            $this->command->info('Admin role assigned to user.');
        }

        // Create wallet for admin if doesn't exist
        if (!$admin->wallet) {
            $admin->wallets()->create([
                'balance' => 10000.00,
                'currency' => 'BRL',
                'status' => \App\Enums\WalletStatus::ACTIVE,
            ]);
            $this->command->info('Wallet created for admin user.');
        }

        $this->command->info('Admin user setup complete!');
        $this->command->info('Email: admin@example.com');
        $this->command->info('Password: admin123');
    }
}
