import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { cn } from './Sidebar';

export default function Header({ title, onMenuClick, className }) {
  return (
    <header className={cn("sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md", className)}>
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-[var(--radius-md)] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-[var(--text-label)] font-medium text-[var(--text-secondary)] tracking-normal">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-tertiary group-focus-within:text-accent-blue transition-colors">
            <Search size={15} />
          </div>
          <input
            type="text"
            className="block w-56 py-1.5 pl-9 pr-12 text-[var(--text-caption)] text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] focus:ring-1 focus:ring-[var(--accent-blue)] focus:border-[var(--accent-blue)] placeholder:text-[var(--text-tertiary)] transition-all"
            placeholder="Search tickets..."
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <kbd className="hidden sm:inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-disabled)] leading-none">
              ⌘K
            </kbd>
          </div>
        </div>

        <button className="relative p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-[var(--radius-md)] transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--accent-red)] ring-2 ring-[var(--bg-base)]" />
        </button>
      </div>
    </header>
  );
}
