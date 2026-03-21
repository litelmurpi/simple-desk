import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function SubjectProgress({ subjects }) {
    if (!subjects || subjects.length === 0) {
        return (
            <div className="card-elevated h-full flex flex-col items-center justify-center anim-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="empty-state">
                    <div className="empty-state-icon bg-[var(--accent-purple-soft)]">
                        <BookOpen className="w-6 h-6 text-[var(--accent-purple)]" />
                    </div>
                    <p className="empty-state-title">No Active Subjects</p>
                    <p className="empty-state-description mb-4">
                        Create a subject from the Subjects page to track your progress per course.
                    </p>
                    <Link href={route('subjects.index')}>
                        <Button size="sm" variant="outline" className="bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] text-[var(--text-caption)]">
                            Go to Subjects <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card-elevated flex flex-col h-full overflow-hidden anim-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="section-header flex justify-between items-center">
                <h3 className="text-[var(--text-heading)] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--accent-purple)]" />
                    Subject Progress
                </h3>
                <Link href={route('subjects.index')} className="text-[var(--text-tiny)] text-[var(--accent-blue)] hover:text-blue-400 transition-colors font-medium">
                    View All
                </Link>
            </div>
            
            <div className="p-[var(--space-5)] space-y-5 flex-1 overflow-y-auto max-h-[400px]">
                {subjects.map(subject => (
                    <div 
                        key={subject.id} 
                        className="group cursor-pointer rounded-[var(--radius-md)] p-2 -mx-2 hover:bg-[var(--bg-surface)] transition-colors" 
                        onClick={() => window.location.href = route('subjects.show', subject.id)}
                    >
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full ring-2 ring-[var(--bg-raised)] transition-transform group-hover:scale-125" style={{ backgroundColor: subject.color }}></span>
                                <span className="text-[var(--text-label)] text-[var(--text-primary)] font-medium group-hover:text-[var(--accent-blue)] transition-colors">
                                    {subject.code || subject.name}
                                </span>
                            </div>
                            <div className="text-[var(--text-tiny)] text-[var(--text-secondary)] tabular-nums">
                                {subject.percentage}% ({subject.done}/{subject.total})
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 ease-in-out" 
                                style={{ 
                                    width: `${subject.percentage}%`, 
                                    backgroundColor: subject.percentage === 100 ? 'var(--accent-green)' : subject.color 
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
