<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of subjects with their completion progress.
     */
    public function index()
    {
        $subjects = Subject::withCount(['tickets', 'tickets as done_tickets_count' => function ($query) {
            $query->where('status', 'done');
        }])->get()->map(function ($subject) {
            $subject->progress = $subject->tickets_count > 0 
                ? round(($subject->done_tickets_count / $subject->tickets_count) * 100) 
                : 0;
            return $subject;
        });

        return Inertia::render('Subjects/Index', [
            'subjects' => $subjects
        ]);
    }

    /**
     * Display the specific subject and all its related tickets.
     */
    public function show(Subject $subject)
    {
        $tickets = $subject->tickets()
            ->with('tags')
            ->orderBy('is_archived')
            ->orderByRaw("CASE WHEN status = 'blocked' THEN 1 WHEN status = 'in_progress' THEN 2 WHEN status = 'open' THEN 3 WHEN status = 'done' THEN 4 ELSE 5 END")
            ->orderByRaw("CASE WHEN priority = 'urgent' THEN 1 WHEN priority = 'high' THEN 2 WHEN priority = 'medium' THEN 3 WHEN priority = 'low' THEN 4 ELSE 5 END")
            ->orderBy('deadline_at', 'asc')
            ->get();

        // Calculate progress for this single subject
        $total = $tickets->count();
        $done = $tickets->where('status', 'done')->count();
        $subject->progress = $total > 0 ? round(($done / $total) * 100) : 0;
        $subject->tickets_count = $total;
        $subject->done_tickets_count = $done;

        return Inertia::render('Subjects/Show', [
            'subject' => $subject,
            'tickets' => $tickets
        ]);
    }
}
