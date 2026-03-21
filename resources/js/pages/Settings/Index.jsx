import React from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { Button } from '@/components/ui/button';
import { Moon, Bell, AlertTriangle } from 'lucide-react';

export default function Index() {
    return (
        <SettingsLayout title="General">
            <div className="section-header flex justify-between items-center">
                <div>
                    <h2 className="text-[var(--text-title)] font-semibold text-[var(--text-primary)]">General Settings</h2>
                    <p className="text-[var(--text-caption)] text-[var(--text-tertiary)] mt-1">
                        Basic configuration for your SimpleDesk workspace.
                    </p>
                </div>
            </div>

            <div className="p-[var(--space-6)] space-y-[var(--space-8)]">
                {/* Theme Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Moon className="w-4 h-4 text-[var(--text-tertiary)]" />
                        <h3 className="text-[var(--text-label)] font-semibold text-[var(--text-primary)]">Theme Preferences</h3>
                    </div>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)] mb-4 ml-6">
                        SimpleDesk currently uses a refined dark productivity theme by default. Theme switching is coming in a future update.
                    </p>
                    <div className="ml-6 p-4 border border-[var(--border-default)] bg-[var(--bg-base)] rounded-[var(--radius-lg)] flex items-center justify-between hover:border-[var(--border-strong)] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--bg-base)] border-2 border-[var(--border-strong)] flex items-center justify-center">
                                <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                            <span className="text-[var(--text-label)] text-[var(--text-primary)] font-medium">Dark (Default)</span>
                        </div>
                        <span className="text-[var(--text-tiny)] font-medium text-[var(--accent-green)] px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--accent-green-soft)]">Active</span>
                    </div>
                </div>

                <div className="border-t border-[var(--border-default)]" />

                {/* Notifications Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-4 h-4 text-[var(--text-tertiary)]" />
                        <h3 className="text-[var(--text-label)] font-semibold text-[var(--text-primary)]">Browser Notifications</h3>
                    </div>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)] mb-4 ml-6">
                        SimpleDesk can notify you about upcoming deadlines. You need to allow notifications in your browser.
                    </p>
                    <div className="ml-6">
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
                            className="bg-[var(--bg-surface)] border-[var(--border-default)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)] transition-colors"
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            Request Notification Permission
                        </Button>
                    </div>
                </div>
                
                {/* Danger Zone */}
                <div className="border-t border-[var(--accent-red-soft)] pt-[var(--space-6)]">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-[var(--accent-red)]" />
                        <h3 className="text-[var(--text-label)] font-semibold text-[var(--accent-red)]">Danger Zone</h3>
                    </div>
                    <p className="text-[var(--text-body)] text-[var(--text-secondary)] mb-4 ml-6">
                        Reset all application data. This action cannot be undone.
                    </p>
                    <div className="ml-6">
                        <Button 
                            variant="outline" 
                            className="bg-transparent border-[var(--accent-red)] text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)] hover:text-[var(--accent-red)] transition-colors"
                            onClick={() => alert("This feature is currently disabled for safety.")}
                        >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Factory Reset Data
                        </Button>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
