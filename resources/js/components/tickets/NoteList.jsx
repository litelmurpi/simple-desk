import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '@/lib/utils';
import { Pen, Trash2, Clock, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NoteEditor from './NoteEditor';
import { router } from '@inertiajs/react';

dayjs.extend(relativeTime);

export default function NoteList({ notes, ticketId }) {
    const [editingId, setEditingId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpdate = (noteId, newBody) => {
        setIsProcessing(true);
        router.put(route('tickets.notes.update', { ticket: ticketId, ticket_note: noteId }), {
            body: newBody
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
            },
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleDelete = (noteId) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        
        setIsProcessing(true);
        router.delete(route('tickets.notes.destroy', { ticket: ticketId, ticket_note: noteId }), {
            preserveScroll: true,
            onFinish: () => setIsProcessing(false)
        });
    };

    if (!notes || notes.length === 0) {
        return (
            <div className="py-8 text-center text-[var(--text-secondary)] border border-dashed border-[var(--border-default)] rounded-[var(--radius-lg)] bg-[var(--bg-base)]">
                <p>No notes have been added yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {notes.map((note) => (
                <div key={note.id} className="relative pl-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-[var(--border-default)] last:before:bg-transparent">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-default)] flex items-center justify-center z-10 transition-colors group-hover:border-[var(--accent-blue)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                    </div>

                    <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden transition-all hover:border-[var(--border-strong)]">
                        {editingId === note.id ? (
                            <div className="p-1">
                                <NoteEditor 
                                    initialValue={note.body}
                                    onSubmit={(body) => handleUpdate(note.id, body)}
                                    onCancel={() => setEditingId(null)}
                                    isSubmitting={isProcessing}
                                />
                            </div>
                        ) : (
                            <>
                                {/* Note Header */}
                                <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-overlay)]">
                                    <div className="flex items-center gap-2 text-[var(--text-caption)] text-[var(--text-secondary)]">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Added {dayjs(note.created_at).fromNow()}</span>
                                        {note.versions && note.versions.length > 1 && (
                                            <span className="flex items-center gap-1 text-[var(--text-tertiary)] ml-2" title={`${note.versions.length} versions`}>
                                                <History className="w-3.5 h-3.5" /> Edited
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity [&:hover]:opacity-100" style={{opacity: 1}}>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setEditingId(note.id)}
                                            className="h-7 w-7 p-0 text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
                                        >
                                            <Pen className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDelete(note.id)}
                                            className="h-7 w-7 p-0 text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)]"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Note Body (Markdown) */}
                                <div className="p-4 text-[var(--text-body)] text-[var(--text-primary)] prose prose-invert prose-blue max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {note.body}
                                    </ReactMarkdown>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
