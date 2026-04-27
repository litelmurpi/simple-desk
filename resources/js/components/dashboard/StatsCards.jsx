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
            bg: 'bg-[var(--accent-blue-soft)] border-[rgba(59,130,246,0.2)]',
            glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]'
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            icon: Activity,
            color: 'text-[var(--accent-purple)]',
            bg: 'bg-[var(--accent-purple-soft)] border-[rgba(139,92,246,0.2)]',
            glow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]'
        },
        {
            title: 'Done Today',
            value: stats.doneToday,
            icon: CheckCircle2,
            color: 'text-[var(--accent-green)]',
            bg: 'bg-[var(--accent-green-soft)] border-[rgba(34,197,94,0.2)]',
            glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]'
        },
        {
            title: 'Current Streak',
            value: `${stats.streak} Days`,
            icon: Flame,
            color: stats.streak > 0 ? 'text-[var(--accent-blue)]' : 'text-[var(--text-secondary)]',
            bg: stats.streak > 0 ? 'bg-[var(--accent-blue-soft)] border-[rgba(249,115,22,0.2)]' : 'bg-[var(--bg-surface)] border-[var(--border-default)]',
            glow: stats.streak > 0 ? 'hover:shadow-[0_0_20px_rgba(249,115,22,0.08)]' : ''
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-4)] stagger-children">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div 
                        key={index} 
                        className={cn(
                            "card-elevated p-[var(--space-5)] flex items-start gap-4 group",
                            card.glow
                        )}
                    >
                        <div className={cn(
                            "w-11 h-11 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0 border transition-transform duration-200 group-hover:scale-105",
                            card.bg, card.color
                        )}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[var(--text-tiny)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">
                                {card.title}
                            </p>
                            <h3 className="text-[24px] text-[var(--text-primary)] leading-none font-bold tracking-tight">
                                {card.value}
                            </h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
