<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    /**
     * Render the calendar view with tickets for the requested month.
     */
    public function index(Request $request)
    {
        $year = $request->integer('year', Carbon::now()->year);
        $month = $request->integer('month', Carbon::now()->month);

        $date = Carbon::createFromDate($year, $month, 1);
        $startOfMonth = $date->copy()->startOfMonth()->startOfWeek();
        $endOfMonth = $date->copy()->endOfMonth()->endOfWeek();

        // Fetch tickets with deadlines within the calendar grid
        $tickets = Ticket::with(['subject', 'tags'])
            ->whereNotNull('deadline_at')
            ->whereBetween('deadline_at', [$startOfMonth, $endOfMonth])
            ->get();

        return Inertia::render('Calendar', [
            'tickets' => $tickets,
            'currentYear' => $year,
            'currentMonth' => $month,
        ]);
    }
}
