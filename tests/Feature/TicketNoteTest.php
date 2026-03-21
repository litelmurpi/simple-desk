<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Ticket;
use App\Models\TicketNote;

class TicketNoteTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_ticket_note(): void
    {
        $ticket = Ticket::create([
            'ticket_number' => 'SD-0001',
            'title' => 'Test Ticket',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'medium'
        ]);

        $response = $this->post("/tickets/{$ticket->id}/notes", [
            'body' => 'This is a test note.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('ticket_notes', [
            'ticket_id' => $ticket->id,
            'body' => 'This is a test note.',
        ]);
    }

    public function test_can_update_ticket_note_and_create_version(): void
    {
        $ticket = Ticket::create([
            'ticket_number' => 'SD-0002',
            'title' => 'Test Ticket',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'medium'
        ]);

        $note = TicketNote::create([
            'ticket_id' => $ticket->id,
            'body' => 'Original note body',
        ]);

        $note->versions()->create([
            'body' => 'Original note body',
            'version_number' => 1,
        ]);

        $response = $this->put("/tickets/{$ticket->id}/notes/{$note->id}", [
            'body' => 'Updated note body',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('ticket_notes', [
            'id' => $note->id,
            'body' => 'Updated note body',
        ]);

        $this->assertDatabaseHas('ticket_note_versions', [
            'ticket_note_id' => $note->id,
            'body' => 'Updated note body',
            'version_number' => 2,
        ]);
    }

    public function test_can_delete_ticket_note(): void
    {
        $ticket = Ticket::create([
            'ticket_number' => 'SD-0003',
            'title' => 'Test Ticket',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'medium'
        ]);

        $note = TicketNote::create([
            'ticket_id' => $ticket->id,
            'body' => 'Delete me',
        ]);

        $response = $this->delete("/tickets/{$ticket->id}/notes/{$note->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('ticket_notes', [
            'id' => $note->id,
        ]);
    }
}
