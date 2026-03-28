<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Ticket;

class PinnedTicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_toggle_pin_on_ticket(): void
    {
        $ticket = Ticket::create([
            'ticket_number' => 'SD-1001',
            'title' => 'Test Ticket',
            'type' => 'todo',
            'status' => 'open',
            'priority' => 'medium'
        ]);

        $ticket->refresh();
        $this->assertFalse((bool)$ticket->is_pinned);

        $response = $this->patch("/tickets/{$ticket->id}/pin");
        $response->assertRedirect();

        $ticket->refresh();
        $this->assertTrue((bool)$ticket->is_pinned);
        $this->assertNotNull($ticket->pinned_at);
    }

    public function test_can_unpin_ticket(): void
    {
        $ticket = Ticket::create([
            'ticket_number' => 'SD-1002',
            'title' => 'Test Ticket',
            'type' => 'todo',
            'status' => 'open',
            'priority' => 'medium',
            'is_pinned' => true,
            'pinned_at' => now(),
        ]);

        $response = $this->patch("/tickets/{$ticket->id}/pin");
        $response->assertRedirect();

        $ticket->refresh();
        $this->assertFalse((bool)$ticket->is_pinned);
        $this->assertNull($ticket->pinned_at);
    }

    public function test_pinned_tickets_appear_on_dashboard(): void
    {
        $ticket = Ticket::create([
            'ticket_number' => 'SD-1003',
            'title' => 'Test Ticket',
            'type' => 'todo',
            'status' => 'open',
            'priority' => 'medium',
            'is_pinned' => true,
            'pinned_at' => now(),
        ]);

        $response = $this->get('/dashboard');
        $response->assertStatus(200);
        $response->assertSee('SD-1003'); // Using inertia testing would be better, but this checks if the prop is rendered in the page if using SSR or string matching
    }
}
