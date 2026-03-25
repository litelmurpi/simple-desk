import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const columnConfig = {
    open: { label: 'Open', color: 'bg-(--accent-yellow-soft) border-(--accent-yellow)/30 text-(--accent-yellow)' },
    in_progress: { label: 'In Progress', color: 'bg-(--accent-purple-soft) border-(--accent-purple)/30 text-(--accent-purple)' },
    blocked: { label: 'Blocked', color: 'bg-destructive/10 border-destructive/30 text-destructive' },
    done: { label: 'Done', color: 'bg-(--accent-green-soft) border-(--accent-green)/30 text-(--accent-green)' },
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
        <div className={`flex flex-col bg-(--bg-raised) rounded-xl w-full sm:w-[320px] flex-shrink-0 h-full max-h-full overflow-hidden border transition-all duration-300 ${
            isOver
                ? 'border-(--accent-blue)/50 ring-1 ring-(--accent-blue)/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] -translate-y-0.5'
                : 'border-(--border-default) shadow-sm'
        }`}>
            <div className={`flex items-center justify-between p-3.5 border-b transition-colors duration-300 ${isOver ? 'border-(--accent-blue)/20' : 'border-(--border-subtle)'} bg-(--bg-raised) z-10 sticky top-0`}>
                <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded-sm border text-[11px] font-bold uppercase tracking-wider ${config.color}`}>
                        {title}
                    </div>
                    <span className="text-[11px] font-medium text-(--text-tertiary) bg-(--bg-subtle) px-2 py-0.5 rounded-full tabular-nums">
                        {tickets.length}
                    </span>
                </div>
            </div>

            <div 
                ref={setNodeRef}
                className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors duration-300 custom-scrollbar ${
                    isOver ? 'bg-(--accent-blue)/5' : 'bg-(--bg-base)'
                }`}
            >
                <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tickets.map((ticket) => (
                        <KanbanCard key={ticket.id} ticket={ticket} onClick={onCardClick} />
                    ))}
                </SortableContext>
                
                {tickets.length === 0 && (
                    <div className={`h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                        isOver
                            ? 'border-(--accent-blue)/50 text-(--accent-blue) bg-(--accent-blue-soft) scale-[1.02]'
                            : 'border-(--border-subtle) text-(--text-disabled)'
                    }`}>
                        <div className="text-xs font-medium tracking-wide">Drop ticket here</div>
                    </div>
                )}

                {/* Spacer at the bottom when isOver and has cards, making a visible drop target */}
                {tickets.length > 0 && isOver && (
                    <div className="h-20 border-2 border-dashed border-(--accent-blue)/40 rounded-lg bg-(--accent-blue-soft) transition-all duration-300" />
                )}
            </div>
        </div>
    );
}
