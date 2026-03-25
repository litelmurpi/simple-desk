import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityIndicator } from '@/components/tickets/PriorityIndicator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Clock, Copy, Trash2, CalendarDays, MessageSquare, Paperclip, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoteEditor from '@/components/tickets/NoteEditor';
import NoteList from '@/components/tickets/NoteList';
import AttachmentUploader from '@/components/tickets/AttachmentUploader';
import AttachmentList from '@/components/tickets/AttachmentList';
import DeleteTicketModal from '@/components/tickets/DeleteTicketModal';

export default function Show({ ticket }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const isClosed = ticket.status === 'done' || ticket.status === 'archived';

    const handleDuplicate = () => {
        router.post(route('tickets.duplicate', ticket.id));
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const formatDate = (dateString, withTime = false) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', month: 'short', year: 'numeric',
            ...(withTime && { hour: '2-digit', minute: '2-digit' })
        });
    };

    return (
        <AppLayout title={`${ticket.ticket_number} - ${ticket.title}`}>
            <Head title={ticket.ticket_number} />

            <DeleteTicketModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                ticket={ticket} 
            />

            <div className="max-w-4xl mx-auto space-y-[var(--space-6)]">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-[var(--space-4)]">
                    <div className="flex items-start gap-[var(--space-4)]">
                        <Link 
                            href={route('tickets.index')} 
                            className="p-2 -ml-2 mt-1 flex-shrink-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        
                        <div>
                            <div className="flex items-center gap-3 mb-2 animate-in fade-in">
                                <span className="text-[var(--text-caption)] text-[var(--text-tertiary)] font-mono tracking-wider">{ticket.ticket_number}</span>
                                <StatusBadge status={ticket.status} />
                                {ticket.is_archived && <StatusBadge status="archived" />}
                            </div>
                            <h1 className={cn("text-[var(--text-display)] text-[var(--text-primary)] leading-tight mb-2", isClosed && "line-through text-[var(--text-secondary)]")}>
                                {ticket.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-[var(--text-caption)] text-[var(--text-secondary)]">
                                <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] px-2 py-1 border border-[var(--border-default)] rounded-[var(--radius-sm)]">
                                    <span className="text-[var(--text-tertiary)]">Type:</span> 
                                    <span className="font-medium capitalize">{ticket.type}</span>
                                </div>
                                
                                {ticket.subject && (
                                    <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] px-2 py-1 border border-[var(--border-default)] rounded-[var(--radius-sm)]">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ticket.subject.color }}></span>
                                        <span className="font-medium">{ticket.subject.code || ticket.subject.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-[var(--space-2)] pl-12 md:pl-0">
                        <Button variant="ghost" size="sm" onClick={handleDuplicate} className="text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]" title="Duplicate Ticket">
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Link href={route('tickets.edit', ticket.id)}>
                            <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] hover:text-[var(--accent-orange)] hover:bg-[var(--accent-orange-soft)]">
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)]">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-6)] items-start">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-[var(--space-6)]">
                        {/* Description block (Markdown support planned for Phase 5) */}
                        <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] shadow-sm overflow-hidden">
                            <div className="px-[var(--space-5)] py-[var(--space-4)] border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex justify-between items-center">
                                <h3 className="text-[var(--text-heading)] text-[var(--text-primary)] font-semibold">Description</h3>
                            </div>
                            <div className="p-[var(--space-5)] text-[var(--text-body)] text-[var(--text-secondary)] leading-relaxed min-h-[120px] whitespace-pre-wrap">
                                {ticket.description || <span className="text-[var(--text-tertiary)] italic">No description provided.</span>}
                            </div>
                        </div>

                        {/* Tabs content: Notes, Attachments, History */}
                        <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-[var(--space-2)] sm:p-[var(--space-5)]">
                            <Tabs defaultValue="notes" className="w-full">
                                <TabsList className="bg-[var(--bg-surface)] w-full justify-start overflow-x-auto border-b border-[var(--border-default)] rounded-none px-0 h-auto pb-0">
                                    <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--accent-orange)] data-[state=active]:text-[var(--accent-orange)] rounded-none px-4 py-2 text-[var(--text-secondary)]">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Notes
                                    </TabsTrigger>
                                    <TabsTrigger value="attachments" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--accent-orange)] data-[state=active]:text-[var(--accent-orange)] rounded-none px-4 py-2 text-[var(--text-secondary)]">
                                        <Paperclip className="w-4 h-4 mr-2" />
                                        Attachments
                                        {ticket.attachments?.length > 0 && (
                                            <span className="ml-2 bg-[var(--bg-raised)] border border-[var(--border-default)] text-[var(--text-primary)] text-[var(--text-tiny)] py-0.5 px-1.5 rounded-full">
                                                {ticket.attachments.length}
                                            </span>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--accent-orange)] data-[state=active]:text-[var(--accent-orange)] rounded-none px-4 py-2 text-[var(--text-secondary)]">
                                        <History className="w-4 h-4 mr-2" />
                                        History
                                    </TabsTrigger>
                                </TabsList>
                                
                                <div className="mt-[var(--space-6)]">
                                    <TabsContent value="notes" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <NoteList notes={ticket.notes} ticketId={ticket.id} />
                                        
                                        {!isClosed && (
                                            <div className="pt-4 border-t border-[var(--border-subtle)]">
                                                <h4 className="text-[var(--text-label)] font-medium text-[var(--text-primary)] mb-3">Add a Note</h4>
                                                <NoteEditor 
                                                    initialValue=""
                                                    onSubmit={(body) => {
                                                        router.post(route('tickets.notes.store', ticket.id), { body }, { preserveScroll: true });
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="attachments" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {!isClosed && (
                                            <div className="mb-6">
                                                <AttachmentUploader ticketId={ticket.id} />
                                            </div>
                                        )}
                                        <AttachmentList attachments={ticket.attachments} ticketId={ticket.id} />
                                    </TabsContent>

                                    <TabsContent value="history" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-[var(--space-4)] relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--border-subtle)] pl-6 md:pl-0 mt-4">
                                            {ticket.histories && ticket.histories.map(history => (
                                                <div key={history.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                    <div className="flex items-center justify-center w-4 h-4 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] absolute left-[-24px] md:left-1/2 md:-translate-x-1/2 mt-1.5 md:mt-0 shadow-sm"></div>
                                                    <div className="w-[calc(100%-1rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-raised)] shadow-sm hover:border-[var(--border-default)] transition-colors">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-semibold text-[var(--text-caption)] text-[var(--text-primary)]">{history.action}</span>
                                                            <time className="text-[var(--text-tiny)] text-[var(--text-tertiary)]">{formatDate(history.created_at, true)}</time>
                                                        </div>
                                                        {history.new_value && (
                                                            <div className="text-[var(--text-tiny)] text-[var(--text-secondary)] mt-1 break-words">
                                                                {history.old_value && <span><span className="line-through opacity-70">{history.old_value}</span> &rarr; </span>}
                                                                {history.new_value}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {ticket.histories?.length === 0 && <p className="text-[var(--text-caption)] text-[var(--text-tertiary)] text-center py-6">No activity recorded yet.</p>}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-[var(--space-4)]">
                        <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-[var(--space-4)] shadow-sm space-y-[var(--space-4)]">
                            <div>
                                <h4 className="text-[var(--text-tiny)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Priority</h4>
                                <PriorityIndicator priority={ticket.priority} showLabel={true} />
                            </div>

                            <div>
                                <h4 className="text-[var(--text-tiny)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <CalendarDays className="w-3.5 h-3.5" /> Deadline
                                </h4>
                                {ticket.deadline_at ? (
                                    <span className={cn("text-[var(--text-label)]", new Date(ticket.deadline_at) < new Date() && !isClosed ? "text-[var(--accent-red)] font-semibold" : "text-[var(--text-primary)]")}>
                                        {formatDate(ticket.deadline_at)}
                                    </span>
                                ) : (
                                    <span className="text-[var(--text-caption)] text-[var(--text-tertiary)]">No deadline set</span>
                                )}
                            </div>

                            <div>
                                <h4 className="text-[var(--text-tiny)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Labels</h4>
                                <div className="flex flex-wrap gap-2">
                                    {ticket.tags && ticket.tags.length > 0 ? ticket.tags.map(tag => (
                                        <span key={tag.id} className="inline-flex items-center px-1.5 py-0.5 rounded-[var(--radius-sm)] text-[var(--text-caption)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)]">
                                            <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: tag.color }}></span>
                                            {tag.name}
                                        </span>
                                    )) : (
                                        <span className="text-[var(--text-caption)] text-[var(--text-tertiary)]">No labels</span>
                                    )}
                                </div>
                            </div>

                            <hr className="border-[var(--border-subtle)]" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-[var(--text-tiny)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Created</h4>
                                    <span className="text-[var(--text-caption)] text-[var(--text-secondary)]">{formatDate(ticket.created_at, true)}</span>
                                </div>
                                <div>
                                    <h4 className="text-[var(--text-tiny)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Updated</h4>
                                    <span className="text-[var(--text-caption)] text-[var(--text-secondary)]">{formatDate(ticket.updated_at, true)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
