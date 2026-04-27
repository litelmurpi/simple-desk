import React from 'react';
import { Link } from '@inertiajs/react';
import { CalendarDays, AlertCircle, PartyPopper } from 'lucide-react';
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
            <div className="card-elevated h-full flex flex-col items-center justify-center anim-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="empty-state max-w-sm text-center">
                    <div className="empty-state-icon bg-[var(--accent-green-soft)] mx-auto mb-4">
                        <PartyPopper className="w-6 h-6 text-[var(--accent-green)]" />
                    </div>
                    <p className="empty-state-title">You're all caught up!</p>
                    <p className="empty-state-description text-[var(--text-secondary)]">
                        No immediate deadlines for today or the rest of the week. Nice work.
                    </p>
                </div>
            </div>
        );
    }

    const TicketRow = ({ ticket, isUrgent }) => (
        <Link 
            href={route('tickets.show', ticket.id)}
            className={cn(
                "group block p-[var(--space-3)] rounded-[var(--radius-md)]",
                "transition-all duration-300 ease-out",
                "hover:bg-[var(--bg-surface)] hover:shadow-md hover:-translate-y-px"
            )}
        >
            <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                    <PriorityIndicator priority={ticket.priority} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono text-[var(--text-tertiary)] bg-[var(--bg-base)] px-1.5 py-0.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] transition-colors duration-200 group-hover:border-[var(--border-default)] group-hover:bg-[var(--bg-raised)]">
                            {ticket.ticket_number}
                        </span>
                        <h4 className="text-[13px] text-[var(--text-primary)] font-semibold truncate transition-colors duration-200 group-hover:text-[var(--accent-blue)]">
                            {ticket.title}
                        </h4>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-secondary)] font-medium">
                        <StatusBadge status={ticket.status} />
                        {ticket.subject && (
                            <div className="flex items-center gap-1.5 bg-[var(--bg-base)] px-1.5 py-0.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)]">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ticket.subject.color }}></span>
                                <span>{ticket.subject.code || ticket.subject.name}</span>
                            </div>
                        )}
                        <span className="text-[var(--border-strong)]">•</span>
                        <span className={cn(
                            "flex items-center gap-1",
                            isUrgent ? "text-[var(--accent-red)]" : "text-[var(--text-secondary)]"
                        )}>
                            {isUrgent && <AlertCircle className="w-3.5 h-3.5" />}
                            {isUrgent ? 'Due Today' : `Due ${dayjs(ticket.deadline_at).format('ddd, MMM D')}`}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="card-elevated flex flex-col h-full overflow-hidden anim-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="section-header flex justify-between items-center">
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[var(--accent-blue)]" />
                    Upcoming Deadlines
                </h3>
            </div>
            
            <div className="p-[var(--space-2)] flex-1 overflow-y-auto custom-scrollbar">
                {today.length > 0 && (
                    <div className="mb-4">
                        <div className="px-3 py-2 flex items-center gap-1.5 text-[11px] font-bold text-[var(--accent-red)] uppercase tracking-wider">
                            <span className="relative flex h-2 w-2 mr-0.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-red)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-red)]"></span>
                            </span>
                            <AlertCircle className="w-3.5 h-3.5" /> Due Today
                        </div>
                        <div className="space-y-1">
                            {today.map(ticket => <TicketRow key={ticket.id} ticket={ticket} isUrgent={true} />)}
                        </div>
                    </div>
                )}

                {thisWeek.length > 0 && (
                    <div>
                        <div className="px-3 py-2 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider relative flex items-center gap-3">
                            <span>Later This Week</span>
                            <div className="h-px flex-1 bg-[var(--border-subtle)]"></div>
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
