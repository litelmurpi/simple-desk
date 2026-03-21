import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function SubjectProgress({ subjects }) {
    if (!subjects || subjects.length === 0) {
        return (
            <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-6)] text-center shadow-sm h-full flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-500/10 text-[var(--text-secondary)] rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-[var(--text-label)] font-semibold text-[var(--text-primary)] mb-1">No Active Subjects</h3>
                <p className="text-[var(--text-caption)] text-[var(--text-tertiary)]">
                    Create a subject from the Subjects page to track progress.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] flex flex-col h-full shadow-sm overflow-hidden">
            <div className="px-[var(--space-5)] py-[var(--space-4)] border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex justify-between items-center">
                <h3 className="text-[var(--text-heading)] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--accent-purple)]" />
                    Subject Progress
                </h3>
                <Link href={route('subjects.index')} className="text-[var(--text-tiny)] text-[var(--accent-blue)] hover:underline">
                    View All
                </Link>
            </div>
            
            <div className="p-[var(--space-5)] space-y-5 flex-1 overflow-y-auto max-h-[400px]">
                {subjects.map(subject => (
                    <div key={subject.id} className="group cursor-pointer" onClick={() => window.location.href = route('subjects.show', subject.id)}>
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject.color }}></span>
                                <span className="text-[var(--text-label)] text-[var(--text-primary)] font-medium group-hover:text-[var(--accent-blue)] transition-colors">
                                    {subject.code || subject.name}
                                </span>
                            </div>
                            <div className="text-[var(--text-tiny)] text-[var(--text-secondary)]">
                                {subject.percentage}% ({subject.done}/{subject.total})
                            </div>
                        </div>
                        <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden border border-[var(--border-default)]">
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
