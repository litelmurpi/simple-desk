import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { TicketListItem } from '@/components/tickets/TicketListItem';
import { QuickAddRow } from '@/components/tickets/QuickAddRow';
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
    const [isQuickAddVisible, setIsQuickAddVisible] = useState(false);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Only trigger if we aren't inputting text somewhere else
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
            
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                setIsQuickAddVisible(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                        <Button 
                            onClick={() => setIsQuickAddVisible(!isQuickAddVisible)}
                            className="bg-[var(--accent-blue)] text-white hover:opacity-90 transition-colors shadow-sm font-medium mr-2"
                        >
                            Quick Add (N)
                        </Button>
                        <Link href={route('tickets.create')}>
                            <Button variant="outline" className="border-[var(--border-default)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors shadow-sm font-medium">
                                <Plus className="w-4 h-4 mr-2" /> Full Form
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-[var(--space-3)] flex flex-wrap gap-[var(--space-3)] items-center shadow-[var(--shadow-md)] relative z-10">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                        <Input 
                            placeholder="Search by SD-XXXX or title..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--border-strong)] focus-visible:border-[var(--accent-blue)] focus-visible:ring-1 focus-visible:ring-[var(--accent-blue)] text-[var(--text-body)] text-[var(--text-primary)] transition-all rounded-[var(--radius-md)]"
                        />
                    </form>

                    <div className="flex items-center border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--bg-surface)] overflow-hidden h-9 font-medium transition-colors hover:border-[var(--border-strong)]">
                        <div className="px-3 py-1 text-[var(--text-tiny)] font-semibold text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-base)] border-r border-[var(--border-default)] h-full flex items-center">
                            Status
                        </div>
                        <Select value={filters.status || 'all'} onValueChange={val => handleFilterChange('status', val)}>
                            <SelectTrigger className="w-[120px] h-full border-0 bg-transparent rounded-none text-[var(--text-label)] focus:ring-0 shadow-none hover:bg-[var(--bg-subtle)] transition-colors">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--bg-overlay)] border-[var(--border-strong)] shadow-[var(--shadow-lg)]">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--bg-surface)] overflow-hidden h-9 font-medium transition-colors hover:border-[var(--border-strong)]">
                        <div className="px-3 py-1 text-[var(--text-tiny)] font-semibold text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-base)] border-r border-[var(--border-default)] h-full flex items-center">
                            Priority
                        </div>
                        <Select value={filters.priority || 'all'} onValueChange={val => handleFilterChange('priority', val)}>
                            <SelectTrigger className="w-[110px] h-full border-0 bg-transparent rounded-none text-[var(--text-label)] focus:ring-0 shadow-none hover:bg-[var(--bg-subtle)] transition-colors">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--bg-overlay)] border-[var(--border-strong)] shadow-[var(--shadow-lg)]">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {subjects.length > 0 && (
                        <div className="flex items-center border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--bg-surface)] overflow-hidden h-9 font-medium transition-colors hover:border-[var(--border-strong)]">
                            <div className="px-3 py-1 text-[var(--text-tiny)] font-semibold text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-base)] border-r border-[var(--border-default)] h-full flex items-center">
                                Subject
                            </div>
                            <Select value={filters.subject_id || 'all'} onValueChange={val => handleFilterChange('subject_id', val)}>
                                <SelectTrigger className="w-[140px] h-full border-0 bg-transparent rounded-none text-[var(--text-label)] focus:ring-0 shadow-none hover:bg-[var(--bg-subtle)] transition-colors text-left truncate">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--bg-overlay)] border-[var(--border-strong)] shadow-[var(--shadow-lg)] max-h-60 custom-scrollbar">
                                    <SelectItem value="all">All</SelectItem>
                                    {subjects.map(s => (
                                        <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] ml-auto transition-colors font-medium rounded-[var(--radius-md)]">
                            <FilterX className="w-4 h-4 mr-2" /> Clear
                        </Button>
                    )}
                </div>

                {/* List Container */}
                <div className="flex-1 flex flex-col gap-[var(--space-3)]">
                    <QuickAddRow
                        isVisible={isQuickAddVisible}
                        onClose={() => setIsQuickAddVisible(false)}
                    />

                    <div className="flex-1 bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-lg)] flex flex-col overflow-hidden shadow-[var(--shadow-md)]">
                        {/* List Header */}
                    <div className="flex items-center gap-[var(--space-4)] px-[var(--space-3)] py-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-tiny)] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider shadow-sm">
                        <div className="w-8 flex justify-center">
                            {tickets.data.length > 0 && (
                                <Checkbox 
                                    className="border-[var(--border-strong)] rounded-sm data-[state=checked]:bg-[var(--accent-blue)] data-[state=checked]:border-[var(--accent-blue)]"
                                    checked={tickets.data.length > 0 && selectedIds.length === tickets.data.length}
                                    onCheckedChange={toggleAll}
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
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                                    <Button size="sm" variant="outline" onClick={clearFilters} className="bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] text-[13px]">
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
                        <div className="px-4 py-3 border-t border-[var(--border-default)] bg-gradient-to-b from-transparent to-black/10 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[13px] text-[var(--text-tertiary)]">
                                Showing <span className="font-semibold font-mono text-[var(--text-secondary)]">{tickets.from || 0}</span> to <span className="font-semibold font-mono text-[var(--text-secondary)]">{tickets.to || 0}</span> of <span className="font-semibold font-mono text-[var(--text-secondary)]">{tickets.total}</span> entries
                            </p>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                {tickets.links.map((link, i) => {
                                    if (link.url === null) {
                                        return (
                                            <span key={i} className="relative inline-flex items-center px-3 py-1.5 text-[13px] font-medium text-[var(--text-disabled)] bg-transparent border border-[var(--border-subtle)] cursor-not-allowed first:rounded-l-md last:rounded-r-md" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={cn(
                                                "relative inline-flex items-center px-3 py-1.5 text-[13px] font-medium border transition-colors first:rounded-l-md last:rounded-r-md",
                                                link.active 
                                                    ? "z-10 bg-[var(--accent-blue-soft)] border-[var(--accent-blue)] text-[var(--accent-blue)]" 
                                                    : "bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
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
            </div>

            <BulkActionBar 
                selectedIds={selectedIds} 
                subjects={subjects} 
                onClear={() => setSelectedIds([])} 
            />
        </AppLayout>
    );
}
