import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const columnConfig = {
    open: { label: 'Open', color: 'bg-[var(--accent-yellow-soft)] border-[var(--accent-yellow)] text-[var(--accent-yellow)]' },
    in_progress: { label: 'In Progress', color: 'bg-[var(--accent-purple-soft)] border-[var(--accent-purple)] text-[var(--accent-purple)]' },
    blocked: { label: 'Blocked', color: 'bg-[var(--bg-surface)] border-[var(--accent-red)] text-[var(--accent-red)]' },
    done: { label: 'Done', color: 'bg-[var(--accent-green-soft)] border-[var(--accent-green)] text-[var(--accent-green)]' },
};

export default function KanbanColumn({ id, title, tickets, onCardClick }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'Column',
            columnId: id,
        }
    });

    const config = columnConfig[id] || columnConfig['open'];

    return (
        <div className="flex flex-col bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-xl)] w-full sm:w-[320px] flex-shrink-0 h-full max-h-full overflow-hidden">
            <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded-[var(--radius-sm)] border text-[var(--text-tiny)] font-bold uppercase tracking-wider ${config.color}`}>
                        {title}
                    </div>
                    <span className="text-[var(--text-tiny)] font-medium text-[var(--text-tertiary)] bg-[var(--bg-base)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                        {tickets.length}
                    </span>
                </div>
            </div>

            <div 
                ref={setNodeRef}
                className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors ${isOver ? 'bg-[var(--bg-overlay)]' : ''}`}
            >
                <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tickets.map((ticket) => (
                        <KanbanCard key={ticket.id} ticket={ticket} onClick={onCardClick} />
                    ))}
                </SortableContext>
                
                {tickets.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-[var(--border-subtle)] rounded-[var(--radius-lg)] flex items-center justify-center text-[var(--text-caption)] text-[var(--text-tertiary)]">
                        Drop tickets here
                    </div>
                )}
            </div>
        </div>
    );
}
