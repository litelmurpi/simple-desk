import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Stats({ totalTickets, doneTickets, completionRate, ticketsByType, ticketsByStatus }) {
    const STATUS_COLORS = {
        open: '#EAB308',
        in_progress: '#8B5CF6',
        blocked: '#EF4444',
        done: '#22C55E',
        archived: '#71717A',
    };

    const TYPE_COLORS = {
        tugas: '#3B82F6',
        bug: '#EF4444',
        todo: '#10B981',
        project: '#F59E0B',
    };

    return (
        <AppLayout title="Stats">
            <Head title="Stats & Productivity" />

            <div className="mb-[var(--space-6)]">
                <h1 className="text-[var(--text-display)] text-[var(--text-primary)] font-bold tracking-tight">Stats Overview</h1>
                <p className="text-[var(--text-body)] text-[var(--text-secondary)] mt-1">Detailed breakdown of your tickets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-6)] mb-[var(--space-6)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] p-[var(--space-5)] rounded-[var(--radius-xl)] shadow-sm">
                    <div className="text-[var(--text-caption)] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">Total Tickets</div>
                    <div className="text-4xl font-bold text-[var(--text-primary)] mt-2">{totalTickets}</div>
                </div>
                <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] p-[var(--space-5)] rounded-[var(--radius-xl)] shadow-sm">
                    <div className="text-[var(--text-caption)] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">Tickets Done</div>
                    <div className="text-4xl font-bold text-[var(--accent-green)] mt-2">{doneTickets}</div>
                </div>
                <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] p-[var(--space-5)] rounded-[var(--radius-xl)] shadow-sm flex flex-col justify-center items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[var(--border-subtle)] flex items-center justify-center relative shadow-sm" style={{ borderColor: completionRate > 50 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
                        <span className="text-[var(--text-title)] font-bold text-[var(--text-primary)]">{completionRate}%</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-6)] animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Tickets By Status */}
                <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-5)] shadow-sm">
                    <h3 className="text-[var(--text-label)] font-semibold text-[var(--text-primary)] mb-6">Tickets By Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ticketsByStatus} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A32" vertical={false} />
                                <XAxis dataKey="status" stroke="#62626B" fontSize={12} tickFormatter={(val) => val.replace('_', ' ').toUpperCase()} />
                                <YAxis stroke="#62626B" fontSize={12} allowDecimals={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1A1A1F', borderColor: '#2A2A32', borderRadius: '8px', color: '#EDEDEF' }}
                                    itemStyle={{ color: '#EDEDEF' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {ticketsByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#71717A'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tickets By Type */}
                <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-5)] shadow-sm">
                    <h3 className="text-[var(--text-label)] font-semibold text-[var(--text-primary)] mb-6">Tickets By Type</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ticketsByType}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="type"
                                >
                                    {ticketsByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.type] || '#71717A'} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1A1A1F', borderColor: '#2A2A32', borderRadius: '8px', color: '#EDEDEF' }}
                                    itemStyle={{ color: '#EDEDEF' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="ml-4 flex flex-col gap-2">
                            {ticketsByType.map(entry => (
                                <div key={entry.type} className="flex items-center gap-2 text-[var(--text-tiny)] tracking-wider uppercase text-[var(--text-secondary)]">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[entry.type] || '#71717A' }}></div>
                                    {entry.type}: <span className="text-[var(--text-primary)] font-bold">{entry.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
