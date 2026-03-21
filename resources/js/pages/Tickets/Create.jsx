import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { TicketForm } from '@/components/tickets/TicketForm';
import { ArrowLeft } from 'lucide-react';

export default function Create({ subjects, tags }) {
    return (
        <AppLayout title="Create New Ticket">
            <Head title="Create Ticket" />

            <div className="max-w-3xl mx-auto space-y-[var(--space-6)]">
                <div className="flex items-center gap-[var(--space-4)]">
                    <Link 
                        href={route('tickets.index')} 
                        className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[var(--text-display)] text-[var(--text-primary)]">Create Ticket</h1>
                        <p className="text-[var(--text-body)] text-[var(--text-secondary)]">
                            Fill out the details below to open a new task or issue.
                        </p>
                    </div>
                </div>

                <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-6)] md:p-[var(--space-8)] shadow-sm">
                    <TicketForm subjects={subjects} tags={tags} />
                </div>
            </div>
        </AppLayout>
    );
}
