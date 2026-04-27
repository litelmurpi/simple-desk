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

// Hardcoded colors for SVG context — CSS var() doesn't work reliably in SVG attributes
const CHART_COLORS = {
    green: '#30d158',
    gridLine: 'rgba(255,255,255,0.05)',
    tickText: 'rgba(255,255,255,0.40)',
    cursor: 'rgba(255,255,255,0.15)',
    tooltipBg: '#1a1a1f',
    tooltipBorder: 'rgba(255,255,255,0.15)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.65)',
    bgBase: '#000000',
};

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
                            <Button size="sm" className="bg-[var(--accent-blue)] text-white hover:opacity-90 shadow-sm text-[14px]">
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
                                    <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.gridLine} />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: CHART_COLORS.tickText, fontSize: 11 }}
                                tickMargin={12}
                                minTickGap={20}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: CHART_COLORS.tickText, fontSize: 11 }}
                                tickMargin={12}
                                allowDecimals={false}
                            />
                            <Tooltip 
                                cursor={{ stroke: CHART_COLORS.cursor, strokeWidth: 1, strokeDasharray: '4 4' }}
                                contentStyle={{ 
                                    backgroundColor: CHART_COLORS.tooltipBg, 
                                    borderColor: CHART_COLORS.tooltipBorder,
                                    borderRadius: '12px',
                                    color: CHART_COLORS.textPrimary,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    padding: '8px 12px'
                                }}
                                itemStyle={{ color: CHART_COLORS.green, fontWeight: 600, fontSize: '14px' }}
                                labelStyle={{ color: CHART_COLORS.textSecondary, marginBottom: '4px', fontSize: '12px' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="completed" 
                                name="Tickets Done"
                                stroke={CHART_COLORS.green}
                                strokeWidth={2.5}
                                fillOpacity={1} 
                                fill="url(#colorCompleted)" 
                                activeDot={{ r: 5, fill: CHART_COLORS.green, stroke: CHART_COLORS.bgBase, strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
