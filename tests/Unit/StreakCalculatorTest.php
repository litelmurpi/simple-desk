<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\StreakCalculator;
use App\Models\Ticket;
use Carbon\Carbon;

class StreakCalculatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_calculates_zero_streak_if_no_completed_tickets(): void
    {
        $calculator = app(StreakCalculator::class);
        $this->assertEquals(0, $calculator->getCurrentStreak());
    }

    public function test_calculates_current_streak_including_today(): void
    {
        // Ticket completed today
        Ticket::create(['ticket_number' => 'T1', 'title' => 'T', 'type' => 'bug', 'status' => 'done', 'priority' => 'low', 'completed_at' => Carbon::now()]);
        // Ticket completed yesterday
        Ticket::create(['ticket_number' => 'T2', 'title' => 'T', 'type' => 'bug', 'status' => 'done', 'priority' => 'low', 'completed_at' => Carbon::now()->subDays(1)]);

        // 2 consecutive days
        $calculator = app(StreakCalculator::class);
        $this->assertEquals(2, $calculator->getCurrentStreak());
    }
    
    public function test_streak_does_not_break_if_not_completed_today_but_completed_yesterday(): void
    {
        // Streak is still considered active if they just haven't finished a ticket yet today, but they did yesterday.
        Ticket::create(['ticket_number' => 'T2', 'title' => 'T', 'type' => 'bug', 'status' => 'done', 'priority' => 'low', 'completed_at' => Carbon::now()->subDays(1)]);
        Ticket::create(['ticket_number' => 'T3', 'title' => 'T', 'type' => 'bug', 'status' => 'done', 'priority' => 'low', 'completed_at' => Carbon::now()->subDays(2)]);

        $calculator = app(StreakCalculator::class);
        $this->assertEquals(2, $calculator->getCurrentStreak());
    }

    public function test_streak_breaks_if_gap_is_more_than_one_day(): void
    {
        // Completed today, gap, completed 3 days ago
        Ticket::create(['ticket_number' => 'T1', 'title' => 'T', 'type' => 'bug', 'status' => 'done', 'priority' => 'low', 'completed_at' => Carbon::now()]);
        Ticket::create(['ticket_number' => 'T2', 'title' => 'T', 'type' => 'bug', 'status' => 'done', 'priority' => 'low', 'completed_at' => Carbon::now()->subDays(3)]);

        // Over past 30 days query, today has a ticket, then yesterday none, then day before none.
        // Current streak is just 1 (today).
        $calculator = app(StreakCalculator::class);
        $this->assertEquals(1, $calculator->getCurrentStreak());
    }
}
