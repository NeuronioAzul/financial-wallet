<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiAccessTest extends TestCase
{
    public function test_api_is_accessible(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
    }

    public function test_api_returns_json(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertJson(['status' => 'ok']);
    }
}
