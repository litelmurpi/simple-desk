import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { BookOpen, MoreVertical, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Index({ subjects }) {
    const activeSubjects = subjects.filter(s => s.is_active);
    const archivedSubjects = subjects.filter(s => !s.is_active);

    const renderSubjectCard = (subject) => {
        const hasTickets = subject.tickets_count > 0;
        
        return (
            <Link 
                key={subject.id} 
                href={route('subjects.show', subject.id)}
                className="group bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-5)] shadow-sm hover:border-[var(--border-strong)] transition-all animate-in fade-in flex flex-col h-full"
            >
                <div className="flex justify-between items-start mb-[var(--space-4)]">
                    <div className="flex items-center gap-[var(--space-3)]">
                        <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center text-[var(--text-inverse)] shadow-md" style={{ backgroundColor: subject.color }}>
                            {subject.code ? subject.code.substring(0, 2) : <BookOpen className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-[var(--text-title)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors leading-tight">
                                {subject.name}
                            </h3>
                            {subject.code && (
                                <p className="text-[var(--text-caption)] text-[var(--text-secondary)] font-mono mt-0.5">
                                    {subject.code} • Semester {subject.semester}
                                </p>
                            )}
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors" />
                </div>

                <div className="mt-auto space-y-[var(--space-2)]">
                    <div className="flex justify-between items-end text-[var(--text-tiny)]">
                        <span className="text-[var(--text-secondary)] font-medium">Task Progress</span>
                        <span className={cn("font-bold", subject.progress === 100 ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]")}>
                            {subject.progress}%
                        </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                        <div 
                            className={cn("h-full transition-all duration-500", subject.progress === 100 ? "bg-[var(--accent-green)]" : "bg-[var(--accent-orange)]")} 
                            style={{ width: `${subject.progress}%` }} 
                        />
                    </div>
                    
                    <div className="flex justify-between text-[var(--text-caption)] text-[var(--text-tertiary)] pt-1">
                        <span>{subject.done_tickets_count} completed</span>
                        <span>{subject.tickets_count} total</span>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <AppLayout title="Subjects">
            <Head title="Subjects" />

            <div className="flex flex-col space-y-[var(--space-6)]">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-4)]">
                    <div>
                        <h1 className="text-[var(--text-display)] text-[var(--text-primary)] tracking-tight">Mata Kuliah</h1>
                        <p className="text-[var(--text-body)] text-[var(--text-secondary)]">Track your task completion progress grouped by subjects.</p>
                    </div>
                    <div className="flex items-center gap-[var(--space-2)]">
                        <Button 
                            variant="outline"
                            onClick={() => router.get(route('settings.subjects.index'))}
                            className="bg-[var(--bg-raised)] border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                        >
                            Manage Subjects
                        </Button>
                    </div>
                </div>

                {subjects.length === 0 ? (
                    <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-12 text-center shadow-sm">
                        <span className="text-4xl mb-4 block">📚</span>
                        <h3 className="text-[var(--text-heading)] text-[var(--text-primary)] mb-2">No subjects yet</h3>
                        <p className="text-[var(--text-body)] text-[var(--text-tertiary)] max-w-md mx-auto mb-6">
                            Start categorizing your tickets to track completion rates per course.
                        </p>
                        <Button 
                            onClick={() => router.get(route('settings.subjects.index'))}
                            className="bg-[var(--accent-orange)] text-white hover:opacity-90"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Your First Subject
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-[var(--space-8)]">
                        {/* Active Subjects */}
                        {activeSubjects.length > 0 && (
                            <section>
                                <h2 className="text-[var(--text-title)] font-semibold text-[var(--text-primary)] mb-[var(--space-4)] flex items-center gap-2">
                                    <div className="w-2 h-6 bg-[var(--accent-orange)] rounded-full"></div>
                                    Active Semester
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-5)]">
                                    {activeSubjects.map(renderSubjectCard)}
                                </div>
                            </section>
                        )}

                        {/* Archived/Old Subjects */}
                        {archivedSubjects.length > 0 && (
                            <section>
                                <h2 className="text-[var(--text-title)] font-semibold text-[var(--text-tertiary)] mb-[var(--space-4)] flex items-center gap-2">
                                    <div className="w-2 h-6 bg-[var(--border-strong)] rounded-full"></div>
                                    Archived Subjects
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-5)] opacity-70 hover:opacity-100 transition-opacity focus-within:opacity-100">
                                    {archivedSubjects.map(renderSubjectCard)}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
