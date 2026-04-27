import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Locked() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('unlock'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] selection:bg-[var(--accent-blue-soft)]">
            <Head title="App Locked" />

            <div className="w-full max-w-sm p-8 bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-xl)] shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 bg-[var(--accent-blue-soft)] text-[var(--accent-blue)] rounded-full flex items-center justify-center mb-4 border border-[var(--accent-blue)]/20 shadow-[var(--shadow-glow)]">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-[var(--text-display)] font-bold tracking-tight text-[var(--text-primary)]">SimpleDesk</h1>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)] mt-2">
                        Enter your application password to continue
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[var(--accent-blue)] rounded-[var(--radius-lg)] px-4 py-3 text-[var(--text-body)] text-[var(--text-primary)] outline-none text-center tracking-widest transition-colors shadow-sm"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoFocus
                            required
                        />
                        {errors.password && (
                            <p className="text-[var(--text-tiny)] text-[var(--accent-red)] mt-2 text-center animate-pulse">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <Button 
                        disabled={processing} 
                        type="submit" 
                        className="w-full bg-[var(--accent-blue)] hover:opacity-90 text-white shadow-sm font-medium py-3 rounded-[var(--radius-lg)] transition-all"
                    >
                        {processing ? 'Unlocking...' : 'Unlock Workspace'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
