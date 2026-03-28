<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Subject;
use App\Services\StreakCalculator;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(StreakCalculator $streakCalculator)
    {
        $today = now()->startOfDay();
        $endOfWeek = now()->endOfWeek();

        // 1. Stats Cards Data
        $openCount = Ticket::where('status', 'open')->where('is_archived', false)->count();
        $inProgressCount = Ticket::where('status', 'in_progress')->where('is_archived', false)->count();
        $doneTodayCount = Ticket::where('status', 'done')
            ->whereDate('completed_at', now()->toDateString())
            ->count();
        $currentStreak = $streakCalculator->getCurrentStreak();

        // 2. Deadlines (Today & This Week)
        $dueToday = Ticket::with(['subject', 'tags'])
            ->dueToday()
            ->where('is_archived', false)
            ->orderBy('priority', 'desc')
            ->get();

        $dueThisWeek = Ticket::with(['subject', 'tags'])
            ->dueThisWeek()
            ->whereDate('deadline_at', '>', now()->toDateString()) // Exclude today
            ->where('is_archived', false)
            ->orderBy('deadline_at', 'asc')
            ->orderBy('priority', 'desc')
            ->get();

        // 2.5. Pinned Tickets
        $pinnedTickets = Ticket::with(['subject', 'tags'])
            ->pinned()
            ->where('is_archived', false)
            ->orderBy('pinned_at', 'desc')
            ->get();

        // 3. Subject Progress (Active subjects only)
        $subjects = Subject::where('is_active', true)->get()->map(function ($subject) {
            $total = Ticket::where('subject_id', $subject->id)->where('is_archived', false)->count();
            $done = Ticket::where('subject_id', $subject->id)->where('status', 'done')->where('is_archived', false)->count();
            $percentage = $total > 0 ? round(($done / $total) * 100) : 0;
            
            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'color' => $subject->color,
                'total' => $total,
                'done' => $done,
                'percentage' => $percentage,
            ];
        });

        // 4. Productivity Chart Data (Last 14 days for cleaner UI, or 30 days)
        $chartData = collect(range(13, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo);
            $count = Ticket::where('status', 'done')
                ->whereDate('completed_at', $date->toDateString())
                ->count();
            return [
                'date' => $date->format('M d'),
                'completed' => $count,
                'fullDate' => $date->toDateString()
            ];
        })->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'open' => $openCount,
                'inProgress' => $inProgressCount,
                'doneToday' => $doneTodayCount,
                'streak' => $currentStreak,
            ],
            'deadlines' => [
                'today' => $dueToday,
                'thisWeek' => $dueThisWeek,
            ],
            'pinnedTickets' => $pinnedTickets,
            'subjectProgress' => $subjects,
            'chartData' => $chartData,
        ]);
    }
}
