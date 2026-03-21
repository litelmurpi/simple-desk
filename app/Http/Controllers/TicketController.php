<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Subject;
use App\Models\Tag;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Ticket::with(['subject', 'tags'])->where('is_archived', false);

        // Filters
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('ticket_number', 'like', "%{$search}%");
            });
        }
        
        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $tickets = $query->paginate(20)->withQueryString();
        
        // Load data for filters
        $subjects = Subject::where('is_active', true)->get(['id', 'name', 'code', 'color']);
        $tags = Tag::all(['id', 'name', 'color']);

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'subjects' => $subjects,
            'tags' => $tags,
            'filters' => $request->only(['type', 'status', 'priority', 'subject_id', 'search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $subjects = Subject::where('is_active', true)->get(['id', 'name']);
        $tags = Tag::all(['id', 'name']);

        return Inertia::render('Tickets/Create', [
            'subjects' => $subjects,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        $ticket = Ticket::create($request->validated());

        if ($request->has('tags')) {
            $ticket->tags()->sync($request->tags);
        }

        return redirect()->route('tickets.show', $ticket)
            ->with('success', 'Ticket created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        $ticket->load([
            'subject', 
            'tags', 
            'histories' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'notes.versions',
            'attachments'
        ]);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        $ticket->load(['subject', 'tags']);
        
        $subjects = Subject::where('is_active', true)->get(['id', 'name']);
        $tags = Tag::all(['id', 'name']);

        return Inertia::render('Tickets/Edit', [
            'ticket' => $ticket,
            'subjects' => $subjects,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        $ticket->update($request->validated());

        if ($request->has('tags')) {
            $ticket->tags()->sync($request->tags);
        }

        return redirect()->route('tickets.show', $ticket)
            ->with('success', 'Ticket updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete(); // Soft delete

        return redirect()->route('tickets.index')
            ->with('success', 'Ticket moved to trash.');
    }
}
