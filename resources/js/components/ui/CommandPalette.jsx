import React, { useEffect, useRef } from 'react';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { router } from '@inertiajs/react';
import { Search, Ticket, BookOpen, Tag, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityIndicator } from '../tickets/PriorityIndicator';

export function CommandPalette() {
    const { isOpen, query, setQuery, results, isLoading, selectedIndex, setSelectedIndex, close } = useCommandPalette();
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    // Close on escape
    useEffect(() => {
        if (!isOpen) return;
        
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                close();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev + 1 >= (results.tickets.length + results.subjects.length + results.tags.length) ? 0 : prev + 1
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev - 1 < 0 ? (results.tickets.length + results.subjects.length + results.tags.length) - 1 : prev - 1
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleSelection();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        // Focus input
        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 100);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, close, setSelectedIndex]);

    const handleSelection = () => {
        let currentIndex = 0;
        let selectedItem = null;

        for (const ticket of results.tickets) {
            if (currentIndex === selectedIndex) selectedItem = ticket;
            currentIndex++;
        }
        for (const subject of results.subjects) {
            if (currentIndex === selectedIndex) selectedItem = subject;
            currentIndex++;
        }
        for (const tag of results.tags) {
            if (currentIndex === selectedIndex) selectedItem = tag;
            currentIndex++;
        }

        if (selectedItem && selectedItem.url) {
            close();
            router.get(selectedItem.url);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    if (!isOpen) return null;

    let globalIndex = 0;

    return (
        <div 
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 anim-fade-in"
            onClick={handleOverlayClick}
        >
            <div 
                ref={containerRef}
                className="w-full max-w-2xl bg-[var(--bg-raised)] rounded-xl shadow-2xl overflow-hidden border border-[var(--border-default)] flex flex-col anim-slide-up ring-1 ring-white/10"
            >
                {/* Input Area */}
                <div className="flex items-center px-4 py-4 border-b border-[var(--border-subtle)] relative">
                    <Search className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tickets, subjects, or tags..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-[var(--text-primary)] text-lg placeholder:text-[var(--text-tertiary)] px-4 outline-none"
                    />
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin text-[var(--text-tertiary)]" />}
                    {!isLoading && query && (
                        <button onClick={() => setQuery('')} className="p-1 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-tertiary)]">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <div className="hidden sm:flex items-center gap-1 absolute right-4 text-[11px] text-[var(--text-tertiary)] px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-default)] font-mono opacity-60">
                        <span>ESC</span> <span>to close</span>
                    </div>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {!query && (
                        <div className="p-8 text-center text-[var(--text-tertiary)] text-sm">
                            Type to start searching...
                        </div>
                    )}

                    {query && !isLoading && results.tickets.length === 0 && results.subjects.length === 0 && results.tags.length === 0 && (
                        <div className="p-8 text-center text-[var(--text-tertiary)] text-sm">
                            No results found for "{query}"
                        </div>
                    )}

                    {/* TICKETS */}
                    {results.tickets.length > 0 && (
                        <div className="mb-4">
                            <div className="px-3 py-1.5 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                                Tickets
                            </div>
                            <div className="space-y-1 mt-1">
                                {results.tickets.map(ticket => {
                                    const isSelected = globalIndex === selectedIndex;
                                    const currentIndex = globalIndex++;
                                    
                                    return (
                                        <div 
                                            key={ticket.id}
                                            onClick={() => { setSelectedIndex(currentIndex); handleSelection(); }}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors duration-150",
                                                isSelected ? "bg-[var(--accent-orange)] text-white" : "hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Ticket className={cn("w-4 h-4 flex-shrink-0", isSelected ? "text-white/80" : "text-[var(--text-tertiary)]")} />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold truncate leading-tight">{ticket.title}</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={cn("text-[11px] font-mono", isSelected ? "text-white/70" : "text-[var(--text-tertiary)]")}>
                                                            {ticket.ticket_number}
                                                        </span>
                                                        {ticket.subject && (
                                                            <span className={cn("text-[10px] uppercase tracking-wider px-1.5 rounded-sm border", 
                                                                isSelected ? "border-white/20 text-white/90" : ""
                                                            )}
                                                            style={!isSelected ? { backgroundColor: `${ticket.subject.color}15`, color: ticket.subject.color, borderColor: `${ticket.subject.color}30` } : {}}
                                                            >
                                                                {ticket.subject.code || ticket.subject.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <PriorityIndicator priority={ticket.priority} showLabel={false} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* SUBJECTS */}
                    {results.subjects.length > 0 && (
                        <div className="mb-4">
                            <div className="px-3 py-1.5 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                                Subjects
                            </div>
                            <div className="space-y-1 mt-1">
                                {results.subjects.map(subject => {
                                    const isSelected = globalIndex === selectedIndex;
                                    const currentIndex = globalIndex++;
                                    
                                    return (
                                        <div 
                                            key={subject.id}
                                            onClick={() => { setSelectedIndex(currentIndex); handleSelection(); }}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-150",
                                                isSelected ? "bg-[var(--accent-orange)] text-white" : "hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
                                            )}
                                        >
                                            <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${subject.color}20` }}>
                                                <BookOpen className="w-3.5 h-3.5" style={{ color: subject.color }} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold truncate">{subject.name}</span>
                                                <span className={cn("text-[11px]", isSelected ? "text-white/70" : "text-[var(--text-tertiary)]")}>
                                                    {subject.code}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAGS */}
                    {results.tags.length > 0 && (
                        <div className="mb-2">
                            <div className="px-3 py-1.5 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                                Tags
                            </div>
                            <div className="space-y-1 mt-1">
                                {results.tags.map(tag => {
                                    const isSelected = globalIndex === selectedIndex;
                                    const currentIndex = globalIndex++;
                                    
                                    return (
                                        <div 
                                            key={tag.id}
                                            onClick={() => { setSelectedIndex(currentIndex); handleSelection(); }}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-150",
                                                isSelected ? "bg-[var(--accent-orange)] text-white" : "hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
                                            )}
                                        >
                                            <Tag className="w-4 h-4" style={{ color: tag.color || '#A0A0AB' }} />
                                            <span className="text-sm font-medium">{tag.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                {query && (results.tickets.length > 0 || results.subjects.length > 0 || results.tags.length > 0) && (
                    <div className="px-4 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] font-mono text-[10px]">↑↓</kbd> to navigate</span>
                        <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] font-mono text-[10px]">Enter</kbd> to select</span>
                    </div>
                )}
            </div>
        </div>
    );
}
