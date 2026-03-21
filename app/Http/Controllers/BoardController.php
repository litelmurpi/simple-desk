<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoardController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['subject', 'tags'])->where('is_archived', false);

        // Allow filtering by subject on the board
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        $tickets = $query->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get();
        $subjects = Subject::where('is_active', true)->get(['id', 'name', 'color']);

        return Inertia::render('Board', [
            'tickets' => $tickets,
            'subjects' => $subjects,
            'filters' => $request->only(['subject_id']),
        ]);
    }
}
