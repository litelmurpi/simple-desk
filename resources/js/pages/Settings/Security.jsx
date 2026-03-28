import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Unlock } from 'lucide-react';

export default function Security({ isAppLockEnabled }) {
    const [isEditing, setIsEditing] = useState(false);
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        enabled: isAppLockEnabled,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleToggleClick = () => {
        setIsEditing(true);
        setData('enabled', !isAppLockEnabled);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        reset();
        clearErrors();
        setData('enabled', isAppLockEnabled);
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (data.enabled && data.new_password !== data.new_password_confirmation) {
            // Very simple client side validation for confirmation
            alert("New passwords do not match.");
            return;
        }

        post(route('settings.security.toggle'), {
            onSuccess: () => {
                setIsEditing(false);
                reset('current_password', 'new_password', 'new_password_confirmation');
            }
        });
    };

    return (
        <SettingsLayout title="Security">
            <div className="p-[var(--space-6)] pb-0">
                <div>
                    <h2 className="text-[var(--text-title)] font-semibold text-[var(--text-primary)]">Security Settings</h2>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)] mt-1">
                        Manage application access and security preferences.
                    </p>
                </div>
            </div>

            <div className="p-[var(--space-6)]">
                <div className="border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5 bg-[var(--bg-base)]">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${isAppLockEnabled ? 'bg-[var(--accent-green-soft)] text-[var(--accent-green)]' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'}`}>
                                {isAppLockEnabled ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="text-[var(--text-label)] font-medium text-[var(--text-primary)]">App Lock Phase</h3>
                                <p className="text-[var(--text-body)] text-[var(--text-secondary)] mt-1">
                                    Require a password to access SimpleDesk. Useful if you share your computer.
                                </p>
                                <div className="mt-2 text-[var(--text-tiny)]">
                                    Status: {isAppLockEnabled ? (
                                        <span className="text-[var(--accent-green)] font-medium">Enabled</span>
                                    ) : (
                                        <span className="text-[var(--text-secondary)]">Disabled</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <Button 
                                variant={isAppLockEnabled ? "outline" : "default"}
                                onClick={handleToggleClick}
                                className={!isAppLockEnabled ? "bg-[var(--accent-orange)] text-white hover:opacity-90" : ""}
                            >
                                {isAppLockEnabled ? 'Disable Lock' : 'Enable Lock'}
                            </Button>
                        )}
                    </div>

                    {isEditing && (
                        <div className="mt-6 pt-6 border-t border-[var(--border-default)] animate-in fade-in slide-in-from-top-4 duration-300">
                            <form onSubmit={submit} className="space-y-4 max-w-sm">
                                <h4 className="text-[var(--text-label)] font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> 
                                    {data.enabled ? 'Set up App Lock' : 'Verify Identity to Disable'}
                                </h4>

                                {isAppLockEnabled && (
                                    <div>
                                        <label className="block text-[var(--text-tiny)] text-[var(--text-secondary)] mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[var(--accent-orange)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-body)] text-[var(--text-primary)] outline-none"
                                            required
                                        />
                                        {errors.current_password && <p className="text-[var(--text-tiny)] text-[var(--accent-red)] mt-1">{errors.current_password}</p>}
                                    </div>
                                )}

                                {data.enabled && (
                                    <>
                                        <div>
                                            <label className="block text-[var(--text-tiny)] text-[var(--text-secondary)] mb-1">New Password (min 4 chars)</label>
                                            <input
                                                type="password"
                                                value={data.new_password}
                                                onChange={(e) => setData('new_password', e.target.value)}
                                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[var(--accent-orange)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-body)] text-[var(--text-primary)] outline-none"
                                                required
                                                minLength="4"
                                            />
                                            {errors.new_password && <p className="text-[var(--text-tiny)] text-[var(--accent-red)] mt-1">{errors.new_password}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[var(--text-tiny)] text-[var(--text-secondary)] mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={data.new_password_confirmation}
                                                onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[var(--accent-orange)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-body)] text-[var(--text-primary)] outline-none"
                                                required
                                                minLength="4"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                    <Button type="button" variant="ghost" onClick={cancelEdit} className="text-[var(--text-secondary)]">Cancel</Button>
                                    <Button type="submit" disabled={processing} className="bg-[var(--accent-orange)] text-white hover:opacity-90">
                                        {data.enabled ? 'Save Password' : 'Confirm Disable'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </SettingsLayout>
    );
}
