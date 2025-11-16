<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiAccessTest extends TestCase
{
    public function test_api_health_check_returns_successful_response(): void
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200);
    }

    public function test_api_returns_json_response(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJson(['status' => 'ok']);
    }

    public function test_invalid_route_returns_404(): void
    {
        $response = $this->getJson('/api/v1/invalid-route');

        $response->assertStatus(404);
    }
}
