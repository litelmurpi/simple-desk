import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { TicketListItem } from '@/components/tickets/TicketListItem';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Show({ subject, tickets }) {
    
    // Check if there's any active tickets in this subject
    const activeTickets = tickets.filter(t => t.status !== 'done' && !t.is_archived);
    const doneTickets = tickets.filter(t => t.status === 'done' && !t.is_archived);
    
    return (
        <AppLayout title={subject.name}>
            <Head title={subject.name} />

            <div className="flex flex-col space-y-[var(--space-6)]">
                {/* Header */}
                <div className="flex flex-col gap-[var(--space-4)]">
                    <div>
                        <Link href={route('subjects.index')} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] inline-flex items-center gap-1 text-[var(--text-caption)] mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Subjects
                        </Link>
                        <div className="flex items-center gap-[var(--space-3)] mb-1">
                            <div className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--caption)] font-bold text-white shadow-sm" style={{ backgroundColor: subject.color }}>
                                {subject.code ? subject.code.substring(0, 2) : 'S'}
                            </div>
                            <h1 className="text-[var(--text-display)] text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                                {subject.name}
                                {!subject.is_active && (
                                    <span className="text-[var(--text-tiny)] bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] px-2 py-0.5 rounded-[var(--radius-sm)] flex items-center font-normal tracking-normal uppercase">
                                        Archived
                                    </span>
                                )}
                            </h1>
                        </div>
                        {subject.code && (
                            <p className="text-[var(--text-body)] text-[var(--text-secondary)]">
                                {subject.code} • Semester {subject.semester}
                            </p>
                        )}
                    </div>
                </div>

                {/* Progress Overview Section */}
                <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-5)] shadow-sm">
                    <div className="flex justify-between items-end text-[var(--text-body)] mb-2">
                        <span className="text-[var(--text-secondary)] font-medium">Task Completion</span>
                        <span className={cn("font-bold", subject.progress === 100 ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]")}>
                            {subject.progress}%
                        </span>
                    </div>
                    
                    <div className="h-3 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden mb-2">
                        <div 
                            className={cn("h-full transition-all duration-500", subject.progress === 100 ? "bg-[var(--accent-green)]" : "bg-[var(--accent-orange)]")} 
                            style={{ width: `${subject.progress}%` }} 
                        />
                    </div>
                    
                    <div className="flex justify-between text-[var(--text-caption)] text-[var(--text-tertiary)]">
                        <span>{subject.done_tickets_count} tickets completed</span>
                        <span>{subject.tickets_count - subject.done_tickets_count} tickets pending</span>
                    </div>
                </div>

                <div className="flex justify-between items-end border-b border-[var(--border-default)] pb-2 mb-4">
                    <h2 className="text-[var(--text-title)] font-semibold text-[var(--text-primary)]">
                        Tickets
                    </h2>
                    <Link href={route('tickets.create', { subject_id: subject.id })}>
                        <Button className="bg-[var(--accent-orange)] text-white hover:opacity-90 h-8 text-[var(--text-caption)]">
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Ticket
                        </Button>
                    </Link>
                </div>

                {/* Ticket Lists */}
                {tickets.length === 0 ? (
                    <div className="text-center py-12 border border-[var(--border-dashed)] rounded-[var(--radius-xl)] bg-[var(--bg-raised)]/50">
                        <p className="text-[var(--text-secondary)] mb-4">No tickets have been created for this subject yet.</p>
                        <Link href={route('tickets.create', { subject_id: subject.id })}>
                            <Button variant="outline" className="bg-[var(--bg-base)] border-[var(--border-strong)]">
                                Add First Ticket
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-[var(--space-8)]">
                        {activeTickets.length > 0 && (
                            <div>
                                <h3 className="text-[var(--text-heading)] font-medium text-[var(--text-primary)] mb-[var(--space-3)]">Active</h3>
                                <div className="space-y-0 border-t border-[var(--border-default)]">
                                    {activeTickets.map(ticket => (
                                        <div key={ticket.id} className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-subtle)] transition-colors">
                                            <TicketListItem 
                                                ticket={ticket} 
                                                isSelected={false}
                                                onToggleSelect={() => {}}
                                                // Omit subject chip inside the subject view for cleaner UI
                                                hideSubject={true} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {doneTickets.length > 0 && (
                            <div className="opacity-80">
                                <h3 className="text-[var(--text-heading)] font-medium text-[var(--text-tertiary)] mb-[var(--space-3)]">Completed</h3>
                                <div className="space-y-0 border-t border-[var(--border-default)] group-hover:opacity-100">
                                    {doneTickets.map(ticket => (
                                        <div key={ticket.id} className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-subtle)] transition-colors">
                                            <TicketListItem 
                                                ticket={ticket} 
                                                isSelected={false}
                                                onToggleSelect={() => {}}
                                                hideSubject={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
