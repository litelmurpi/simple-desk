import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { cn } from './Sidebar';

export default function Header({ title, onMenuClick, className }) {
  return (
    <header className={cn("sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md", className)}>
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-title font-semibold text-text-primary tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-tertiary group-focus-within:text-accent-blue transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="block w-64 p-2 pl-9 text-body text-text-primary bg-bg-surface border border-border rounded-md focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder-text-tertiary transition-all duration-fast"
            placeholder="Search tickets, subjects..."
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <kbd className="hidden sm:inline-block items-center rounded border border-border bg-bg-subtle px-1.5 font-mono text-tiny text-text-tertiary">
              ⌘K
            </kbd>
          </div>
        </div>

        <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-md transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-accent-red ring-2 ring-background" />
        </button>
      </div>
    </header>
  );
}
