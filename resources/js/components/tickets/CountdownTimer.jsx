import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

export function CountdownTimer({ deadline, isClosed = false, className }) {
    const [timeLeft, setTimeLeft] = useState('');
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        if (!deadline || isClosed) return;

        const calculateTimeLeft = () => {
            const date = new Date(deadline);
            // Assuming deadline is end of day if no time is provided, 
            // but for exactness, we use the timestamp given.
            const now = new Date();
            const diffTime = date - now;
            
            if (diffTime < 0) {
                setIsOverdue(true);
                const absDiff = Math.abs(diffTime);
                const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
                
                if (days > 0) {
                    setTimeLeft(`Overdue by ${days} day${days > 1 ? 's' : ''}`);
                } else {
                    setTimeLeft(`Overdue by ${hours} hour${hours > 1 ? 's' : ''}`);
                }
                return;
            }

            setIsOverdue(false);
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);

            if (days > 0) {
                setTimeLeft(`${days} day${days > 1 ? 's' : ''} left`);
            } else if (hours > 0) {
                setTimeLeft(`${hours} hour${hours > 1 ? 's' : ''} left`);
            } else {
                const minutes = Math.floor((diffTime / 1000 / 60) % 60);
                setTimeLeft(`${minutes} min${minutes > 1 ? 's' : ''} left`);
            }
        };

        calculateTimeLeft();
        // Update every minute
        const timer = setInterval(calculateTimeLeft, 60000);
        
        return () => clearInterval(timer);
    }, [deadline, isClosed]);

    if (!deadline) return null;
    if (isClosed) return null;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 text-[var(--text-caption)] font-medium",
            isOverdue ? "text-[var(--accent-red)]" : "text-[var(--accent-orange)]",
            className
        )}>
            <Clock className="w-3.5 h-3.5" />
            {timeLeft}
        </span>
    );
}
