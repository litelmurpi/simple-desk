import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { Settings, BookOpen, Tags, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsLayout({ children, title }) {
    const { url } = usePage();

    const menuItems = [
        { name: 'General', href: route('settings.index'), icon: Settings, active: url === '/settings' || url.startsWith('/settings/general') },
        { name: 'Subjects', href: route('settings.subjects.index'), icon: BookOpen, active: url.startsWith('/settings/subjects') },
        { name: 'Tags', href: route('settings.tags.index'), icon: Tags, active: url.startsWith('/settings/tags') },
        { name: 'Security', href: route('settings.security.index'), icon: Shield, active: url.startsWith('/settings/security') },
    ];

    return (
        <AppLayout title={`Settings - ${title}`}>
            <Head title={`Settings - ${title}`} />

            <div className="max-w-[1000px] mx-auto anim-fade-in-up">
                <div className="mb-[var(--space-8)]">
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your application preferences and data.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-[var(--space-8)]">
                    {/* Settings Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-lg)] text-[var(--text-label)] font-medium transition-colors whitespace-nowrap",
                                            item.active 
                                                ? "bg-[var(--accent-blue-soft)] text-[var(--accent-blue)]" 
                                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Settings Content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] shadow-sm overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
