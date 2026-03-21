import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toaster() {
    const { flash, errors } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('info'); // info, success, error, warning

    useEffect(() => {
        let msg = null;
        let t = 'info';

        if (flash?.success) {
            msg = flash.success;
            t = 'success';
        } else if (flash?.error) {
            msg = flash.error;
            t = 'error';
        } else if (errors && Object.keys(errors).length > 0) {
            // Pick the first error if multiple exist
            const firstError = Object.values(errors)[0];
            msg = typeof firstError === 'string' ? firstError : JSON.stringify(firstError);
            t = 'error';
        }

        if (msg) {
            setMessage(msg);
            setType(t);
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash, errors]);

    if (!visible || !message) return null;

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-[var(--accent-green)]" />,
        error: <AlertCircle className="w-5 h-5 text-[var(--accent-red)]" />,
        warning: <AlertTriangle className="w-5 h-5 text-[var(--accent-yellow)]" />,
        info: <Info className="w-5 h-5 text-[var(--accent-blue)]" />,
    };

    const backgrounds = {
        success: 'bg-[var(--accent-green-soft)] border-[var(--accent-green)]',
        error: 'bg-[var(--accent-red-soft)] border-[var(--accent-red)]',
        warning: 'bg-[var(--accent-yellow-soft)] border-[var(--accent-yellow)]',
        info: 'bg-[var(--accent-blue-soft)] border-[var(--accent-blue)]',
    };

    return (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-5">
            <div className={cn(
                "flex items-center gap-3 p-4 pr-12 rounded-[var(--radius-lg)] border shadow-[var(--shadow-lg)] min-w-[300px] max-w-md relative bg-[var(--bg-overlay)]",
                backgrounds[type]
            )}>
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-1">
                    <p className="text-[var(--text-body)] font-medium text-[var(--text-primary)]">
                        {message}
                    </p>
                </div>
                <button 
                    onClick={() => setVisible(false)}
                    className="absolute top-2 right-2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
