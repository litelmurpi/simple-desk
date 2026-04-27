import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Coffee, BrainCircuit, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroTimer({ ticket }) {
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' | 'break'
    const [totalElapsedThisSession, setTotalElapsedThisSession] = useState(0);
    const [isStrictMode, setIsStrictMode] = useState(false);

    // Handle timer tick
    useEffect(() => {
        let timer = null;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                if (mode === 'work') {
                    setTotalElapsedThisSession(prev => prev + 1);
                }
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft, mode]);

    // Handle Strict Mode: pause when tab loses focus
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isRunning && mode === 'work' && isStrictMode) {
                setIsRunning(false);
                if (window.Notification && Notification.permission === 'granted') {
                    new Notification("Pomodoro Paused", { body: "Hey! You left the tab. Strict mode paused your timer." });
                }
            }
        };

        // Request notification permission if needed
        if (isStrictMode && window.Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isRunning, mode, isStrictMode]);

    const handleComplete = useCallback(() => {
        setIsRunning(false);
        const beep = new Audio('/beep.mp3'); // Assuming beep exists or just silently skip
        beep.play().catch(() => {});
        
        if (mode === 'work') {
            // Log exactly 25 mins or however long WORK_TIME was
            logTime(Math.round(WORK_TIME / 60));
            setMode('break');
            setTimeLeft(BREAK_TIME);
        } else {
            setMode('work');
            setTimeLeft(WORK_TIME);
        }
    }, [mode]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const stopTimer = () => {
        setIsRunning(false);
        // If stopping early during work, log the elapsed time if it's > 1 minute
        if (mode === 'work' && totalElapsedThisSession >= 60) {
            const minutesToLog = Math.floor(totalElapsedThisSession / 60);
            logTime(minutesToLog);
        }
        
        // Reset
        setMode('work');
        setTimeLeft(WORK_TIME);
        setTotalElapsedThisSession(0);
    };

    const logTime = (minutes) => {
        if (!ticket?.id || minutes < 1) return;
        
        router.post(route('tickets.log-time', ticket.id), { minutes }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setTotalElapsedThisSession(0);
            }
        });
    };

    const skipBreak = () => {
        setIsRunning(false);
        setMode('work');
        setTimeLeft(WORK_TIME);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progressPercentage = mode === 'work' 
        ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
        : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

    return (
        <div className="bg-[var(--bg-raised)] rounded-[var(--radius-xl)] p-[var(--space-lg)] shadow-[var(--shadow-soft)] flex flex-col items-center justify-center relative overflow-hidden">
            {/* 1. Header context */}
            <div className="w-full flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        mode === 'work' ? "bg-[var(--text-primary)]" : "bg-[var(--accent-blue)]"
                    )}></div>
                    <span className="text-[17px] font-semibold tracking-[-0.374px] text-[var(--text-primary)]">
                        {mode === 'work' ? 'Focus Session' : 'Break Time'}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-[14px] tracking-[-0.224px] text-[var(--text-secondary)]">
                    <Clock className="w-4 h-4 opacity-70" />
                    <span>{ticket?.time_spent_minutes || 0}m logged</span>
                </div>
            </div>

            {/* 2. Timer Hero */}
            <div className="text-center w-full my-[var(--space-md)]">
                <div className="text-[88px] sm:text-[110px] font-sans font-semibold tracking-[-3px] sm:tracking-[-4px] leading-[1.0] text-[var(--text-primary)] tabular-nums">
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* 3. Progress Bar */}
            <div className="w-full max-w-sm h-1 bg-[var(--bg-subtle)] rounded-full overflow-hidden mb-12">
                <div 
                    className={cn(
                        "h-full transition-all duration-1000 ease-linear",
                        mode === 'work' ? "bg-[var(--text-primary)]" : "bg-[var(--accent-blue)]"
                    )}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            {/* 4. Controls */}
            <div className="flex items-center justify-center gap-[var(--space-md)]">
                <button
                    onClick={toggleTimer}
                    className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-raised)] focus-visible:ring-[var(--accent-blue)]",
                        isRunning 
                            ? "bg-[var(--bg-overlay)] text-[var(--text-primary)]" 
                            : mode === 'work' 
                                ? "bg-[var(--text-primary)] text-[#000000]" 
                                : "bg-[var(--accent-blue)] text-[#ffffff]"
                    )}
                >
                    {isRunning ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
                </button>

                <button
                    onClick={stopTimer}
                    disabled={!isRunning && timeLeft === (mode === 'work' ? WORK_TIME : BREAK_TIME)}
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--bg-overlay)] text-[var(--text-primary)] opacity-80 hover:opacity-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-20 disabled:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-raised)] focus-visible:ring-[var(--accent-blue)]"
                    title={mode === 'work' && totalElapsedThisSession >= 60 ? "Stop & Log Time" : "Stop"}
                >
                    <Square className="w-5 h-5" fill="currentColor" />
                </button>
                
                {mode === 'break' && (
                    <button
                        onClick={skipBreak}
                        className="ml-2 px-5 py-2 border border-[var(--accent-blue)] text-[var(--accent-blue)] rounded-[980px] text-[14px] font-medium transition-colors hover:bg-[var(--accent-blue-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-raised)] focus-visible:ring-[var(--accent-blue)]"
                    >
                        Skip
                    </button>
                )}
            </div>
            
            {/* 5. Footer Strict Mode & Pulse */}
            <div className="w-full mt-[var(--space-10)] flex justify-between items-center text-[14px] text-[var(--text-secondary)] tracking-[-0.224px]">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Strict Mode</span>
                    <button
                        onClick={() => setIsStrictMode(!isStrictMode)}
                        className={cn(
                            "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-[980px] border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-raised)] focus-visible:ring-[var(--accent-blue)]",
                            isStrictMode ? "bg-[var(--accent-blue)]" : "bg-[var(--bg-subtle)]"
                        )}
                    >
                        <span className="sr-only">Toggle strict mode</span>
                        <span
                            aria-hidden="true"
                            className={cn(
                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm",
                                isStrictMode ? "translate-x-4" : "translate-x-0"
                            )}
                        />
                    </button>
                </div>
                <div className="h-5 flex items-center">
                    {mode === 'work' && isRunning && (
                        <span className="text-[14px] text-[var(--text-tertiary)] italic animate-pulse">
                            {isStrictMode ? "Tracking focus..." : "Stay focused..."}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
