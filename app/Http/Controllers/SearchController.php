<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Tag;
use App\Models\Ticket;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q', '');

        if (empty(trim($query))) {
            return response()->json([
                'tickets' => [],
                'subjects' => [],
                'tags' => []
            ]);
        }

        $tickets = Ticket::with(['subject', 'tags'])
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('ticket_number', 'like', "%{$query}%");
            })
            ->where('is_archived', false)
            ->limit(10)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'title' => $ticket->title,
                    'ticket_number' => $ticket->ticket_number,
                    'status' => $ticket->status,
                    'priority' => $ticket->priority,
                    'subject' => $ticket->subject ? ['id' => $ticket->subject->id, 'name' => $ticket->subject->name, 'code' => $ticket->subject->code, 'color' => $ticket->subject->color] : null,
                    'url' => route('tickets.show', $ticket->id),
                ];
            });

        $subjects = Subject::where('name', 'like', "%{$query}%")
            ->orWhere('code', 'like', "%{$query}%")
            ->limit(5)
            ->get()
            ->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                    'color' => $subject->color,
                    'url' => route('subjects.show', $subject->id),
                ];
            });

        $tags = Tag::where('name', 'like', "%{$query}%")
            ->limit(5)
            ->get()
            ->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'color' => $tag->color,
                    'url' => route('tickets.index', ['search' => $tag->name]), // No distinct tag page right now, redirect to search
                ];
            });

        return response()->json([
            'tickets' => $tickets,
            'subjects' => $subjects,
            'tags' => $tags,
        ]);
    }
}
