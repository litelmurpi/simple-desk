<?php

namespace App\Observers;

use App\Models\Ticket;
use App\Models\TicketHistory;

class TicketObserver
{
    /**
     * Handle the Ticket "created" event.
     */
    public function created(Ticket $ticket): void
    {
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'action' => 'Ticket Created',
            'old_value' => null,
            'new_value' => 'Status: ' . $ticket->status,
        ]);
    }

    /**
     * Handle the Ticket "updating" event.
     */
    public function updating(Ticket $ticket): void
    {
        // Auto-set completed_at when status changes to 'done'
        if ($ticket->isDirty('status')) {
            if ($ticket->status === 'done' && is_null($ticket->completed_at)) {
                $ticket->completed_at = now();
            } elseif ($ticket->status !== 'done' && !is_null($ticket->completed_at)) {
                $ticket->completed_at = null;
            }
        }
    }

    /**
     * Handle the Ticket "updated" event.
     */
    public function updated(Ticket $ticket): void
    {
        $changes = $ticket->getDirty();
        $skipFields = ['updated_at', 'completed_at'];

        foreach ($changes as $key => $newValue) {
            if (!in_array($key, $skipFields)) {
                $oldValue = $ticket->getOriginal($key);

                if ((string)$oldValue !== (string)$newValue) {
                    TicketHistory::create([
                        'ticket_id' => $ticket->id,
                        'action' => 'Updated: ' . ucfirst(str_replace('_', ' ', $key)),
                        'old_value' => (string)$oldValue,
                        'new_value' => (string)$newValue,
                    ]);
                }
            }
        }
    }

    /**
     * Handle the Ticket "deleted" event.
     */
    public function deleted(Ticket $ticket): void
    {
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'action' => 'Ticket Deleted (Archived)',
            'old_value' => null,
            'new_value' => null,
        ]);
    }

    /**
     * Handle the Ticket "restored" event.
     */
    public function restored(Ticket $ticket): void
    {
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'action' => 'Ticket Restored',
            'old_value' => null,
            'new_value' => null,
        ]);
    }
}
