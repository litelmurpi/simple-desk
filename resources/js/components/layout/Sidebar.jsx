import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Home, 
  Ticket, 
  Kanban, 
  Calendar as CalendarIcon, 
  BookOpen, 
  BarChart2, 
  Archive, 
  Settings 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MiniCalendar } from './MiniCalendar';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const mainNavItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Board', href: '/board', icon: Kanban },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
];

const secondaryNavItems = [
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Statistics', href: '/stats', icon: BarChart2 },
  { name: 'Archive', href: '/archive', icon: Archive },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ className, onNavigate }) {
  const { url } = usePage();

  const isActive = (path) => {
    if (path === '/' && url !== '/') return false;
    return url.startsWith(path);
  };

  const renderNavGroup = (items, label) => (
    <div className="mb-6">
      {label && (
        <h4 className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
          {label}
        </h4>
      )}
      <ul className="space-y-0.5 px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] transition-all text-[var(--text-label)] group relative",
                  active 
                    ? "bg-[var(--accent-blue-soft)] text-[var(--accent-blue)] font-semibold" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                )}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[var(--accent-blue)] rounded-full" />
                )}
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} className={cn(
                  "transition-colors flex-shrink-0",
                  active ? "text-[var(--accent-blue)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                )} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside className={cn("flex flex-col h-full bg-card border-r border-border text-text-primary", className)}>
      <div className="p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--accent-blue)] flex items-center justify-center text-white font-bold text-[var(--text-caption)] shadow-[var(--shadow-sm)]">
          SD
        </div>
        <span className="font-bold text-[var(--text-heading)] text-[var(--text-primary)] tracking-tight">SimpleDesk</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {renderNavGroup(mainNavItems, 'Workspace')}
        {renderNavGroup(secondaryNavItems, 'Manage')}
        
        <div className="px-4 mt-6 mb-4">
          <MiniCalendar />
        </div>
      </div>

      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-[var(--radius-md)] hover:bg-[var(--bg-surface)] transition-colors group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white text-[var(--text-tiny)] font-bold shadow-sm">
            YA
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[var(--text-label)] text-[var(--text-primary)] font-medium truncate">Yudistira Azfa</span>
            <span className="text-[var(--text-tiny)] text-[var(--text-tertiary)] truncate">Information System Student</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
