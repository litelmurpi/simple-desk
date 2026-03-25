import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import DeadlineList from '@/components/dashboard/DeadlineList';
import SubjectProgress from '@/components/dashboard/SubjectProgress';
import ProductivityChart from '@/components/dashboard/ProductivityChart';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard({ stats, deadlines, subjectProgress, chartData }) {


    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="max-w-[1600px] mx-auto space-y-[var(--space-8)] anim-fade-in-up">
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-4)]">
                    <div>
                        <h1 className="page-title">Overview</h1>
                        <p className="page-subtitle">Here's what's happening with your projects today.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link href={route('tickets.create')}>
                            <Button className="bg-[var(--accent-orange)] text-white hover:opacity-90 shadow-sm">
                                <Plus className="w-4 h-4 mr-2" /> New Ticket
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <StatsCards stats={stats} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-6)]">
                    {/* Left Column (2/3 width on large screens) */}
                    <div className="lg:col-span-2 flex flex-col gap-[var(--space-6)]">
                        {/* Chart Section */}
                        <div className="h-[400px]">
                            <ProductivityChart data={chartData} />
                        </div>
                        
                        {/* Subject Progress Section */}
                        <div className="h-[450px]">
                            <SubjectProgress subjects={subjectProgress} />
                        </div>
                    </div>

                    {/* Right Column (1/3 width on large screens) */}
                    <div className="lg:col-span-1 h-[874px]">
                        <DeadlineList today={deadlines.today} thisWeek={deadlines.thisWeek} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
