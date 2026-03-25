import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { TicketListItem } from '@/components/tickets/TicketListItem';
import { BulkActionBar } from '@/components/tickets/BulkActionBar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

            <div className="flex flex-col h-full space-y-(--space-4) anim-fade-in-up">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-(--space-4)">
                    <div>
                        <h1 className="page-title">Issues</h1>
                        <p className="page-subtitle">Manage your tasks, bugs, and projects.</p>
                    </div>
                    <div>
                        <Link href={route('tickets.create')}>
                            <Button className="bg-(--accent-orange) text-(--text-inverse) hover:bg-[oklch(from_var(--accent-orange)_calc(l_-_0.1)_c_h)] transition-colors shadow-sm font-medium">
                                <Plus className="w-4 h-4 mr-2" /> New Issue
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="card-elevated p-(--space-2) px-(--space-3) flex flex-wrap gap-(--space-3) items-center shadow-sm relative z-10">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-tertiary)" />
                        <Input 
                            placeholder="Search by SD-XXXX or title..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-8 bg-(--bg-base) border-(--border-default) hover:border-(--border-strong) focus-visible:ring-(--accent-orange) text-[13px] transition-colors"
                        />
                    </form>

                    <div className="flex items-center border border-(--border-default) rounded-md bg-(--bg-surface) overflow-hidden h-8 font-medium">
                        <div className="px-2.5 py-1 text-[11px] font-semibold text-(--text-tertiary) uppercase tracking-wider bg-black/20 border-r border-(--border-default) h-full flex items-center">
                            Status
                        </div>
                        <Select value={filters.status || 'all'} onValueChange={val => handleFilterChange('status', val)}>
                            <SelectTrigger className="w-[120px] h-full border-0 bg-transparent rounded-none text-[13px] focus:ring-0 shadow-none hover:bg-(--bg-subtle) transition-colors font-medium">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-(--bg-overlay) border-(--border-strong) shadow-xl">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center border border-(--border-default) rounded-md bg-(--bg-surface) overflow-hidden h-8 font-medium">
                        <div className="px-2.5 py-1 text-[11px] font-semibold text-(--text-tertiary) uppercase tracking-wider bg-black/20 border-r border-(--border-default) h-full flex items-center">
                            Priority
                        </div>
                        <Select value={filters.priority || 'all'} onValueChange={val => handleFilterChange('priority', val)}>
                            <SelectTrigger className="w-[110px] h-full border-0 bg-transparent rounded-none text-[13px] focus:ring-0 shadow-none hover:bg-(--bg-subtle) transition-colors font-medium">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-(--bg-overlay) border-(--border-strong) shadow-xl">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {subjects.length > 0 && (
                        <div className="flex items-center border border-(--border-default) rounded-md bg-(--bg-surface) overflow-hidden h-8 font-medium">
                            <div className="px-2.5 py-1 text-[11px] font-semibold text-(--text-tertiary) uppercase tracking-wider bg-black/20 border-r border-(--border-default) h-full flex items-center">
                                Subject
                            </div>
                            <Select value={filters.subject_id || 'all'} onValueChange={val => handleFilterChange('subject_id', val)}>
                                <SelectTrigger className="w-[140px] h-full border-0 bg-transparent rounded-none text-[13px] focus:ring-0 shadow-none hover:bg-(--bg-subtle) transition-colors font-medium text-left truncate">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent className="bg-(--bg-overlay) border-(--border-strong) shadow-xl max-h-60 custom-scrollbar">
                                    <SelectItem value="all">All</SelectItem>
                                    {subjects.map(s => (
                                        <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2.5 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface) ml-auto transition-colors font-medium">
                            <FilterX className="w-3.5 h-3.5 mr-1.5" /> Clear
                        </Button>
                    )}
                </div>

                {/* List Container */}
                <div className="flex-1 card-elevated flex flex-col overflow-hidden">
                    {/* List Header */}
                    <div className="flex items-center gap-(--space-4) px-(--space-3) py-2.5 border-b border-(--border-default) bg-gradient-to-b from-transparent to-black/10 text-[11px] text-(--text-tertiary) font-semibold uppercase tracking-wider">
                        <div className="w-8 flex justify-center">
                            {tickets.data.length > 0 && (
                                <Checkbox 
                                    className="border-(--border-strong) rounded-sm data-[state=checked]:bg-(--accent-orange) data-[state=checked]:border-(--accent-orange)"
                                    checked={tickets.data.length > 0 && selectedIds.length === tickets.data.length}
                                    onCheckedChange={toggleAll}
                                />
                            )}
                        </div>
                        <div className="flex-1 grid grid-cols-12 gap-(--space-4) px-2">
                            <div className="col-span-12 md:col-span-6 lg:col-span-5">Issue</div>
                            <div className="hidden md:block col-span-3 lg:col-span-2">Status</div>
                            <div className="hidden lg:block col-span-2">Deadline</div>
                            <div className="hidden md:block col-span-3">Labels</div>
                        </div>
                    </div>

                    {/* List Items */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {tickets.data.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon bg-(--accent-orange-soft)">
                                    <Inbox className="w-6 h-6 text-(--accent-orange)" />
                                </div>
                                <p className="empty-state-title">No issues found</p>
                                <p className="empty-state-description mb-4">
                                    {activeFiltersCount > 0 ? "Try adjusting your filters to find what you're looking for." : "You're all caught up! Create a new ticket to get started."}
                                </p>
                                {activeFiltersCount > 0 && (
                                    <Button size="sm" variant="outline" onClick={clearFilters} className="bg-(--bg-surface) border-(--border-default) text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-subtle) text-[13px]">
                                        <FilterX className="w-3.5 h-3.5 mr-1.5" /> Clear Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-(--border-subtle)">
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
                        <div className="px-4 py-3 border-t border-(--border-default) bg-gradient-to-b from-transparent to-black/10 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[13px] text-(--text-tertiary)">
                                Showing <span className="font-semibold font-mono text-(--text-secondary)">{tickets.from || 0}</span> to <span className="font-semibold font-mono text-(--text-secondary)">{tickets.to || 0}</span> of <span className="font-semibold font-mono text-(--text-secondary)">{tickets.total}</span> entries
                            </p>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                {tickets.links.map((link, i) => {
                                    if (link.url === null) {
                                        return (
                                            <span key={i} className="relative inline-flex items-center px-3 py-1.5 text-[13px] font-medium text-(--text-disabled) bg-transparent border border-(--border-subtle) cursor-not-allowed first:rounded-l-md last:rounded-r-md" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={cn(
                                                "relative inline-flex items-center px-3 py-1.5 text-[13px] font-medium border transition-colors first:rounded-l-md last:rounded-r-md",
                                                link.active 
                                                    ? "z-10 bg-(--accent-orange-soft) border-(--accent-orange) text-(--accent-orange)" 
                                                    : "bg-transparent border-(--border-subtle) text-(--text-secondary) hover:bg-(--bg-subtle) hover:text-(--text-primary)"
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
