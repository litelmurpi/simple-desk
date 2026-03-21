import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { TicketListItem } from '@/components/tickets/TicketListItem';
import { BulkActionBar } from '@/components/tickets/BulkActionBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Search, FilterX, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Index({ tickets, subjects, tags, filters }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const toggleSelection = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedIds.length === tickets.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tickets.data.map(t => t.id));
        }
    };

    const handleFilterChange = (key, value) => {
        const query = { ...filters, [key]: value === 'all' ? null : value };
        if (key === 'search') query.search = searchQuery;
        
        router.get(route('tickets.index'), query, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilterChange('search', searchQuery);
    };

    const clearFilters = () => {
        setSearchQuery('');
        router.get(route('tickets.index'));
    };

    const activeFiltersCount = Object.keys(filters).filter(k => filters[k] && k !== 'sort' && k !== 'direction').length;

    return (
        <AppLayout title="Tickets">
            <Head title="Tickets" />

            <div className="flex flex-col h-full space-y-[var(--space-4)] anim-fade-in-up">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-4)]">
                    <div>
                        <h1 className="page-title">Issues</h1>
                        <p className="page-subtitle">Manage your tasks, bugs, and projects.</p>
                    </div>
                    <div>
                        <Link href={route('tickets.create')}>
                            <Button className="bg-[var(--accent-blue)] text-white hover:bg-blue-600 transition-colors shadow-sm">
                                <Plus className="w-4 h-4 mr-2" /> New Issue
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="card-elevated p-[var(--space-3)] flex flex-wrap gap-[var(--space-2)] items-center">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                        <Input 
                            placeholder="Search by SD-XXXX or title..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-[var(--bg-surface)] border-[var(--border-subtle)] focus-visible:ring-[var(--accent-blue)] text-[var(--text-caption)]"
                        />
                    </form>

                    <Select value={filters.status || 'all'} onValueChange={val => handleFilterChange('status', val)}>
                        <SelectTrigger className="w-[130px] h-9 bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-caption)]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--bg-overlay)]">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.priority || 'all'} onValueChange={val => handleFilterChange('priority', val)}>
                        <SelectTrigger className="w-[130px] h-9 bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-caption)]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--bg-overlay)]">
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>

                    {subjects.length > 0 && (
                        <Select value={filters.subject_id || 'all'} onValueChange={val => handleFilterChange('subject_id', val)}>
                            <SelectTrigger className="w-[150px] h-9 bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-caption)]">
                                <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--bg-overlay)]">
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map(s => (
                                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                            <FilterX className="w-4 h-4 mr-1.5" /> Clear
                        </Button>
                    )}
                </div>

                {/* List Container */}
                <div className="flex-1 card-elevated flex flex-col overflow-hidden">
                    {/* List Header */}
                    <div className="flex items-center gap-[var(--space-4)] px-[var(--space-3)] py-2.5 border-b border-[var(--border-default)] bg-gradient-to-b from-[var(--bg-surface)] to-[rgba(34,34,40,0.8)] text-[var(--text-tiny)] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">
                        <div className="w-8 flex justify-center">
                            {tickets.data.length > 0 && (
                                <input 
                                    type="checkbox" 
                                    className="rounded-[var(--radius-sm)] border-[var(--border-strong)] bg-transparent w-3.5 h-3.5"
                                    checked={tickets.data.length > 0 && selectedIds.length === tickets.data.length}
                                    onChange={toggleAll}
                                />
                            )}
                        </div>
                        <div className="flex-1 grid grid-cols-12 gap-[var(--space-4)] px-2">
                            <div className="col-span-12 md:col-span-6 lg:col-span-5">Issue</div>
                            <div className="hidden md:block col-span-3 lg:col-span-2">Status</div>
                            <div className="hidden lg:block col-span-2">Deadline</div>
                            <div className="hidden md:block col-span-3">Labels</div>
                        </div>
                    </div>

                    {/* List Items */}
                    <div className="flex-1 overflow-y-auto">
                        {tickets.data.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon bg-[var(--accent-blue-soft)]">
                                    <Inbox className="w-6 h-6 text-[var(--accent-blue)]" />
                                </div>
                                <p className="empty-state-title">No issues found</p>
                                <p className="empty-state-description mb-4">
                                    {activeFiltersCount > 0 ? "Try adjusting your filters to find what you're looking for." : "You're all caught up! Create a new ticket to get started."}
                                </p>
                                {activeFiltersCount > 0 && (
                                    <Button size="sm" variant="outline" onClick={clearFilters} className="bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[var(--text-caption)]">
                                        <FilterX className="w-3.5 h-3.5 mr-1.5" /> Clear Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--border-subtle)]">
                                {tickets.data.map(ticket => (
                                    <TicketListItem 
                                        key={ticket.id} 
                                        ticket={ticket} 
                                        isSelected={selectedIds.includes(ticket.id)}
                                        onSelect={toggleSelection}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination Bar */}
                    {tickets.links && tickets.links.length > 3 && (
                        <div className="px-4 py-3 border-t border-[var(--border-default)] bg-gradient-to-b from-[var(--bg-surface)] to-[rgba(34,34,40,0.8)] flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[var(--text-caption)] text-[var(--text-tertiary)]">
                                Showing <span className="font-medium text-[var(--text-secondary)]">{tickets.from || 0}</span> to <span className="font-medium text-[var(--text-secondary)]">{tickets.to || 0}</span> of <span className="font-medium text-[var(--text-secondary)]">{tickets.total}</span> entries
                            </p>
                            <nav className="isolate inline-flex -space-x-px rounded-md">
                                {tickets.links.map((link, i) => {
                                    if (link.url === null) {
                                        return (
                                            <span key={i} className="relative inline-flex items-center px-3 py-1.5 text-sm font-medium text-[var(--text-disabled)] bg-[var(--bg-raised)] border border-[var(--border-subtle)] cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={cn(
                                                "relative inline-flex items-center px-3 py-1.5 text-sm font-medium border transition-colors",
                                                link.active 
                                                    ? "z-10 bg-[var(--accent-blue-soft)] border-[var(--accent-blue)] text-[var(--accent-blue)]" 
                                                    : "bg-[var(--bg-raised)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            <BulkActionBar 
                selectedIds={selectedIds} 
                subjects={subjects} 
                onClear={() => setSelectedIds([])} 
            />
        </AppLayout>
    );
}
