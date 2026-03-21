<?php

namespace App\Services;

use App\Models\Ticket;
use Illuminate\Support\Facades\DB;

class TicketNumberGenerator
{
    /**
     * Generate next available ticket number in SD-XXXX format
     */
    public function generate(): string
    {
        return DB::transaction(function () {
            // Lock the table for reading to prevent race conditions
            $lastTicket = Ticket::withTrashed()
                ->lockForUpdate()
                ->orderBy('id', 'desc')
                ->first();

            if (!$lastTicket || empty($lastTicket->ticket_number)) {
                return 'SD-0001';
            }

            // Extract number from format 'SD-XXXX'
            $numberStr = str_replace('SD-', '', $lastTicket->ticket_number);
            $nextNumber = intval($numberStr) + 1;

            // Pad with zero up to 4 digits (e.g. 5 -> 0005, 9999 -> 10000)
            return 'SD-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        });
    }
}
