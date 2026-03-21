import React from 'react';
import { Link } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from './StatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react'; // Needs lucide-react

export function TicketListItem({ ticket, isSelected, onSelect }) {
    // Format deadline
    const formatDeadline = (dateString, ticketStatus) => {
        if (!dateString) return null;
        if (ticketStatus === 'done' || ticketStatus === 'archived') {
            return <span className="text-[var(--text-tertiary)]">Closed</span>;
        }

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let colorClass = 'text-[var(--text-secondary)]';
        let text = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        
        if (diffDays < 0) {
            colorClass = 'text-[var(--accent-red)] font-semibold';
            text = 'Overdue';
        } else if (diffDays === 0) {
            colorClass = 'text-[var(--accent-orange)] font-semibold';
            text = 'Today';
        } else if (diffDays === 1) {
            colorClass = 'text-[var(--accent-yellow)]';
            text = 'Tomorrow';
        }

        return (
            <div className={cn("flex items-center gap-1.5 text-[var(--text-caption)] whitespace-nowrap", colorClass)}>
                <Clock className="w-3.5 h-3.5" />
                <span>{text}</span>
            </div>
        );
    };

    return (
        <div className={cn(
            "group flex items-center gap-[var(--space-4)] p-[var(--space-3)] border-b border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] transition-colors",
            isSelected && "bg-[var(--bg-subtle)]"
        )}>
            {/* Checkbox */}
            <div className="flex-shrink-0 flex items-center justify-center w-8">
                <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => onSelect(ticket.id)}
                    className="border-[var(--border-strong)] data-[state=checked]:bg-[var(--accent-blue)] data-[state=checked]:border-[var(--accent-blue)] transition-opacity opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100"
                />
            </div>

            {/* Primary content area */}
            <div className="flex-1 min-w-0 grid grid-cols-12 gap-[var(--space-4)] items-center">
                
                {/* ID & Title */}
                <div className="col-span-12 md:col-span-6 lg:col-span-5 flex items-center gap-[var(--space-3)] overflow-hidden">
                    <PriorityIndicator priority={ticket.priority} showLabel={false} />
                    
                    <div className="flex flex-col min-w-0">
                        <Link href={route('tickets.show', ticket.id)} className="flex items-center gap-2">
                            <span className="text-[var(--text-caption)] text-[var(--text-tertiary)] font-mono whitespace-nowrap">
                                {ticket.ticket_number}
                            </span>
                            <span className="text-[var(--text-body)] font-medium text-[var(--text-primary)] truncate hover:text-[var(--accent-blue)] transition-colors">
                                {ticket.title}
                            </span>
                        </Link>
                        {ticket.subject && (
                            <div className="flex items-center mt-0.5">
                                <span className="text-[var(--text-tiny)] text-[var(--text-secondary)] bg-[var(--bg-raised)] border border-[var(--border-default)] px-1.5 py-0.5 rounded-[var(--radius-sm)] flex items-center gap-1.5 truncate">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ticket.subject.color }}></span>
                                    {ticket.subject.code || ticket.subject.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className="hidden md:flex col-span-3 lg:col-span-2 flex-col items-start gap-1">
                    <StatusBadge status={ticket.status} />
                    {ticket.updated_at && (
                        <span className="text-[var(--text-tiny)] text-[var(--text-tertiary)] italic">
                            {new Date(ticket.updated_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>

                {/* Deadline */}
                <div className="hidden lg:flex col-span-2 items-center">
                    {formatDeadline(ticket.deadline_at, ticket.status)}
                </div>

                {/* Tags */}
                <div className="hidden md:flex col-span-3 items-center gap-1 overflow-x-hidden">
                    {ticket.tags && ticket.tags.slice(0, 3).map(tag => (
                        <span key={tag.id} className="inline-flex items-center px-1.5 py-0.5 rounded-[var(--radius-sm)] text-[var(--text-tiny)] font-medium border border-[var(--border-default)] bg-[var(--bg-raised)] text-[var(--text-secondary)] whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 font-mono" style={{ backgroundColor: tag.color }}></span>
                            {tag.name}
                        </span>
                    ))}
                    {ticket.tags && ticket.tags.length > 3 && (
                        <span className="text-[var(--text-tiny)] text-[var(--text-tertiary)]">+{ticket.tags.length - 3}</span>
                    )}
                </div>

            </div>
        </div>
    );
}
