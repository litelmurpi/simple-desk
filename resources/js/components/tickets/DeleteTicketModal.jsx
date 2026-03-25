import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function DeleteTicketModal({ isOpen, onClose, ticket }) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!ticket) return null;

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('tickets.destroy', ticket.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                onClose();
            },
            onError: () => {
                setIsDeleting(false);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[var(--bg-overlay)] border-[var(--border-strong)] shadow-xl shadow-black/40 rounded-[var(--radius-xl)] p-0 overflow-hidden gap-0 duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                
                <div className="p-[var(--space-6)] pb-0 relative">
                    <div className="flex flex-col items-center justify-center text-center space-y-[var(--space-4)] relative z-10">
                        
                        {/* Destructive Icon Container */}
                        <div className="w-14 h-14 rounded-full bg-[var(--accent-red-soft)] flex items-center justify-center border border-[rgba(239,68,68,0.2)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[var(--accent-red)] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <Trash2 className="w-6 h-6 text-[var(--accent-red)] z-10 relative" />
                        </div>
                        
                        {/* Text Content */}
                        <div className="space-y-2 max-w-[90%] mx-auto">
                            <DialogTitle className="text-[var(--text-title)] font-semibold text-[var(--text-primary)]">
                                Delete Ticket?
                            </DialogTitle>
                            <DialogDescription className="text-[var(--text-body)] text-[var(--text-secondary)] leading-relaxed pt-1">
                                Are you sure you want to move ticket <span className="font-mono text-[var(--text-caption)] text-[var(--text-primary)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] shadow-sm">{ticket.ticket_number}</span> to the trash?
                                <br/>
                                <span className="block mt-2 text-[var(--text-tertiary)]">This action can be undone later from the Archive.</span>
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-[var(--space-6)] py-[var(--space-5)] mt-[var(--space-6)] border-t border-[var(--border-default)] bg-gradient-to-b from-[var(--bg-overlay)] to-[var(--bg-surface)] sm:justify-center flex flex-col-reverse sm:flex-row gap-[var(--space-3)]">
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        disabled={isDeleting}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-default)] w-full sm:w-auto min-w-[100px] h-10 shadow-sm transition-colors duration-fast"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        disabled={isDeleting}
                        className="bg-[var(--accent-red)] text-white hover:opacity-90 hover:shadow-md transition-all duration-normal border border-[var(--accent-red-soft)] w-full sm:w-auto min-w-[140px] h-10"
                    >
                        {isDeleting ? (
                            <div className="flex items-center">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                                Moving...
                            </div>
                        ) : 'Move to Trash'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
