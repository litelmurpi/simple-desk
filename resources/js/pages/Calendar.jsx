import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { PriorityIndicator } from '@/components/tickets/PriorityIndicator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TicketListItem } from '@/components/tickets/TicketListItem';

export default function Calendar({ tickets, currentYear, currentMonth }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Helpers for dates
    const dateObj = new Date(currentYear, currentMonth - 1, 1);
    const monthName = dateObj.toLocaleString('default', { month: 'long' });
    
    // Calculate calendar grid (starts Monday)
    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        let day = new Date(year, month - 1, 1).getDay();
        return day === 0 ? 6 : day - 1; // 0=Mon, 6=Sun
    };

    const navigateMonth = (direction) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;
        if (newMonth > 12) { newMonth = 1; newYear++; }
        if (newMonth < 1) { newMonth = 12; newYear--; }
        router.get(route('calendar', { year: newYear, month: newMonth }));
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const today = new Date();

    const grid = [];
    let numRows = Math.ceil((daysInMonth + firstDay) / 7);
    
    let dayCounter = 1;
    for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                row.push(null);
            } else if (dayCounter > daysInMonth) {
                row.push(null);
            } else {
                row.push(dayCounter++);
            }
        }
        grid.push(row);
    }

    // Group tickets by date
    const ticketsByDate = {};
    if (tickets) {
        tickets.forEach(ticket => {
            const d = new Date(ticket.deadline_at);
            // Only care if it belongs to current month/year being viewed
            if (d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth) {
                const day = d.getDate();
                if (!ticketsByDate[day]) ticketsByDate[day] = [];
                ticketsByDate[day].push(ticket);
            }
        });
    }

    const openPanel = (day) => {
        setSelectedDate(day);
        setIsPanelOpen(true);
    };

    const selectedTickets = selectedDate ? (ticketsByDate[selectedDate] || []) : [];

    return (
        <AppLayout title="Calendar">
            <Head title="Calendar" />

            <div className="flex h-[calc(100vh-8rem)] anim-fade-in-up">
                {/* Main Calendar Area */}
                <div className={cn(
                    "flex flex-col flex-1 min-w-0 transition-all duration-300",
                    isPanelOpen ? "mr-[var(--space-6)]" : ""
                )}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-[var(--space-6)]">
                        <div className="flex items-center gap-[var(--space-4)]">
                            <h1 className="page-title">
                                {monthName} <span className="text-[var(--text-tertiary)] font-normal">{currentYear}</span>
                            </h1>
                            <div className="flex items-center bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-md)] p-0.5 shadow-[var(--shadow-sm)]">
                                <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)} className="h-7 px-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)} className="h-7 px-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
                                onClick={() => router.get(route('calendar'))}
                            >
                                Today
                            </Button>
                        </div>
                        <Link href={route('tickets.create')}>
                            <Button className="bg-[var(--accent-orange)] text-white hover:opacity-90 shadow-sm transition-colors">
                                <Plus className="w-4 h-4 mr-2" /> New Issue
                            </Button>
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 card-elevated overflow-hidden flex flex-col">
                        {/* Days of week */}
                        <div className="grid grid-cols-7 border-b border-[var(--border-default)]">
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                                <div key={day} className={cn(
                                    "section-header py-[var(--space-3)] text-center text-[var(--text-tiny)] font-semibold tracking-widest",
                                    i >= 5 ? "text-[var(--text-disabled)]" : "text-[var(--text-tertiary)]"
                                )}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        {/* Cells */}
                        <div className="flex-1 flex flex-col overflow-y-auto min-h-0 bg-[var(--bg-base)]">
                            {grid.map((row, i) => (
                                <div key={i} className="grid grid-cols-7 flex-1 min-h-[100px] border-b border-[var(--border-subtle)] last:border-0">
                                    {row.map((day, j) => {
                                        const isToday = day && today.getDate() === day && today.getMonth() + 1 === currentMonth && today.getFullYear() === currentYear;
                                        const dayTickets = day ? (ticketsByDate[day] || []) : [];
                                        const isSelected = selectedDate === day && isPanelOpen;
                                        const isWeekend = j >= 5;

                                        return (
                                            <div 
                                                key={j} 
                                                onClick={() => day && dayTickets.length > 0 && openPanel(day)}
                                                className={cn(
                                                    "p-[var(--space-3)] border-r border-[var(--border-subtle)] last:border-r-0 flex flex-col transition-colors",
                                                    !day ? "bg-[var(--bg-surface)] opacity-30 cursor-default" : (dayTickets.length > 0 ? "cursor-pointer hover:bg-[var(--bg-subtle)]" : "cursor-default"),
                                                    isSelected && "bg-[var(--accent-orange-soft)] ring-1 ring-inset ring-[var(--accent-orange)]",
                                                    isToday && !isSelected && "bg-[rgba(249,115,22,0.04)]",
                                                    isWeekend && day && !isSelected && !isToday && "bg-[rgba(0,0,0,0.15)]"
                                                )}
                                            >
                                                {day && (
                                                    <div className="flex items-start justify-between">
                                                        <span className={cn(
                                                            "w-7 h-7 flex items-center justify-center rounded-full text-[var(--text-label)] mb-2 transition-all",
                                                            isToday 
                                                                ? "bg-[var(--accent-orange)] text-white shadow-lg shadow-[var(--accent-orange-soft)] font-semibold" 
                                                                : isWeekend ? "text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"
                                                        )}>
                                                            {day}
                                                        </span>
                                                        {dayTickets.length > 0 && (
                                                            <span className="text-[10px] text-[var(--accent-orange)] font-semibold bg-[var(--accent-orange-soft)] px-1.5 py-0.5 rounded-[var(--radius-sm)] border border-[var(--accent-orange)]/20">
                                                                {dayTickets.length} due
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Dots */}
                                                <div className="flex flex-wrap gap-1.5 mt-auto">
                                                    {dayTickets.slice(0, 4).map(t => (
                                                        <div key={t.id} title={t.title}>
                                                            <PriorityIndicator priority={t.priority} showLabel={false} />
                                                        </div>
                                                    ))}
                                                    {dayTickets.length > 4 && (
                                                        <span className="text-[var(--text-tiny)] text-[var(--text-tertiary)] self-center ml-1">
                                                            +{dayTickets.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                {isPanelOpen && (
                    <div className="w-[400px] flex-shrink-0 card-elevated flex flex-col overflow-hidden animate-in slide-in-from-right-8 fade-in">
                        <div className="section-header flex justify-between items-center">
                            <div>
                                <h3 className="text-[var(--text-heading)] font-semibold text-[var(--text-primary)]">
                                    {new Date(currentYear, currentMonth - 1, selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </h3>
                                <p className="text-[var(--text-caption)] text-[var(--text-secondary)]">{selectedTickets.length} tasks due</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsPanelOpen(false)} className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] rounded-full">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0 flex flex-col divide-y divide-[var(--border-subtle)]">
                            {selectedTickets.map(ticket => (
                                <Link 
                                    key={ticket.id}
                                    href={route('tickets.show', ticket.id)}
                                    className="p-[var(--space-4)] hover:bg-[var(--bg-subtle)] transition-colors group block"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[var(--text-caption)] text-[var(--text-tertiary)] font-mono">{ticket.ticket_number}</span>
                                            <PriorityIndicator priority={ticket.priority} showLabel={false} />
                                        </div>
                                    </div>
                                    <h4 className="text-[var(--text-body)] font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-orange)] transition-colors line-clamp-2">
                                        {ticket.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[var(--text-tiny)]">
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded-[var(--radius-sm)] border",
                                            ticket.status === 'done' ? "bg-[var(--accent-green-soft)] text-[var(--accent-green)] border-transparent" : "bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)]" 
                                        )}>{ticket.status.replace('_', ' ').toUpperCase()}</span>
                                        
                                        {ticket.subject && (
                                            <span className="flex items-center gap-1 text-[var(--text-tertiary)] bg-[var(--bg-base)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ticket.subject.color }}></span>
                                                {ticket.subject.code || ticket.subject.name}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
