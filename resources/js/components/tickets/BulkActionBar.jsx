import React from 'react';
import { router } from '@inertiajs/react';
import { X, CheckCircle, AlertTriangle, Play, Trash2, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function BulkActionBar({ selectedIds = [], onClear, subjects = [] }) {
    if (selectedIds.length === 0) return null;

    const handleBulkUpdate = (field, value) => {
        console.log(`Bulk updating ${field} to ${value} for IDs:`, selectedIds);
        router.patch(route('tickets.bulk.update'), {
            ticket_ids: selectedIds,
            [field]: value
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => onClear(),
        });
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} tickets?`)) {
            router.delete(route('tickets.bulk.delete'), {
                data: { ticket_ids: selectedIds },
                preserveScroll: true,
                onSuccess: () => onClear(),
            });
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center gap-3 bg-[var(--bg-overlay)] border border-[var(--border-strong)] shadow-[var(--shadow-lg)] px-4 py-3 rounded-[var(--radius-full)]">
                
                <div className="flex items-center gap-2 pr-3 border-r border-[var(--border-subtle)]">
                    <span className="bg-[var(--accent-blue)] text-white text-[var(--text-tiny)] font-bold px-2 py-0.5 rounded-[var(--radius-full)]">
                        {selectedIds.length}
                    </span>
                    <span className="text-[var(--text-label)] text-[var(--text-primary)]">Selected</span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Status Update */}
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 rounded-[var(--radius-xl)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />}>
                                Status
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[var(--bg-raised)] border-[var(--border-strong)] p-1">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[var(--text-caption)] font-medium text-[var(--text-tertiary)] px-2">Set Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleBulkUpdate('status', 'open')} className="hover:bg-[var(--bg-subtle)] cursor-pointer py-1.5 focus:bg-[var(--bg-subtle)] data-[highlighted]:bg-[var(--bg-subtle)]">
                                    <Play className="w-3.5 h-3.5 mr-2 text-[var(--accent-yellow)]" /> Open
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkUpdate('status', 'in_progress')} className="hover:bg-[var(--bg-subtle)] cursor-pointer py-1.5 focus:bg-[var(--bg-subtle)] data-[highlighted]:bg-[var(--bg-subtle)]">
                                    <Play className="w-3.5 h-3.5 mr-2 text-[var(--accent-purple)]" /> In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkUpdate('status', 'done')} className="hover:bg-[var(--bg-subtle)] cursor-pointer py-1.5 focus:bg-[var(--bg-subtle)] data-[highlighted]:bg-[var(--bg-subtle)]">
                                    <CheckCircle className="w-3.5 h-3.5 mr-2 text-[var(--accent-green)]" /> Done
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkUpdate('status', 'blocked')} className="hover:bg-[var(--bg-subtle)] cursor-pointer py-1.5 focus:bg-[var(--bg-subtle)] data-[highlighted]:bg-[var(--bg-subtle)]">
                                    <AlertTriangle className="w-3.5 h-3.5 mr-2 text-[var(--accent-red)]" /> Blocked
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Subject Update */}
                    {subjects.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 rounded-[var(--radius-xl)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />}>
                                    Subject
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[var(--bg-raised)] border-[var(--border-strong)] p-1 max-h-60 overflow-y-auto">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="text-[var(--text-caption)] font-medium text-[var(--text-tertiary)] px-2">Assign Subject</DropdownMenuLabel>
                                    {subjects.map(s => (
                                        <DropdownMenuItem key={s.id} onClick={() => handleBulkUpdate('subject_id', s.id)} className="hover:bg-[var(--bg-subtle)] cursor-pointer py-1.5 focus:bg-[var(--bg-subtle)] data-[highlighted]:bg-[var(--bg-subtle)]">
                                            <Library className="w-3.5 h-3.5 mr-2 text-[var(--text-secondary)]" /> {s.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <div className="w-[1px] h-4 bg-[var(--border-subtle)] mx-1"></div>

                    {/* Fast Action Delete */}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)]"
                        onClick={handleBulkDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                <div className="pl-2 ml-1 border-l border-[var(--border-subtle)]">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                        onClick={onClear}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
