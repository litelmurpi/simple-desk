import React from 'react';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';

export function MiniCalendar({ className }) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        let day = new Date(year, month - 1, 1).getDay();
        return day === 0 ? 6 : day - 1; // 0=Mon, 6=Sun
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

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

    const goToCalendar = () => {
        router.get(route('calendar'));
    };

    return (
        <div 
            className={cn("bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-3 shadow-sm cursor-pointer hover:border-[var(--border-strong)] transition-colors", className)}
            onClick={goToCalendar}
        >
            <div className="text-[var(--text-tiny)] font-semibold text-[var(--text-primary)] mb-2 px-1">
                {monthName}
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-[10px] font-medium text-[var(--text-tertiary)]">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                {grid.map((row, i) => (
                    <React.Fragment key={i}>
                        {row.map((day, j) => {
                            const isToday = day && today.getDate() === day;
                            
                            return (
                                <div 
                                    key={j} 
                                    className={cn(
                                        "h-6 w-full flex items-center justify-center rounded-[var(--radius-sm)] text-[11px]",
                                        !day && "opacity-0",
                                        isToday 
                                            ? "bg-[var(--accent-blue)] text-white font-semibold" 
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                                    )}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
