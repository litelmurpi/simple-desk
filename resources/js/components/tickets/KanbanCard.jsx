import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PriorityIndicator } from './PriorityIndicator';
import { MessageSquare, Paperclip, Clock } from 'lucide-react';
import dayjs from 'dayjs';

export default function KanbanCard({ ticket, onClick }) {
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
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const isOverdue = ticket.deadline_at && new Date(ticket.deadline_at) < new Date() && ticket.status !== 'done';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(ticket.id)}
            className="group relative bg-[var(--bg-raised)] border border-[var(--border-default)] hover:border-[var(--border-strong)] rounded-[var(--radius-lg)] p-3.5 cursor-grab active:cursor-grabbing shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200"
        >
            {/* Priority left accent bar */}
            {ticket.priority === 'urgent' && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[var(--accent-red)]" />
            )}
            {ticket.priority === 'high' && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[var(--accent-orange)]" />
            )}

            <div className="flex justify-between items-start mb-2">
                <span className="text-[var(--text-tiny)] font-mono text-[var(--text-tertiary)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                    {ticket.ticket_number}
                </span>
                <PriorityIndicator priority={ticket.priority} />
            </div>
            
            <h4 className="text-[var(--text-label)] text-[var(--text-primary)] font-medium mb-3 leading-snug line-clamp-2 group-hover:text-[var(--accent-blue)] transition-colors">
                {ticket.title}
            </h4>

            {ticket.subject && (
                <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ticket.subject.color }}></span>
                    <span className="text-[var(--text-tiny)] text-[var(--text-secondary)] font-medium truncate">
                        {ticket.subject.code || ticket.subject.name}
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between text-[var(--text-tiny)] text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-subtle)] mt-2">
                <div className="flex items-center gap-3">
                    {ticket.notes_count > 0 && (
                        <div className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> {ticket.notes_count}
                        </div>
                    )}
                    {ticket.attachments_count > 0 && (
                        <div className="flex items-center gap-1">
                            <Paperclip className="w-3.5 h-3.5" /> {ticket.attachments_count}
                        </div>
                    )}
                </div>

                {ticket.deadline_at && (
                    <div className={`flex items-center gap-1 ${isOverdue ? 'text-[var(--accent-red)] font-semibold' : ''}`}>
                        <Clock className="w-3.5 h-3.5" />
                        {dayjs(ticket.deadline_at).format('MMM D')}
                    </div>
                )}
            </div>
        </div>
    );
}
