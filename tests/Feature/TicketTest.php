<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Ticket;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_tickets(): void
    {
        $response = $this->get('/tickets');
        $response->assertStatus(200);
    }

    public function test_can_create_ticket(): void
    {
        $response = $this->post('/tickets', [
            'title' => 'Implement Auth',
            'description' => 'We need to secure the system',
            'type' => 'project',
            'priority' => 'high',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'title' => 'Implement Auth',
            'type' => 'project',
            'status' => 'open'
        ]);
    }

    public function test_can_update_ticket_status(): void
    {
        $ticket = Ticket::create([
            'ticket_number' => 'SD-0001',
            'title' => 'Test Ticket',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'medium'
        ]);

        $response = $this->patch("/tickets/{$ticket->id}/status", [
            'status' => 'in_progress',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_can_delete_ticket(): void
    {
        $ticket = Ticket::create([
            'ticket_number' => 'SD-0002',
            'title' => 'Test Ticket 2',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'medium'
        ]);

        $response = $this->delete("/tickets/{$ticket->id}");

        $response->assertRedirect();
        $this->assertSoftDeleted('tickets', [
            'id' => $ticket->id,
        ]);
    }
}
