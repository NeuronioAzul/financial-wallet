<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ThemeSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_theme_mode(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->patchJson('/api/v1/profile/theme-settings', [
                'theme_mode' => 'dark',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Theme settings updated successfully',
                'data' => [
                    'theme_mode' => 'dark',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'theme_mode' => 'dark',
        ]);
    }

    public function test_theme_mode_validation_rejects_invalid_values(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->patchJson('/api/v1/profile/theme-settings', [
                'theme_mode' => 'invalid',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['theme_mode']);
    }

    public function test_unauthenticated_user_cannot_update_theme_settings(): void
    {
        $response = $this->patchJson('/api/v1/profile/theme-settings', [
            'theme_mode' => 'dark',
        ]);

        $response->assertStatus(401);
    }

    public function test_default_theme_mode_is_set_correctly(): void
    {
        $user = User::factory()->create();

        $this->assertEquals('light', $user->theme_mode);
    }
}
