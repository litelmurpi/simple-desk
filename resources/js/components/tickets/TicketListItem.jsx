import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from './StatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { cn } from '@/lib/utils';
import { Clock, Pin } from 'lucide-react';

export function TicketListItem({ ticket, isSelected, onSelect }) {
    const handlePin = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.patch(route('tickets.pin', ticket.id), {}, { preserveScroll: true });
    };

    // Format deadline
    const formatDeadline = (dateString, ticketStatus) => {
        if (!dateString) return null;
        if (ticketStatus === 'done' || ticketStatus === 'archived') {
            return <span className="text-(--text-tertiary)">Closed</span>;
        }

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let colorClass = 'text-(--text-secondary)';
        let text = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        
        if (diffDays < 0) {
            colorClass = 'text-(--accent-red) font-semibold';
            text = 'Overdue';
        } else if (diffDays === 0) {
            colorClass = 'text-(--accent-blue) font-semibold';
            text = 'Today';
        } else if (diffDays === 1) {
            colorClass = 'text-(--accent-yellow)';
            text = 'Tomorrow';
        }

        return (
            <div className={cn("flex items-center gap-1.5 text-[12px] whitespace-nowrap", colorClass)}>
                <Clock className="w-3.5 h-3.5" />
                <span>{text}</span>
            </div>
        );
    };

    return (
        <div className={cn(
            "group flex items-start gap-(--space-4) p-(--space-3) border-b border-(--border-subtle) transition-all duration-300 ease-out cursor-pointer relative",
            isSelected ? "bg-(--bg-subtle)" : "hover:bg-(--bg-subtle)"
        )}>
            {/* Left Selection Indicator (Subtle) */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-300 ease-out rounded-r-full",
                isSelected ? "bg-(--accent-blue)" : "bg-transparent group-hover:bg-(--accent-blue)/40"
            )} />

            {/* Checkbox */}
            <div className="shrink-0 flex items-center justify-center w-8 pt-0.5 pl-2">
                <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => onSelect(ticket.id)}
                    className="border-(--border-strong) data-[state=checked]:bg-(--accent-blue) data-[state=checked]:border-(--accent-blue) transition-all duration-200 opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100 scale-95 group-hover:scale-100 data-[state=checked]:scale-100"
                />
            </div>

            {/* Pin Toggle Button */}
            <button 
                onClick={handlePin}
                className={cn(
                    "absolute right-4 top-4 p-1.5 rounded-md transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-(--accent-blue)",
                    ticket.is_pinned 
                        ? "text-(--accent-blue) opacity-100" 
                        : "text-(--text-tertiary) opacity-0 group-hover:opacity-100 hover:text-(--text-secondary) hover:bg-(--bg-surface)"
                )}
                title={ticket.is_pinned ? "Unpin ticket" : "Pin ticket"}
            >
                <Pin className={cn("w-4 h-4", ticket.is_pinned && "fill-current")} />
            </button>

            {/* Primary content area */}
            <div className="flex-1 min-w-0 grid grid-cols-12 gap-(--space-4) items-start pt-0.5">
                
                {/* ID & Title */}
                <div className="col-span-12 md:col-span-6 lg:col-span-5 flex items-start gap-(--space-3) overflow-hidden pr-8">
                    <div className="pt-1">
                        <PriorityIndicator priority={ticket.priority} showLabel={false} />
                    </div>
                    
                    <div className="flex flex-col min-w-0 gap-1.5 pt-0.5">
                        <Link href={route('tickets.show', ticket.id)} className="flex items-center gap-2 group/link">
                            <span className="text-[12px] font-mono text-(--text-tertiary) whitespace-nowrap transition-colors duration-200 group-hover/link:text-(--text-secondary)">
                                {ticket.ticket_number}
                            </span>
                            <span className="text-[14px] font-semibold text-(--text-primary) truncate transition-colors duration-200 group-hover/link:text-(--accent-blue)">
                                {ticket.title}
                            </span>
                        </Link>
                        {ticket.subject && (
                            <div className="flex items-center">
                                <Link href={route('subjects.show', ticket.subject.id)}
                                    className="text-[var(--text-tiny)] font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] flex items-center transition-all duration-200 hover:opacity-80 uppercase tracking-widest"
                                    style={{ 
                                        backgroundColor: `${ticket.subject.color}15`, 
                                        color: ticket.subject.color,
                                        border: `1px solid ${ticket.subject.color}30` 
                                    }}>
                                    {ticket.subject.code || ticket.subject.name}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className="hidden md:flex col-span-3 lg:col-span-2 flex-col items-start gap-1.5 pt-0.5">
                    <StatusBadge status={ticket.status} />
                    {ticket.updated_at && (
                        <span className="text-[11px] text-(--text-tertiary)">
                            {new Date(ticket.updated_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>

                {/* Deadline */}
                <div className="hidden lg:flex col-span-2 items-start pt-1.5">
                    {formatDeadline(ticket.deadline_at, ticket.status)}
                </div>

                {/* Tags */}
                <div className="hidden md:flex col-span-3 items-start gap-1.5 overflow-x-hidden flex-wrap pt-0.5">
                    {ticket.tags && ticket.tags.slice(0, 3).map(tag => (
                        <span key={tag.id} 
                            className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[var(--text-tiny)] uppercase tracking-wider font-semibold whitespace-nowrap"
                            style={{ 
                                backgroundColor: `${tag.color}15`, 
                                color: tag.color,
                                border: `1px solid ${tag.color}30` 
                            }}>
                            {tag.name}
                        </span>
                    ))}
                    {ticket.tags && ticket.tags.length > 3 && (
                        <span className="text-[var(--text-tiny)] font-medium text-[var(--text-tertiary)] bg-[var(--bg-surface)] px-2 py-0.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)]">
                            +{ticket.tags.length - 3}
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
}
