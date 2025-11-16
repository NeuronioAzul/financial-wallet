<?php

namespace Tests\Feature;

use Tests\TestCase;

class PublicEndpointsTest extends TestCase
{
    // Testes de existência e resposta das rotas

    public function test_health_endpoint_exists_and_returns_200(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
    }

    public function test_health_endpoint_returns_json(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertJson(['status' => 'ok']);
    }

    public function test_health_check_has_correct_json_structure(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertJsonStructure(['status']);
    }

    public function test_register_endpoint_exists(): void
    {
        $response = $this->postJson('/api/v1/register', []);

        // Deve retornar erro de validação, não 404
        $response->assertStatus(422);
    }

    public function test_register_endpoint_returns_json(): void
    {
        $response = $this->postJson('/api/v1/register', []);

        $response->assertJsonStructure(['message', 'errors']);
    }

    public function test_login_endpoint_exists(): void
    {
        $response = $this->postJson('/api/v1/login', []);

        // Deve retornar erro de validação, não 404
        $response->assertStatus(422);
    }

    public function test_login_endpoint_returns_json(): void
    {
        $response = $this->postJson('/api/v1/login', []);

        $response->assertJsonStructure(['message', 'errors']);
    }

    public function test_nonexistent_route_returns_404(): void
    {
        $response = $this->getJson('/api/v1/nonexistent-route');

        $response->assertStatus(404);
    }
}
