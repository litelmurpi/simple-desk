<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketAttachmentController extends Controller
{
    public function store(Request $request, Ticket $ticket)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'note_id' => 'nullable|exists:ticket_notes,id'
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $mimeType = $file->getClientMimeType();
        $fileSize = $file->getSize();

        // Store file in 'attachments' disk/directory
        $path = $file->store('attachments');

        $ticket->attachments()->create([
            'ticket_note_id' => $request->note_id,
            'file_path' => $path,
            'file_name' => $fileName,
            'mime_type' => $mimeType,
            'file_size' => $fileSize,
        ]);

        return back()->with('success', 'Attachment uploaded successfully.');
    }

    public function download(Ticket $ticket, TicketAttachment $ticket_attachment)
    {
        if ($ticket_attachment->ticket_id !== $ticket->id) {
            abort(404);
        }

        if (!Storage::exists($ticket_attachment->file_path)) {
            abort(404, 'File not found on server.');
        }

        return Storage::download(
            $ticket_attachment->file_path,
            $ticket_attachment->file_name
        );
    }

    public function destroy(Ticket $ticket, TicketAttachment $ticket_attachment)
    {
        if ($ticket_attachment->ticket_id !== $ticket->id) {
            abort(404);
        }

        if (Storage::exists($ticket_attachment->file_path)) {
            Storage::delete($ticket_attachment->file_path);
        }

        $ticket_attachment->delete();

        return back()->with('success', 'Attachment deleted successfully.');
    }
}
