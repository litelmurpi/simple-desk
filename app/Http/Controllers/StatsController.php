<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index()
    {
        $totalTickets = Ticket::count();
        $doneTickets = Ticket::where('status', 'done')->count();
        $completionRate = $totalTickets > 0 ? round(($doneTickets / $totalTickets) * 100) : 0;
        
        $ticketsByType = Ticket::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get();
            
        $ticketsByStatus = Ticket::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        return Inertia::render('Stats', [
            'totalTickets' => $totalTickets,
            'doneTickets' => $doneTickets,
            'completionRate' => $completionRate,
            'ticketsByType' => $ticketsByType,
            'ticketsByStatus' => $ticketsByStatus,
        ]);
    }
}
