import React from 'react';
import { LayoutList, Activity, CheckCircle2, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatsCards({ stats }) {
    const cards = [
        {
            title: 'Open Tickets',
            value: stats.open,
            icon: LayoutList,
            color: 'text-[var(--accent-blue)]',
            bg: 'bg-blue-500/10 border-[var(--accent-blue-soft)]'
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            icon: Activity,
            color: 'text-[var(--accent-purple)]',
            bg: 'bg-purple-500/10 border-[var(--accent-purple-soft)]'
        },
        {
            title: 'Done Today',
            value: stats.doneToday,
            icon: CheckCircle2,
            color: 'text-[var(--accent-green)]',
            bg: 'bg-green-500/10 border-[var(--accent-green-soft)]'
        },
        {
            title: 'Current Streak',
            value: `${stats.streak} Days`,
            icon: Flame,
            color: stats.streak > 0 ? 'text-[var(--accent-orange)]' : 'text-[var(--text-secondary)]',
            bg: stats.streak > 0 ? 'bg-orange-500/10 border-[var(--accent-orange-soft)]' : 'bg-[var(--bg-surface)] border-[var(--border-default)]'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-4)]">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className="bg-[var(--bg-raised)] border border-[var(--border-default)] border-b-2 hover:border-[var(--border-strong)] transition-colors rounded-[var(--radius-xl)] p-[var(--space-5)] flex items-start gap-4 shadow-sm">
                        <div className={cn("w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0 border", card.bg, card.color)}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[var(--text-tiny)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                                {card.title}
                            </p>
                            <h3 className="text-[var(--text-display)] text-[var(--text-primary)] leading-none font-bold">
                                {card.value}
                            </h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
