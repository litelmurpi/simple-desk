import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarDays, AlertCircle, Clock } from 'lucide-react';

export function DeadlineIndicator({ deadline, isClosed = false, className }) {
    if (!deadline) return (
        <span className={cn("inline-flex items-center gap-1.5 text-[var(--text-caption)] text-[var(--text-tertiary)]", className)}>
            <CalendarDays className="w-3.5 h-3.5" /> No deadline
        </span>
    );

    if (isClosed) return (
        <span className={cn("inline-flex items-center gap-1.5 text-[var(--text-caption)] text-[var(--text-tertiary)]", className)}>
            <CalendarDays className="w-3.5 h-3.5" /> Closed
        </span>
    );

    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    let config = {
        color: 'text-[var(--text-secondary)]',
        bg: 'bg-transparent',
        border: 'border-transparent',
        icon: <CalendarDays className="w-3.5 h-3.5" />
    };

    if (diffDays < 0) {
        config = {
            color: 'text-[var(--accent-red)] font-semibold',
            bg: 'bg-[var(--accent-red-soft)]',
            border: 'border-[var(--accent-red-soft)]',
            icon: <AlertCircle className="w-3.5 h-3.5" />
        };
    } else if (diffDays <= 1) {
        config = {
            color: 'text-[var(--accent-orange)] font-semibold',
            bg: 'bg-[var(--accent-orange-soft)]',
            border: 'border-[var(--accent-orange-soft)]',
            icon: <Clock className="w-3.5 h-3.5" />
        };
    } else if (diffDays <= 3) {
        config = {
            color: 'text-[var(--accent-yellow)]',
            bg: 'bg-[var(--accent-yellow-soft)]',
            border: 'border-transparent',
            icon: <Clock className="w-3.5 h-3.5" />
        };
    }

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 text-[var(--text-caption)] px-1.5 py-0.5 rounded-[var(--radius-sm)] border",
            config.color,
            config.bg,
            config.border,
            className
        )}>
            {config.icon}
            {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
    );
}
