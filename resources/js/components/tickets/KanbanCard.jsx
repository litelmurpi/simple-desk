import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PriorityIndicator } from './PriorityIndicator';
import { MessageSquare, Paperclip, Clock, Pin } from 'lucide-react';
import dayjs from 'dayjs';

export default function KanbanCard({ ticket, onClick, isDragOverlay = false }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: ticket.id,
        data: {
            type: 'Ticket',
            ticket,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform',
        opacity: isDragging ? 0 : 1,
        visibility: isDragging ? 'hidden' : 'visible',
    };

    const isOverdue = ticket.deadline_at && new Date(ticket.deadline_at) < new Date() && ticket.status !== 'done';

    const cardClasses = isDragOverlay
        ? 'relative bg-[var(--bg-raised)] border border-[var(--border-strong)] rounded-[var(--radius-lg)] p-3.5 cursor-grabbing shadow-lg ring-1 ring-[var(--border-strong)] z-50'
        : 'group relative bg-[var(--bg-raised)] border border-[var(--border-default)] hover:border-[var(--border-strong)] rounded-[var(--radius-lg)] p-3.5 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all duration-300';

    return (
        <div
            ref={isDragOverlay ? undefined : setNodeRef}
            style={isDragOverlay ? undefined : style}
            {...(isDragOverlay ? {} : attributes)}
            {...(isDragOverlay ? {} : listeners)}
            onClick={isDragOverlay ? undefined : () => onClick(ticket.id)}
            className={cardClasses}
        >
            {/* Priority left accent bar */}
            {ticket.priority && (
                <div className={`absolute left-0 top-3 bottom-3 rounded-r-md transition-all duration-300 group-hover:w-[4px] ${
                    ticket.priority === 'urgent' ? 'bg-[var(--accent-red)] w-[3px]' : 
                    ticket.priority === 'high' ? 'bg-[var(--accent-blue)] w-[3px]' :
                    ticket.priority === 'medium' ? 'bg-[var(--accent-yellow)] w-0 group-hover:w-[3px]' :
                    'bg-[var(--border-strong)] w-0 group-hover:w-[3px]'
                }`} />
            )}

            <div className="flex justify-between items-start mb-2.5">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                        {ticket.ticket_number}
                    </span>
                    {ticket.is_pinned && (
                        <div className="text-[var(--accent-blue)]" title="Pinned">
                            <Pin className="w-3.5 h-3.5 fill-current" />
                        </div>
                    )}
                </div>
                <PriorityIndicator priority={ticket.priority} />
            </div>
            
            <h4 className="text-sm text-[var(--text-primary)] font-medium mb-3 leading-snug line-clamp-2 group-hover:text-[var(--accent-blue)] transition-colors">
                {ticket.title}
            </h4>

            {ticket.subject && (
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ticket.subject.color }}></span>
                    <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate">
                        {ticket.subject.code || ticket.subject.name}
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-subtle)] mt-2">
                <div className="flex items-center gap-3">
                    {ticket.notes_count > 0 && (
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                            <MessageSquare className="w-3.5 h-3.5" /> <span className="font-mono">{ticket.notes_count}</span>
                        </div>
                    )}
                    {ticket.attachments_count > 0 && (
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                            <Paperclip className="w-3.5 h-3.5" /> <span className="font-mono">{ticket.attachments_count}</span>
                        </div>
                    )}
                </div>

                {ticket.deadline_at && (
                    <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-[var(--accent-red)] font-medium bg-[var(--accent-red-soft)] px-1.5 py-0.5 rounded-[var(--radius-sm)]' : ''}`}>
                        <Clock className="w-3.5 h-3.5" />
                        {dayjs(ticket.deadline_at).format('MMM D')}
                    </div>
                )}
            </div>
        </div>
    );
}
