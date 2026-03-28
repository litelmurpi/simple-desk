<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PomodoroTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_log_time_on_ticket(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'status' => 'open',
            'priority' => 'low',
            'type' => 'todo',
            'time_spent_minutes' => 0
        ]);

        $response = $this->actingAs($user)->post(route('tickets.log-time', $ticket->id), [
            'minutes' => 25,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'time_spent_minutes' => 25,
        ]);
    }

    public function test_requires_active_minutes_to_log(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'status' => 'open',
            'priority' => 'low',
            'type' => 'todo',
            'time_spent_minutes' => 10
        ]);

        // Trying to log 0 minutes or negative
        $response = $this->actingAs($user)->post(route('tickets.log-time', $ticket->id), [
            'minutes' => 0,
        ]);

        $response->assertSessionHasErrors('minutes');
        
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'time_spent_minutes' => 10,
        ]);
    }
}
