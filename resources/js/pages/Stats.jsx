import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Target } from 'lucide-react';

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

    const completionColor = completionRate >= 75 ? 'var(--accent-green)' : completionRate >= 40 ? 'var(--accent-yellow)' : 'var(--accent-red)';

    return (
        <AppLayout title="Stats">
            <Head title="Stats & Productivity" />

            <div className="anim-fade-in-up">
                <div className="mb-[var(--space-6)]">
                    <h1 className="page-title">Stats Overview</h1>
                    <p className="page-subtitle">Detailed breakdown of your tickets.</p>
                </div>

                {/* Top metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-4)] mb-[var(--space-6)] stagger-children">
                    <div className="card-elevated p-[var(--space-5)] flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--accent-blue-soft)] flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-5 h-5 text-[var(--accent-blue)]" />
                        </div>
                        <div>
                            <div className="text-[var(--text-tiny)] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">Total Tickets</div>
                            <div className="text-[28px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">{totalTickets}</div>
                        </div>
                    </div>
                    <div className="card-elevated p-[var(--space-5)] flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--accent-green-soft)] flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-[var(--accent-green)]" />
                        </div>
                        <div>
                            <div className="text-[var(--text-tiny)] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">Tickets Done</div>
                            <div className="text-[28px] font-bold text-[var(--accent-green)] leading-tight tracking-tight">{doneTickets}</div>
                        </div>
                    </div>
                    <div className="card-elevated p-[var(--space-5)] flex items-center justify-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                            {/* SVG donut */}
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--bg-surface)" strokeWidth="3" />
                                <circle 
                                    cx="18" cy="18" r="15.5" fill="none" 
                                    stroke={completionColor}
                                    strokeWidth="3" 
                                    strokeDasharray={`${completionRate} ${100 - completionRate}`} 
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[var(--text-label)] font-bold text-[var(--text-primary)]">{completionRate}%</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-[var(--text-tiny)] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">Completion</div>
                            <div className="text-[var(--text-caption)] text-[var(--text-secondary)] mt-0.5">
                                {completionRate >= 75 ? 'Great progress!' : completionRate >= 40 ? 'Keep going!' : 'Just getting started'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-6)]">
                    {/* Tickets By Status */}
                    <div className="card-elevated overflow-hidden anim-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="section-header flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-[var(--accent-purple)]" />
                            <h3 className="text-[var(--text-heading)] font-semibold text-[var(--text-primary)]">Tickets By Status</h3>
                        </div>
                        <div className="p-[var(--space-5)]">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ticketsByStatus} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                        <XAxis dataKey="status" stroke="var(--text-tertiary)" fontSize={11} tickFormatter={(val) => val.replace('_', ' ').toUpperCase()} axisLine={false} tickLine={false} />
                                        <YAxis stroke="var(--text-tertiary)" fontSize={11} allowDecimals={false} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--bg-overlay)', borderColor: 'var(--border-strong)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)', padding: '8px 12px' }}
                                            itemStyle={{ color: 'var(--text-primary)' }}
                                            labelStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }}
                                        />
                                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                            {ticketsByStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#71717A'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Tickets By Type */}
                    <div className="card-elevated overflow-hidden anim-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="section-header flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-[var(--accent-yellow)]" />
                            <h3 className="text-[var(--text-heading)] font-semibold text-[var(--text-primary)]">Tickets By Type</h3>
                        </div>
                        <div className="p-[var(--space-5)]">
                            <div className="h-64 flex items-center">
                                <div className="flex-1 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={ticketsByType}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={80}
                                                paddingAngle={4}
                                                dataKey="count"
                                                nameKey="type"
                                                strokeWidth={0}
                                            >
                                                {ticketsByType.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.type] || '#71717A'} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: 'var(--bg-overlay)', borderColor: 'var(--border-strong)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)', padding: '8px 12px' }}
                                                itemStyle={{ color: 'var(--text-primary)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-col gap-3 pl-4">
                                    {ticketsByType.map(entry => (
                                        <div key={entry.type} className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[entry.type] || '#71717A' }}></div>
                                            <div>
                                                <div className="text-[var(--text-tiny)] text-[var(--text-secondary)] uppercase tracking-wider font-medium">{entry.type}</div>
                                                <div className="text-[var(--text-label)] text-[var(--text-primary)] font-bold">{entry.count}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
