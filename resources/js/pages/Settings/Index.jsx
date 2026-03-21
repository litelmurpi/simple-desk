import React from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { Button } from '@/components/ui/button';

export default function Index() {
    return (
        <SettingsLayout title="General">
            <div className="p-[var(--space-6)] border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--bg-surface)]">
                <div>
                    <h2 className="text-[var(--text-title)] font-semibold text-[var(--text-primary)]">General Settings</h2>
                    <p className="text-[var(--text-caption)] text-[var(--text-tertiary)] mt-1">
                        Basic configuration for your SimpleDesk workspace.
                    </p>
                </div>
            </div>

            <div className="p-[var(--space-6)] space-y-6">
                <div>
                    <h3 className="text-[var(--text-label)] font-medium text-[var(--text-primary)] mb-2">Theme Preferences</h3>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)]">
                        SimpleDesk currently uses a refined dark productivity theme by default. Theme switching is coming in a future update.
                    </p>
                    <div className="mt-4 p-4 border border-[var(--border-default)] bg-[var(--bg-base)] rounded-[var(--radius-lg)] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0A0A0B] border border-[#2A2A32]"></div>
                            <span className="text-[var(--text-label)] text-[var(--text-primary)] font-medium">Dark (Default)</span>
                        </div>
                        <span className="text-[var(--text-tiny)] text-[var(--accent-green)] px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--accent-green-soft)]">Active</span>
                    </div>
                </div>

                <hr className="border-[var(--border-default)]" />

                <div>
                    <h3 className="text-[var(--text-label)] font-medium text-[var(--text-primary)] mb-2">Browser Notifications</h3>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)] mb-4">
                        SimpleDesk can notify you about upcoming deadlines. You need to allow notifications in your browser.
                    </p>
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            if (!("Notification" in window)) {
                                alert("This browser does not support desktop notification");
                            } else {
                                Notification.requestPermission().then(function (permission) {
                                    if (permission === "granted") {
                                        new Notification("Notifications enabled!", { body: "You will now receive deadline alerts." });
                                    }
                                });
                            }
                        }}
                        className="bg-[var(--bg-surface)] border-[var(--border-default)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                    >
                        Request Notification Permission
                    </Button>
                </div>
                
                <hr className="border-[var(--border-default)]" />

                <div>
                    <h3 className="text-[var(--text-label)] font-medium text-[var(--text-primary)] mb-2 text-[var(--accent-red)]">Danger Zone</h3>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)] mb-4">
                        Reset all application data. This action cannot be undone.
                    </p>
                    <Button 
                        variant="outline" 
                        className="bg-transparent border-[var(--accent-red)] text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)] hover:text-[var(--accent-red)]"
                        onClick={() => alert("This feature is currently disabled for safety.")}
                    >
                        Factory Reset Data
                    </Button>
                </div>
            </div>
        </SettingsLayout>
    );
}
