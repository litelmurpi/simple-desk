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
        <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-5)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[11px] font-bold text-[var(--accent-orange)] uppercase tracking-wider flex items-center gap-1.5 transition-colors">
                    {mode === 'work' ? (
                        <><BrainCircuit className="w-4 h-4" /> Focus Session</>
                    ) : (
                        <><Coffee className="w-4 h-4 text-[var(--accent-blue)]" /> Break Time</>
                    )}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)] font-medium bg-[var(--bg-base)] px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--border-subtle)]">
                    <Clock className="w-3.5 h-3.5" />
                    {ticket?.time_spent_minutes || 0}m logged
                </div>
            </div>

            <div className="text-center py-4">
                <div className="text-[48px] font-mono font-bold tracking-tight leading-none text-[var(--text-primary)] tabular-nums mb-1">
                    {formatTime(timeLeft)}
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden mb-6 border border-[var(--border-subtle)]">
                    <div 
                        className={cn(
                            "h-full transition-all duration-1000 ease-linear",
                            mode === 'work' ? "bg-[var(--accent-orange)]" : "bg-[var(--accent-blue)]"
                        )}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <div className="flex items-center justify-center gap-[var(--space-3)]">
                    <Button
                        size="sm"
                        onClick={toggleTimer}
                        className={cn(
                            "w-10 h-10 p-0 rounded-full transition-colors shadow-sm ring-offset-[var(--bg-raised)]",
                            isRunning 
                                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-default)]" 
                                : mode === 'work'
                                    ? "bg-[var(--accent-orange)] hover:opacity-90 text-[var(--text-inverse)]"
                                    : "bg-[var(--accent-blue)] hover:opacity-90 text-[var(--text-inverse)]"
                        )}
                    >
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopTimer}
                        disabled={!isRunning && timeLeft === (mode === 'work' ? WORK_TIME : BREAK_TIME)}
                        className="h-10 px-4 text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)] rounded-full transition-colors disabled:opacity-50"
                        title={mode === 'work' && totalElapsedThisSession >= 60 ? "Stop & Log Time" : "Stop"}
                    >
                        <Square className="w-4 h-4 mr-1.5" /> 
                        {mode === 'work' && totalElapsedThisSession >= 60 ? 'Stop & Log' : 'Stop'}
                    </Button>
                    
                    {mode === 'break' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={skipBreak}
                            className="h-10 px-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-full transition-colors"
                        >
                            Skip
                        </Button>
                    )}
                </div>
            </div>
            
            {mode === 'work' && isRunning && (
                <div className="mt-4 text-center">
                    <p className="text-[12px] text-[var(--accent-orange)] italic animate-pulse font-medium">
                        {isStrictMode ? "Strict focus tracking active..." : "Stay focused..."}
                    </p>
                </div>
            )}

            <div className="mt-4 flex justify-between items-center border-t border-[var(--border-subtle)] pt-3">
                <span className="text-[11px] text-[var(--text-tertiary)] font-medium">Strict Mode (Tab tracker)</span>
                <button
                    onClick={() => setIsStrictMode(!isStrictMode)}
                    className={cn(
                        "relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        isStrictMode ? "bg-[var(--accent-orange)]" : "bg-[var(--bg-subtle)] border-[var(--border-default)]"
                    )}
                >
                    <span className="sr-only">Use strict mode</span>
                    <span
                        aria-hidden="true"
                        className={cn(
                            "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm",
                            isStrictMode ? "translate-x-3" : "translate-x-0"
                        )}
                    />
                </button>
            </div>
        </div>
    );
}
