<?php

namespace Tests;

use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions for tests
        if ($this->usesRefreshDatabase()) {
            $this->seed(RolesAndPermissionsSeeder::class);
        }
    }

    protected function usesRefreshDatabase(): bool
    {
        $uses = array_flip(class_uses_recursive(static::class));

        return isset($uses[\Illuminate\Foundation\Testing\RefreshDatabase::class]);
    }
}
