import React from 'react';
import { router } from '@inertiajs/react';
import { X, CheckCircle, AlertTriangle, Play, Trash2, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function BulkActionBar({ selectedIds = [], onClear, subjects = [] }) {
    if (selectedIds.length === 0) return null;

    const handleBulkUpdate = (field, value) => {
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-3 bg-(--bg-overlay) border border-(--border-strong) shadow-xl px-4 py-2.5 rounded-full">
                
                <div className="flex items-center gap-2 pr-3 border-r border-(--border-subtle)">
                    <span className="bg-(--accent-orange) text-(--text-inverse) text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {selectedIds.length}
                    </span>
                    <span className="text-[13px] font-medium text-(--text-primary)">Selected</span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Status Update */}
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 rounded-full text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-subtle)" />}>
                            Status
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-(--bg-raised) border-(--border-strong) p-1 shadow-lg">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[11px] font-medium text-(--text-tertiary) px-2">Set Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleBulkUpdate('status', 'open')} className="hover:bg-(--bg-subtle) cursor-pointer py-1.5 focus:bg-(--bg-subtle)">
                                    <Play className="w-3.5 h-3.5 mr-2 text-(--accent-yellow)" /> Open
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkUpdate('status', 'in_progress')} className="hover:bg-(--bg-subtle) cursor-pointer py-1.5 focus:bg-(--bg-subtle)">
                                    <Play className="w-3.5 h-3.5 mr-2 text-(--accent-purple)" /> In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkUpdate('status', 'done')} className="hover:bg-(--bg-subtle) cursor-pointer py-1.5 focus:bg-(--bg-subtle)">
                                    <CheckCircle className="w-3.5 h-3.5 mr-2 text-(--accent-green)" /> Done
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkUpdate('status', 'blocked')} className="hover:bg-(--bg-subtle) cursor-pointer py-1.5 focus:bg-(--bg-subtle)">
                                    <AlertTriangle className="w-3.5 h-3.5 mr-2 text-(--accent-red)" /> Blocked
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Subject Update */}
                    {subjects.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 rounded-full text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-subtle)" />}>
                                Subject
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-(--bg-raised) border-(--border-strong) p-1 shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="text-[11px] font-medium text-(--text-tertiary) px-2">Assign Subject</DropdownMenuLabel>
                                    {subjects.map(s => (
                                        <DropdownMenuItem key={s.id} onClick={() => handleBulkUpdate('subject_id', s.id)} className="hover:bg-(--bg-subtle) cursor-pointer py-1.5 focus:bg-(--bg-subtle)">
                                            <Library className="w-3.5 h-3.5 mr-2 text-(--text-secondary)" /> {s.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <div className="w-[1px] h-4 bg-(--border-subtle) mx-1"></div>

                    {/* Fast Action Delete */}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full text-(--text-secondary) hover:text-(--accent-red) hover:bg-(--accent-red-soft)"
                        onClick={handleBulkDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                <div className="pl-2 ml-1 border-l border-(--border-subtle)">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full text-(--text-tertiary) hover:text-(--text-primary) hover:bg-(--bg-subtle)"
                        onClick={onClear}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
