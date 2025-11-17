<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use OwenIt\Auditing\Models\Audit;

class AuditSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::limit(2)->get();

        foreach ($users as $user) {
            // Create audit logs for user creation
            Audit::create([
                'user_id' => $user->id,
                'user_type' => User::class,
                'event' => 'created',
                'auditable_type' => User::class,
                'auditable_id' => $user->id,
                'old_values' => [],
                'new_values' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'url' => config('app.url') . '/api/v1/register',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            ]);

            // Create audit logs for profile update
            Audit::create([
                'user_id' => $user->id,
                'user_type' => User::class,
                'event' => 'updated',
                'auditable_type' => User::class,
                'auditable_id' => $user->id,
                'old_values' => [
                    'name' => $user->name,
                ],
                'new_values' => [
                    'name' => $user->name . ' (Updated)',
                ],
                'url' => config('app.url') . '/api/v1/profile',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            ]);

            // Create audit logs for wallet access
            if ($user->wallet) {
                Audit::create([
                    'user_id' => $user->id,
                    'user_type' => User::class,
                    'event' => 'created',
                    'auditable_type' => 'App\Models\Wallet',
                    'auditable_id' => $user->wallet->id,
                    'old_values' => [],
                    'new_values' => [
                        'balance' => $user->wallet->balance,
                        'currency' => 'BRL',
                    ],
                    'url' => config('app.url') . '/api/v1/wallet',
                    'ip_address' => '192.168.1.100',
                    'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
                ]);
            }
        }

        $this->command->info('Created audit logs for testing!');
    }
}
