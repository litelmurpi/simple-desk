import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Pin } from 'lucide-react';
import { PriorityIndicator } from '@/components/tickets/PriorityIndicator';
import { cn } from '@/lib/utils';

export default function PinnedTickets({ tickets }) {
    if (!tickets || tickets.length === 0) return null;

    const handlePin = (e, ticketId) => {
        e.preventDefault();
        router.patch(route('tickets.pin', ticketId), {}, { preserveScroll: true });
    };

    return (
        <div className="bg-[var(--bg-raised)] border-none shadow-md overflow-hidden ring-1 ring-[#ffffff0d] relative rounded-xl">
            <div className="pb-3 pt-5 px-6">
                <div className="flex items-center gap-2">
                    <Pin className="w-5 h-5 text-[var(--accent-orange)] fill-[var(--accent-orange)]" />
                    <h3 className="text-[var(--text-title)] text-[var(--text-primary)] font-bold tracking-tight">
                        Pinned Tickets
                    </h3>
                </div>
            </div>
            <div className="px-6 pb-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="group relative flex flex-col gap-2 p-3 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--accent-orange)]/50 transition-colors">
                            <button 
                                onClick={(e) => handlePin(e, ticket.id)}
                                className="absolute right-3 top-3 p-1 rounded-md text-[var(--accent-blue)] opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-base)] transition-all"
                                title="Unpin ticket"
                            >
                                <Pin className="w-4 h-4 fill-current" />
                            </button>
                            
                            <div className="flex items-start gap-2 pr-6">
                                <div className="pt-0.5">
                                    <PriorityIndicator priority={ticket.priority} showLabel={false} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <Link href={route('tickets.show', ticket.id)} className="text-[14px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent-orange)] truncate transition-colors">
                                        {ticket.title}
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-auto pt-1">
                                {ticket.subject && (
                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] uppercase tracking-wider"
                                        style={{ backgroundColor: `${ticket.subject.color}15`, color: ticket.subject.color, border: `1px solid ${ticket.subject.color}30` }}>
                                        {ticket.subject.code || ticket.subject.name}
                                    </span>
                                )}
                                <span className="text-[12px] font-mono text-[var(--text-tertiary)]">
                                    {ticket.ticket_number}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
