<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Ticket;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_renders_status_200(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_stats_renders_status_200(): void
    {
        $response = $this->get('/stats');
        $response->assertStatus(200);
    }
}
