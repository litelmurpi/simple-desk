import React from 'react';
import { cn } from '@/lib/utils';
import { Circle, CircleDot, CircleDashed, CircleStop } from 'lucide-react'; // Fallback if literal dot is preferred, but let's use SVG or literals.

export function PriorityIndicator({ priority, className, showLabel = false }) {
    const config = {
        urgent: {
            label: 'Urgent',
            color: 'var(--accent-red)',
            icon: (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="5" fill="currentColor" />
                </svg>
            ) // ● filled
        },
        high: {
            label: 'High',
            color: 'var(--accent-orange)',
            icon: (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="5" fill="currentColor" />
                </svg>
            ) // ● filled
        },
        medium: {
            label: 'Medium',
            color: 'var(--accent-yellow)',
            icon: (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1ZM6 2V10C3.79086 10 2 8.20914 2 6C2 3.79086 3.79086 2 6 2Z" fill="currentColor"/>
                </svg>
            ) // ◐ half
        },
        low: {
            label: 'Low',
            color: 'var(--accent-gray)',
            icon: (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            ) // ○ empty
        },
    };

    const current = config[priority] || config.medium;

    return (
        <div className={cn("inline-flex items-center gap-[var(--space-2)]", className)} style={{ color: current.color }}>
            {current.icon}
            {showLabel && (
                <span className="text-[var(--text-caption)] text-[var(--text-secondary)]">
                    {current.label}
                </span>
            )}
        </div>
    );
}
