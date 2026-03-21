<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\TicketNumberGenerator;
use App\Models\Ticket;

class TicketNumberGeneratorTest extends TestCase
{
    use RefreshDatabase;

    public function test_generates_first_number(): void
    {
        $generator = new TicketNumberGenerator();
        $this->assertEquals('SD-0001', $generator->generate());
    }

    public function test_increments_sequential_number(): void
    {
        Ticket::create([
            'ticket_number' => 'SD-0500',
            'title' => 'Test',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'low'
        ]);

        $generator = new TicketNumberGenerator();
        $this->assertEquals('SD-0501', $generator->generate());
    }

    public function test_handles_overflow_format(): void
    {
        Ticket::create([
            'ticket_number' => 'SD-9999',
            'title' => 'Test',
            'type' => 'bug',
            'status' => 'open',
            'priority' => 'low'
        ]);

        $generator = new TicketNumberGenerator();
        $this->assertEquals('SD-10000', $generator->generate());
    }
}
