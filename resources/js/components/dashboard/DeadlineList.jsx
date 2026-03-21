import React from 'react';
import { Link } from '@inertiajs/react';
import { CalendarDays, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityIndicator } from '@/components/tickets/PriorityIndicator';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(isToday);
dayjs.extend(relativeTime);

export default function DeadlineList({ today, thisWeek }) {
    const hasTickets = today.length > 0 || thisWeek.length > 0;

    if (!hasTickets) {
        return (
            <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-6)] text-center shadow-sm h-full flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-green-500/10 text-[var(--accent-green)] rounded-full flex items-center justify-center mb-4">
                    <CalendarDays className="w-6 h-6" />
                </div>
                <h3 className="text-[var(--text-label)] font-semibold text-[var(--text-primary)] mb-1">You're all caught up!</h3>
                <p className="text-[var(--text-caption)] text-[var(--text-tertiary)] max-w-[250px]">
                    No immediate deadlines for today or the rest of the week.
                </p>
            </div>
        );
    }

    const TicketRow = ({ ticket, isUrgent }) => (
        <Link 
            href={route('tickets.show', ticket.id)}
            className="group block p-[var(--space-3)] rounded-[var(--radius-lg)] hover:bg-[var(--bg-surface)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
        >
            <div className="flex items-start gap-3">
                <div className="mt-1">
                    <PriorityIndicator priority={ticket.priority} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[var(--text-tiny)] font-mono text-[var(--text-tertiary)]">{ticket.ticket_number}</span>
                        <h4 className="text-[var(--text-label)] text-[var(--text-primary)] font-medium truncate group-hover:text-[var(--accent-blue)] transition-colors">
                            {ticket.title}
                        </h4>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[var(--text-tiny)] text-[var(--text-secondary)]">
                        <StatusBadge status={ticket.status} />
                        {ticket.subject && (
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ticket.subject.color }}></span>
                                <span>{ticket.subject.code || ticket.subject.name}</span>
                            </div>
                        )}
                        <span className="text-[var(--text-tertiary)]">•</span>
                        <span className={cn("font-medium", isUrgent ? "text-[var(--accent-red)]" : "text-[var(--text-secondary)]")}>
                            {isUrgent ? 'Due Today' : `Due ${dayjs(ticket.deadline_at).format('ddd, MMM D')}`}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] flex flex-col h-full shadow-sm overflow-hidden">
            <div className="px-[var(--space-5)] py-[var(--space-4)] border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex justify-between items-center">
                <h3 className="text-[var(--text-heading)] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[var(--accent-blue)]" />
                    Upcoming Deadlines
                </h3>
            </div>
            
            <div className="p-2 flex-1 overflow-y-auto">
                {today.length > 0 && (
                    <div className="mb-4">
                        <div className="px-3 py-2 flex items-center gap-2 text-[var(--text-tiny)] font-semibold text-[var(--accent-red)] uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5" /> Due Today
                        </div>
                        <div className="space-y-1">
                            {today.map(ticket => <TicketRow key={ticket.id} ticket={ticket} isUrgent={true} />)}
                        </div>
                    </div>
                )}

                {thisWeek.length > 0 && (
                    <div>
                        <div className="px-3 py-2 text-[var(--text-tiny)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                            Later This Week
                        </div>
                        <div className="space-y-1">
                            {thisWeek.map(ticket => <TicketRow key={ticket.id} ticket={ticket} isUrgent={false} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
