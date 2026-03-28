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
        <h4 className="px-5 mb-2.5 text-[11px] font-bold uppercase tracking-widest text[var(--text-tertiary)]">
          {label}
        </h4>
      )}
      <ul className="space-y-0.5 px-3">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px] group relative focus:outline-none focus-visible:ring-2 focus-visible:ring[var(--accent-orange)]",
                  active 
                    ? "bg[var(--accent-orange-soft)] text[var(--accent-orange)] font-semibold" 
                    : "text[var(--text-secondary)] font-medium hover:bg[var(--bg-surface)] hover:text[var(--text-primary)]"
                )}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg[var(--accent-orange)] rounded-r-full" />
                )}
                <Icon size={16} strokeWidth={active ? 2.5 : 2} className={cn(
                  "transition-colors flex-shrink-0",
                  active ? "text[var(--accent-orange)]" : "text[var(--text-tertiary)] group-hover:text[var(--text-secondary)]"
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
    <aside className={cn("flex flex-col h-full bg[var(--bg-raised)] border-r border[var(--border-default)] text[var(--text-primary)]", className)}>
      <div className="p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg[var(--accent-orange)] flex items-center justify-center text-white font-bold text-[13px] shadow-sm shadow[var(--accent-orange)]/20 cursor-default">
          SD
        </div>
        <span className="font-bold text-lg text[var(--text-primary)] tracking-tight cursor-default">SimpleDesk</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {renderNavGroup(mainNavItems, 'Workspace')}
        {renderNavGroup(secondaryNavItems, 'Manage')}
        
        <div className="px-5 mt-6 mb-4">
          <MiniCalendar />
        </div>
      </div>

      <div className="p-4 border-t border[var(--border-default)]">
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg[var(--bg-surface)] transition-all duration-200 group">
          <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from[var(--accent-orange)] to-orange-400 flex items-center justify-center text-white text-[12px] font-bold shadow-sm ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
            YA
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] text[var(--text-primary)] font-semibold truncate group-hover:text-white transition-colors">Yudistira Azfa</span>
            <span className="text-[11px] text[var(--text-tertiary)] truncate">IS Student</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
