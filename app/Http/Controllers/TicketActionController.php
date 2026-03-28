<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class TicketActionController extends Controller
{
    /**
     * Duplicate a ticket.
     */
    public function duplicate(Request $request, Ticket $ticket)
    {
        $newTicket = $ticket->replicate();
        
        // Setup new duplicated generic content
        $newTicket->ticket_number = null; // Let observer/boot method generate a new one
        $newTicket->title = $ticket->title . ' (Copy)';
        $newTicket->status = 'open';
        $newTicket->completed_at = null;
        $newTicket->push();

        // Copy relations
        if ($ticket->tags->count() > 0) {
            $newTicket->tags()->sync($ticket->tags->pluck('id'));
        }

        return back()->with('success', 'Ticket duplicated successfully.');
    }

    /**
     * Inline update status.
     */
    public function updateStatus(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,blocked,done,archived',
        ]);

        $ticket->update(['status' => $request->status]);

        return back()->with('success', 'Ticket status updated.');
    }

    /**
     * Inline update priority.
     */
    public function updatePriority(Request $request, Ticket $ticket)
    {
        $request->validate([
            'priority' => 'required|in:urgent,high,medium,low',
        ]);

        $ticket->update(['priority' => $request->priority]);

        return back()->with('success', 'Ticket priority updated.');
    }

    /**
     * Toggle archive status.
     */
    public function archive(Ticket $ticket)
    {
        $ticket->update(['is_archived' => !$ticket->is_archived]);

        $status = $ticket->is_archived ? 'archived' : 'unarchived';
        return back()->with('success', "Ticket {$status}.");
    }

    /**
     * Restore soft deleted ticket.
     */
    public function restore($id)
    {
        $ticket = Ticket::withTrashed()->findOrFail($id);
        $ticket->restore();

        return back()->with('success', 'Ticket restored.');
    }

    /**
     * Bulk update generic fields (status, priority, subject).
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ticket_ids' => 'required|array',
            'ticket_ids.*' => 'exists:tickets,id',
            'status' => 'nullable|in:open,in_progress,blocked,done,archived',
            'priority' => 'nullable|in:urgent,high,medium,low',
            'subject_id' => 'nullable|exists:subjects,id',
        ]);

        $updateData = [];
        if ($request->filled('status')) $updateData['status'] = $request->status;
        if ($request->filled('priority')) $updateData['priority'] = $request->priority;
        if ($request->filled('subject_id')) $updateData['subject_id'] = $request->subject_id;

        if (empty($updateData)) {
            return back()->with('error', 'No update fields provided.');
        }

        // Iterate so TicketObserver tracks the bulk edits and sets completed_at if needed
        foreach (Ticket::whereIn('id', $request->ticket_ids)->get() as $ticket) {
            $ticket->update($updateData); 
        }

        return back()->with('success', count($request->ticket_ids) . ' tickets updated.');
    }

    /**
     * Bulk delete tickets.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ticket_ids' => 'required|array',
            'ticket_ids.*' => 'exists:tickets,id',
        ]);

        Ticket::whereIn('id', $request->ticket_ids)->delete();

        return back()->with('success', count($request->ticket_ids) . ' tickets deleted.');
    }

    /**
     * Toggle pinned status.
     */
    public function togglePin(Ticket $ticket): RedirectResponse
    {
        $ticket->update([
            'is_pinned' => !$ticket->is_pinned,
            'pinned_at' => !$ticket->is_pinned ? now() : null,
        ]);

        return back()->with('success', 'Ticket pin status updated.');
    }

    public function logTime(Request $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validate([
            'minutes' => ['required', 'integer', 'min:1'],
        ]);

        $ticket->increment('time_spent_minutes', $validated['minutes']);

        return back()->with('success', 'Time logged successfully.');
    }
}
