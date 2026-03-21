import React, { useMemo } from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function ProductivityChart({ data }) {
    const totalCompleted = useMemo(() => {
        return data.reduce((sum, item) => sum + item.completed, 0);
    }, [data]);

    return (
        <div className="card-elevated overflow-hidden flex flex-col h-full min-h-[350px] anim-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="section-header flex justify-between items-center">
                <h3 className="text-[var(--text-heading)] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[var(--accent-green)]" />
                    Productivity (Last 14 Days)
                </h3>
            </div>
            
            <div className="p-[var(--space-6)] flex-1 w-full h-full relative">
                {totalCompleted === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="empty-state-icon bg-[var(--accent-green-soft)]">
                            <Sparkles className="w-6 h-6 text-[var(--accent-green)]" />
                        </div>
                        <p className="empty-state-title">No activity yet</p>
                        <p className="empty-state-description mb-4">
                            Start completing tickets to see your productivity trend come alive.
                        </p>
                        <Link href={route('tickets.create')}>
                            <Button size="sm" className="bg-[var(--accent-blue)] text-white hover:bg-blue-600 shadow-sm text-[var(--text-caption)]">
                                Create Your First Ticket
                            </Button>
                        </Link>
                    </div>
                ) : null}
                
                <div className={`w-full h-full min-h-[250px] ${totalCompleted === 0 ? 'opacity-10 grayscale pointer-events-none' : ''}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                                tickMargin={12}
                                minTickGap={20}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                                tickMargin={12}
                                allowDecimals={false}
                            />
                            <Tooltip 
                                cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                contentStyle={{ 
                                    backgroundColor: 'var(--bg-overlay)', 
                                    borderColor: 'var(--border-strong)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--text-primary)',
                                    boxShadow: 'var(--shadow-md)',
                                    padding: '8px 12px'
                                }}
                                itemStyle={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '14px' }}
                                labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '12px' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="completed" 
                                name="Tickets Done"
                                stroke="var(--accent-green)" 
                                strokeWidth={2.5}
                                fillOpacity={1} 
                                fill="url(#colorCompleted)" 
                                activeDot={{ r: 5, fill: 'var(--accent-green)', stroke: 'var(--bg-base)', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
