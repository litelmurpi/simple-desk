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
        <h4 className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {label}
        </h4>
      )}
      <ul className="space-y-1 px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-fast text-body",
                  active 
                    ? "bg-accent-blue-soft text-accent-blue font-medium" 
                    : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
                )}
              >
                <Icon size={18} className={active ? "text-accent-blue" : "text-text-tertiary"} />
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
        <div className="w-8 h-8 rounded-md bg-accent-blue flex items-center justify-center text-text-inverse font-bold shadow-glow">
          SD
        </div>
        <span className="font-bold text-heading tracking-tight">SimpleDesk</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {renderNavGroup(mainNavItems, 'Workspace')}
        {renderNavGroup(secondaryNavItems, 'Manage')}
        
        <div className="px-4 mt-6 mb-4">
          <MiniCalendar />
        </div>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-bg-surface transition-colors">
          <div className="w-8 h-8 rounded-full bg-bg-subtle border border-border flex items-center justify-center text-text-secondary">
            R
          </div>
          <div className="flex flex-col">
            <span className="text-label text-text-primary">Raka</span>
            <span className="text-tiny text-text-tertiary">SI Student</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
