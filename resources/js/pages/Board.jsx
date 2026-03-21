import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from '@/components/tickets/KanbanColumn';
import KanbanCard from '@/components/tickets/KanbanCard';

const COLUMNS = [
    { id: 'open', title: 'Open' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'blocked', title: 'Blocked' },
    { id: 'done', title: 'Done' }
];

export default function Board({ tickets: initialTickets, subjects }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [activeId, setActiveId] = useState(null);

    // Update local state if props change (e.g. after a full page nav or broadcast)
    useEffect(() => {
        setTickets(initialTickets);
    }, [initialTickets]);

    // Group tickets by status
    const getTicketsByStatus = (status) => {
        return tickets.filter(t => t.status === status);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px drag before activation, helps with clicking vs dragging
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Find items and their locations
        const activeContainer = tickets.find(t => t.id === activeId)?.status;
        
        let overContainer = over.data.current?.type === 'Column'
            ? over.data.current.columnId
            : tickets.find(t => t.id === overId)?.status;

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Optimistically move to new column locally during drag
        setTickets((prev) => {
            const activeIndex = prev.findIndex(t => t.id === activeId);
            const newTickets = [...prev];
            newTickets[activeIndex] = { ...newTickets[activeIndex], status: overContainer };
            return newTickets;
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        let overContainer = over.data.current?.type === 'Column'
            ? over.data.current.columnId
            : tickets.find(t => t.id === over.id)?.status;

        if (!overContainer) return;
        
        const draggedTicket = tickets.find(t => t.id === activeId);
        
        // If the ticket's final status is different from initial backend status, we persist it
        const originalTicket = initialTickets.find(t => t.id === activeId);
        if (originalTicket && originalTicket.status !== overContainer) {
            
            // Re-order sorting within column can be done here if we implement a custom sort_order integer column.
            // Right now we only update status.
            router.patch(route('tickets.status.update', activeId), {
                status: overContainer
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Update initial state cache if needed or rely on server props refresh
                },
                onError: () => {
                    // Revert on error
                    setTickets(initialTickets);
                }
            });
        }
    };

    const handleCardClick = (ticketId) => {
        router.visit(route('tickets.show', ticketId));
    };

    const activeTicket = activeId ? tickets.find(t => t.id === activeId) : null;

    return (
        <AppLayout title="Board">
            <Head title="Board" />

            <div className="max-w-full h-[calc(100vh-140px)] flex flex-col pt-4 anim-fade-in-up">
                <div className="mb-[var(--space-6)] px-[var(--space-6)] shrink-0">
                    <h1 className="page-title">Kanban Board</h1>
                    <p className="page-subtitle">
                        Drag and drop tickets to update their status.
                    </p>
                </div>

                <div className="flex-1 overflow-x-auto pb-6 px-[var(--space-6)] hide-scrollbar">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex w-fit gap-[var(--space-4)] h-full items-start stagger-children">
                            {COLUMNS.map(col => (
                                <KanbanColumn 
                                    key={col.id}
                                    id={col.id}
                                    title={col.title}
                                    tickets={getTicketsByStatus(col.id)}
                                    onCardClick={handleCardClick}
                                />
                            ))}
                        </div>

                        {/* Portal for rendering the item being dragged */}
                        <DragOverlay>
                            {activeTicket ? (
                                <div className="w-[290px] rotate-3 cursor-grabbing shadow-2xl opacity-80">
                                    <KanbanCard ticket={activeTicket} onClick={() => {}} />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </AppLayout>
    );
}
