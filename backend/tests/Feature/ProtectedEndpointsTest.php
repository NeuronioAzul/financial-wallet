<?php

namespace Tests\Feature;

use Tests\TestCase;

class ProtectedEndpointsTest extends TestCase
{
    public function test_wallet_endpoint_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/wallet');

        $response->assertStatus(401);
    }

    public function test_balance_endpoint_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/wallet/balance');

        $response->assertStatus(401);
    }

    public function test_deposit_endpoint_requires_authentication(): void
    {
        $response = $this->postJson('/api/v1/transactions/deposit', []);

        $response->assertStatus(401);
    }

    public function test_transfer_endpoint_requires_authentication(): void
    {
        $response = $this->postJson('/api/v1/transactions/transfer', []);

        $response->assertStatus(401);
    }

    public function test_transactions_list_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/transactions');

        $response->assertStatus(401);
    }
}
