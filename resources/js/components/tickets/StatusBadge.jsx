import React from 'react';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }) {
    const statusConfig = {
        open: {
            label: 'OPEN',
            className: 'bg-[var(--accent-yellow-soft)] text-[var(--accent-yellow)]',
        },
        in_progress: {
            label: 'IN PROGRESS',
            className: 'bg-[var(--accent-purple-soft)] text-[var(--accent-purple)]',
        },
        blocked: {
            label: 'BLOCKED',
            className: 'bg-[var(--bg-surface)] text-[var(--accent-red)] border border-[var(--accent-red-soft)]',
        },
        done: {
            label: 'DONE',
            className: 'bg-[var(--accent-green-soft)] text-[var(--accent-green)]',
        },
        archived: {
            label: 'ARCHIVED',
            className: 'bg-[var(--bg-surface)] text-[var(--accent-gray)]',
        },
    };

    const config = statusConfig[status] || statusConfig.open;

    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 whitespace-nowrap text-[10px] font-bold tracking-wider rounded-[var(--radius-sm)] uppercase',
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
}
