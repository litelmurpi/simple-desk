import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const columnConfig = {
    open: { label: 'Open', color: 'bg-[var(--accent-yellow-soft)] border-[var(--accent-yellow)]/30 text-[var(--accent-yellow)]', borderColor: 'var(--accent-yellow)' },
    in_progress: { label: 'In Progress', color: 'bg-[var(--accent-purple-soft)] border-[var(--accent-purple)]/30 text-[var(--accent-purple)]', borderColor: 'var(--accent-purple)' },
    blocked: { label: 'Blocked', color: 'bg-destructive/10 border-destructive/30 text-destructive', borderColor: 'hsl(var(--destructive))' },
    done: { label: 'Done', color: 'bg-[var(--accent-green-soft)] border-[var(--accent-green)]/30 text-[var(--accent-green)]', borderColor: 'var(--accent-green)' },
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
        <div className={`flex flex-col bg[var(--bg-raised)] rounded-xl w-full sm:w-[320px] flex-shrink-0 h-full max-h-full overflow-hidden border transition-all duration-300 ${
            isOver
                ? 'border[var(--accent-blue)]/50 ring-1 ring[var(--accent-blue)]/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] -translate-y-0.5'
                : 'border[var(--border-default)] shadow-sm'
        }`}>
            <div className={`flex items-center justify-between p-3.5 border-b border-t-2 transition-colors duration-300 ${isOver ? 'border-b-[var(--accent-blue)]/20' : 'border-b-[var(--border-subtle)]'} bg-[var(--bg-raised)] z-10 sticky top-0`} style={{ borderTopColor: config.borderColor }}>
                <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded-sm border text-[11px] font-bold uppercase tracking-wider ${config.color}`}>
                        {title}
                    </div>
                    <span className="text-[11px] font-medium text[var(--text-tertiary)] bg[var(--bg-subtle)] px-2 py-0.5 rounded-full tabular-nums">
                        {tickets.length}
                    </span>
                </div>
            </div>

            <div 
                ref={setNodeRef}
                className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors duration-300 custom-scrollbar ${
                    isOver ? 'bg[var(--accent-blue)]/5' : 'bg[var(--bg-base)]'
                }`}
            >
                <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tickets.map((ticket) => (
                        <KanbanCard key={ticket.id} ticket={ticket} onClick={onCardClick} />
                    ))}
                </SortableContext>
                
                {tickets.length === 0 && (
                    <div className={`h-24 border-2 border-dashed rounded-[var(--radius-md)] flex flex-col items-center justify-center gap-2 transition-all duration-300 mt-2 ${
                        isOver
                            ? 'border-[var(--accent-blue)]/50 text-[var(--accent-blue)] bg-[var(--accent-blue-soft)] scale-[1.02]'
                            : 'border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--border-default)]'
                    }`}>
                        <div className="text-[12px] font-medium tracking-wide">Drop ticket here</div>
                    </div>
                )}

                {/* Spacer at the bottom when isOver and has cards, making a visible drop target */}
                {tickets.length > 0 && isOver && (
                    <div className="h-20 border-2 border-dashed border[var(--accent-blue)]/40 rounded-lg bg[var(--accent-blue-soft)] transition-all duration-300" />
                )}
            </div>
        </div>
    );
}
