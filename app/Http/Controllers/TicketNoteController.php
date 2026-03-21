<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketNote;
use Illuminate\Http\Request;

class TicketNoteController extends Controller
{
    public function store(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:10000',
        ]);

        $note = $ticket->notes()->create([
            'body' => $validated['body'],
        ]);

        // Create initial version
        $note->versions()->create([
            'body' => $note->body,
            'version_number' => 1,
        ]);

        return back()->with('success', 'Note added successfully.');
    }

    public function update(Request $request, Ticket $ticket, TicketNote $ticket_note)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:10000',
        ]);

        // Prevent update if it doesn't belong to current ticket
        if ($ticket_note->ticket_id !== $ticket->id) {
            abort(404);
        }

        // Check if body actually changed
        if ($ticket_note->body === $validated['body']) {
            return back();
        }

        // Get max version
        $lastVersion = $ticket_note->versions()->max('version_number') ?? 0;
        $nextVersion = $lastVersion + 1;

        // Update the note
        $ticket_note->update([
            'body' => $validated['body'],
        ]);

        // Save new version
        $ticket_note->versions()->create([
            'body' => $ticket_note->body,
            'version_number' => $nextVersion,
        ]);

        return back()->with('success', 'Note updated successfully.');
    }

    public function destroy(Ticket $ticket, TicketNote $ticket_note)
    {
        if ($ticket_note->ticket_id !== $ticket->id) {
            abort(404);
        }

        // Due to cascade constraint, versions and attached files might need checking
        // but PRD specifies we can just delete it natively.
        $ticket_note->delete();

        return back()->with('success', 'Note deleted successfully.');
    }
}
