import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { Plus } from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from '@/components/tickets/KanbanColumn';
import KanbanCard from '@/components/tickets/KanbanCard';
import { QuickAddRow } from '@/components/tickets/QuickAddRow';
import { Button } from '@/components/ui/button';

const COLUMNS = [
    { id: 'open', title: 'Open' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'blocked', title: 'Blocked' },
    { id: 'done', title: 'Done' }
];

export default function Board({ tickets: initialTickets, subjects }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [activeId, setActiveId] = useState(null);
    const [isQuickAddVisible, setIsQuickAddVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
            
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                setIsQuickAddVisible(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        setTickets(initialTickets);
    }, [initialTickets]);

    const getTicketsByStatus = (status) => {
        return tickets.filter(t => t.status === status);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
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

        const activeContainer = tickets.find(t => t.id === activeId)?.status;
        
        let overContainer = over.data.current?.type === 'Column'
            ? over.data.current.columnId
            : tickets.find(t => t.id === overId)?.status;

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

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
        
        const originalTicket = initialTickets.find(t => t.id === activeId);
        if (originalTicket && originalTicket.status !== overContainer) {
            router.patch(route('tickets.status.update', activeId), {
                status: overContainer
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {},
                onError: () => {
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

            <div className="max-w-full h-[calc(100vh-80px)] flex flex-col pt-8">
                <div className="mb-[var(--space-6)] px-[var(--space-6)] lg:px-[var(--space-8)] shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-[var(--space-4)]">
                    <div>
                        <h1 className="page-title">Board</h1>
                        <p className="page-subtitle">
                            Manage project workflow and tracking.
                        </p>
                    </div>
                    <div className="flex gap-[var(--space-3)]">
                        <Button 
                            onClick={() => setIsQuickAddVisible(!isQuickAddVisible)}
                            className="bg-[var(--accent-blue)] text-white hover:opacity-90 transition-colors shadow-sm font-medium"
                        >
                            Quick Add (N)
                        </Button>
                        <Link href={route('tickets.create')} className="inline-flex items-center justify-center whitespace-nowrap text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] disabled:pointer-events-none disabled:opacity-50 border border-[var(--border-default)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] h-10 px-4 py-2 rounded-[var(--radius-md)]">
                            <Plus className="w-4 h-4 mr-2" /> Full Form
                        </Link>
                    </div>
                </div>

                <div className="px-[var(--space-6)] lg:px-[var(--space-8)] mb-[var(--space-6)]">
                    <QuickAddRow
                        isVisible={isQuickAddVisible}
                        onClose={() => setIsQuickAddVisible(false)}
                    />
                </div>

                <div className="flex-1 overflow-x-auto pb-6 px-[var(--space-6)] lg:px-[var(--space-8)] custom-scrollbar">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex w-fit gap-6 h-full items-start">
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

                        <DragOverlay
                            dropAnimation={{
                                duration: 250,
                                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                            }}
                        >
                            {activeTicket ? (
                                <div
                                    className="w-[320px] cursor-grabbing"
                                    style={{
                                        transform: 'rotate(3deg) scale(1.05)',
                                        boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5), 0 0 0 1px var(--border-strong)',
                                        borderRadius: 'var(--radius-lg)',
                                        opacity: 0.95,
                                    }}
                                >
                                    <KanbanCard ticket={activeTicket} onClick={() => {}} isDragOverlay />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </AppLayout>
    );
}
