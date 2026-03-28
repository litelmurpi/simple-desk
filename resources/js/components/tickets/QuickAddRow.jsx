import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityIndicator } from './PriorityIndicator';

export function QuickAddRow({ isVisible, onClose, onSuccess, defaultStatus = 'open' }) {
    const inputRef = useRef(null);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        type: 'todo', // default type
        priority: 'medium', // default priority
        status: defaultStatus,
    });

    useEffect(() => {
        if (isVisible) {
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 50);
        } else {
            reset();
            clearErrors();
        }
    }, [isVisible]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isVisible) return;
            
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onClose]);

    const submit = (e) => {
        e.preventDefault();
        
        if (!data.title.trim()) {
            onClose();
            return;
        }

        post(route('tickets.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
                onClose();
            },
        });
    };

    if (!isVisible) return null;

    return (
        <form 
            onSubmit={submit} 
            className="group relative flex items-center justify-between p-3 md:p-4 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--accent-blue)] transform translate-y-0 opacity-100 transition-all shadow-[var(--shadow-md)]"
        >
            <div className="flex items-center gap-3 w-full">
                <div className="w-[80px] hidden md:flex items-center gap-3 text-sm text-[var(--accent-blue)] font-medium">
                    <Plus className="w-4 h-4" /> Add
                </div>

                <div className="flex-1 pr-6 relative w-full flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-blue)]/10">
                        <PriorityIndicator priority={data.priority} showLabel={false} />
                    </div>
                    
                    <input
                        ref={inputRef}
                        type="text"
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                        placeholder="What needs to be done? Press Enter to save, Esc to cancel"
                        className="w-full bg-transparent border-none focus:ring-0 text-[var(--text-primary)] text-sm py-1 font-medium placeholder:text-[var(--text-tertiary)] placeholder:font-normal"
                        disabled={processing}
                    />
                    
                    {errors.title && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] text-[var(--accent-red)]">
                            {errors.title}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm whitespace-nowrap hidden lg:flex">
                {processing && <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-blue)]" />}
                {!processing && (
                    <div className="text-[11px] font-mono text-[var(--text-tertiary)] opacity-70">
                        <kbd className="px-1.5 py-0.5 rounded border border-[var(--border-default)]">Enter</kbd> to save
                    </div>
                )}
            </div>
        </form>
    );
}
