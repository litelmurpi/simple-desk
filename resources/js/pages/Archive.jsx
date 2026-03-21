import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityIndicator } from '@/components/tickets/PriorityIndicator';
import { Button } from '@/components/ui/button';
import { ArchiveRestore, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Archive({ tickets }) {
    const { post, delete: destroy, processing } = useForm();

    const handleRestore = (id) => {
        post(route('tickets.restore', id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Archive">
            <Head title="Archive" />

            <div className="mb-[var(--space-6)] flex justify-between items-end">
                <div>
                    <h1 className="text-[var(--text-display)] text-[var(--text-primary)] font-bold tracking-tight">Archive</h1>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)] mt-1">Archived tickets that are hidden from main views.</p>
                </div>
            </div>

            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-xl)] shadow-sm overflow-hidden animate-in fade-in duration-500">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
                                <th className="px-5 py-3 text-[var(--text-tiny)] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Ticket</th>
                                <th className="px-5 py-3 text-[var(--text-tiny)] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-[var(--text-tiny)] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Subject</th>
                                <th className="px-5 py-3 text-[var(--text-tiny)] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Archived Date</th>
                                <th className="px-5 py-3 text-[var(--text-tiny)] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-body)] text-[var(--text-primary)]">
                            {tickets.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-[var(--text-secondary)]">No archived tickets found.</td>
                                </tr>
                            ) : tickets.data.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-[var(--bg-subtle)] transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <PriorityIndicator priority={ticket.priority} />
                                            <div>
                                                <Link href={route('tickets.show', ticket.id)} className="font-medium hover:text-[var(--accent-blue)] transition-colors">
                                                    {ticket.title}
                                                </Link>
                                                <div className="text-[var(--text-tiny)] text-[var(--text-tertiary)] mt-0.5">{ticket.ticket_number}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <StatusBadge status={ticket.status} />
                                    </td>
                                    <td className="px-5 py-3">
                                        {ticket.subject ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[var(--text-tiny)] font-medium" style={{ backgroundColor: `${ticket.subject.color}15`, color: ticket.subject.color }}>
                                                {ticket.subject.name}
                                            </span>
                                        ) : <span className="text-[var(--text-tertiary)]">-</span>}
                                    </td>
                                    <td className="px-5 py-3 text-[var(--text-caption)] text-[var(--text-secondary)]">
                                        {format(new Date(ticket.updated_at), 'dd MMM yyyy, HH:mm')}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleRestore(ticket.id)}
                                            disabled={processing}
                                            className="text-[var(--text-secondary)] hover:text-[var(--accent-green)] hover:bg-[var(--accent-green-soft)] transition-colors opacity-0 group-hover:opacity-100"
                                            title="Restore from archive"
                                        >
                                            <ArchiveRestore className="w-4 h-4 mr-2" />
                                            Restore
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
