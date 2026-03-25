import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toaster() {
    const { flash, errors } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
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
            const firstError = Object.values(errors)[0];
            msg = typeof firstError === 'string' ? firstError : JSON.stringify(firstError);
            t = 'error';
        }

        if (msg) {
            setMessage(msg);
            setType(t);
            setVisible(true);
            setIsExiting(false);

            const timer = setTimeout(() => {
                closeToast();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash, errors]);

    const closeToast = () => {
        setIsExiting(true);
        setTimeout(() => {
            setVisible(false);
        }, 300); // Matches duration-300
    };

    if (!visible || !message) return null;

    const icons = {
        success: <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" />,
        error: <AlertCircle className="w-4 h-4 text-[var(--accent-red)]" />,
        warning: <AlertTriangle className="w-4 h-4 text-[var(--accent-yellow)]" />,
        info: <Info className="w-4 h-4 text-[var(--accent-orange)]" />,
    };

    return (
        <div className={cn(
            "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] transition-all duration-300 ease-out",
            isExiting ? "opacity-0 translate-y-4 scale-95" : "animate-in slide-in-from-bottom-6 fade-in duration-300 zoom-in-95"
        )}>
            <div className="flex items-start gap-3 p-3.5 pr-12 rounded-[var(--radius-lg)] border border-[var(--border-strong)] shadow-2xl min-w-[300px] max-w-sm relative bg-[#1A1A1F]/90 backdrop-blur-xl">
                <div className="flex-shrink-0 mt-0.5">
                    {icons[type]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] leading-tight font-medium text-[var(--text-primary)] break-words">
                        {message}
                    </p>
                </div>
                <button 
                    onClick={closeToast}
                    className="absolute top-3 right-3 p-0.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-[var(--radius-sm)] transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
