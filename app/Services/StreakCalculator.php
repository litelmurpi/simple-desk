<?php

namespace App\Services;

use App\Models\Ticket;
use Carbon\Carbon;

class StreakCalculator
{
    /**
     * Calculate current streak of consecutive days with at least one completed ticket.
     * 
     * @return int
     */
    public function getCurrentStreak(): int
    {
        // Get all unique dates where tickets were completed, ordered by date descending
        // We use Carbon to ensure we're comparing just the date part
        $dates = Ticket::whereNotNull('completed_at')
            ->orderBy('completed_at', 'desc')
            ->pluck('completed_at')
            ->map(fn($date) => Carbon::parse($date)->toDateString())
            ->unique()
            ->values();

        if ($dates->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        // If neither today nor yesterday has activity, the streak is broken (0)
        if ($dates[0] !== $today && $dates[0] !== $yesterday) {
            return 0;
        }

        $currentDateToCheck = $dates[0]; // Could be today or yesterday
        $expectedDate = Carbon::parse($currentDateToCheck);

        foreach ($dates as $date) {
            if ($date === $expectedDate->toDateString()) {
                $streak++;
                $expectedDate->subDay();
            } else {
                break; // Streak broken
            }
        }

        return $streak;
    }
}
