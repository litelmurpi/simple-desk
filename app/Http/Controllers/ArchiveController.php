<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        $tickets = Ticket::where('is_archived', true)
            ->with(['subject', 'tags'])
            ->latest('updated_at')
            ->paginate(50)
            ->withQueryString()
            ->through(fn ($ticket) => [
                'id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'title' => $ticket->title,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'type' => $ticket->type,
                'subject' => $ticket->subject ? ['id' => $ticket->subject->id, 'name' => $ticket->subject->name, 'color' => $ticket->subject->color] : null,
                'deadline_at' => $ticket->deadline_at,
                'completed_at' => $ticket->completed_at,
                'updated_at' => $ticket->updated_at,
                'tags' => $ticket->tags->map(fn ($tag) => ['id' => $tag->id, 'name' => $tag->name, 'color' => $tag->color]),
            ]);

        return Inertia::render('Archive', [
            'tickets' => $tickets
        ]);
    }
}
