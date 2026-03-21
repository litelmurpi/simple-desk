<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\Ticket;
use App\Models\TicketAttachment;

class TicketAttachmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_upload_attachment(): void
    {
        Storage::fake('local');

        $ticket = Ticket::create([
            'ticket_number' => 'SD-0001',
            'title' => 'Attachment Ticket',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'medium'
        ]);

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->post("/tickets/{$ticket->id}/attachments", [
            'file' => $file,
        ]);

        $response->assertRedirect();
        
        $attachment = TicketAttachment::first();
        $this->assertNotNull($attachment);
        $this->assertEquals('document.pdf', $attachment->file_name);
        
        Storage::disk('local')->assertExists($attachment->file_path);
    }

    public function test_can_delete_attachment(): void
    {
        Storage::fake('local');

        $ticket = Ticket::create([
            'ticket_number' => 'SD-0002',
            'title' => 'Attachment Ticket',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'medium'
        ]);

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');
        $filePath = $file->store('attachments');

        $attachment = TicketAttachment::create([
            'ticket_id' => $ticket->id,
            'file_name' => 'document.pdf',
            'file_path' => $filePath,
            'mime_type' => 'application/pdf',
            'file_size' => 1024,
        ]);

        $response = $this->delete("/tickets/{$ticket->id}/attachments/{$attachment->id}");

        $response->assertRedirect();
        
        $this->assertDatabaseMissing('ticket_attachments', [
            'id' => $attachment->id,
        ]);
        
        Storage::disk('local')->assertMissing($filePath);
    }
}
