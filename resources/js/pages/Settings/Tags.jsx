import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Tags({ tags }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        color: '#3B82F6', // Default blue
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('settings.tags.store'), {
            onSuccess: () => {
                reset();
                setEditingId(null);
            }
        });
    };

    const handleUpdate = (e, id) => {
        e.preventDefault();
        put(route('settings.tags.update', id), {
            onSuccess: () => {
                reset();
                setEditingId(null);
            }
        });
    };

    const startEdit = (tag) => {
        setEditingId(tag.id);
        setData({
            name: tag.name,
            color: tag.color || '#3B82F6',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    return (
        <SettingsLayout title="Tags">
            <div className="p-[var(--space-6)] border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--bg-surface)]">
                <div>
                    <h2 className="text-[var(--text-title)] font-semibold text-[var(--text-primary)]">Manage Tags</h2>
                    <p className="text-[var(--text-caption)] text-[var(--text-tertiary)] mt-1">
                        Create and organize tags to categorize your tickets.
                    </p>
                </div>
            </div>

            <div className="p-[var(--space-6)]">
                {/* Create Form */}
                {editingId === null && (
                    <form onSubmit={handleCreate} className="mb-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-4">
                        <h4 className="text-[var(--text-label)] font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-[var(--accent-orange)]" /> New Tag
                        </h4>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <label className="block text-[var(--text-tiny)] text-[var(--text-secondary)] mb-1">Tag Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-default)] focus:border-[var(--accent-orange)] rounded-[var(--radius-md)] px-3 py-1.5 text-[var(--text-body)] text-[var(--text-primary)] outline-none"
                                    placeholder="e.g., #urgent-bug"
                                />
                                {errors.name && <p className="text-[var(--text-tiny)] text-[var(--accent-red)] mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-[var(--text-tiny)] text-[var(--text-secondary)] mb-1">Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                                    />
                                    <Button type="submit" disabled={processing} className="bg-[var(--accent-orange)] hover:opacity-90 text-white shadow-sm border-0 ml-2">
                                        Save
                                    </Button>
                                </div>
                                {errors.color && <p className="text-[var(--text-tiny)] text-[var(--accent-red)] mt-1">{errors.color}</p>}
                            </div>
                        </div>
                    </form>
                )}

                {/* List */}
                <div className="space-y-3">
                    {tags.length === 0 ? (
                        <p className="text-[var(--text-body)] text-[var(--text-tertiary)] text-center py-6 border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-lg)]">
                            No tags created yet.
                        </p>
                    ) : (
                        tags.map(tag => (
                            <div key={tag.id} className="group flex items-center justify-between p-3 border border-[var(--border-default)] rounded-[var(--radius-lg)] bg-[var(--bg-base)] hover:border-[var(--border-strong)] transition-colors">
                                {editingId === tag.id ? (
                                    <form onSubmit={(e) => handleUpdate(e, tag.id)} className="flex-1 flex gap-4 items-end">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[var(--accent-orange)] rounded-[var(--radius-md)] px-3 py-1 text-[var(--text-body)] text-[var(--text-primary)] outline-none"
                                                autoFocus
                                            />
                                            {errors.name && <p className="text-[var(--text-tiny)] text-[var(--accent-red)] mt-1">{errors.name}</p>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={data.color}
                                                onChange={(e) => setData('color', e.target.value)}
                                                className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                                            />
                                            <Button type="button" variant="ghost" onClick={cancelEdit} className="text-[var(--text-secondary)]">Cancel</Button>
                                            <Button type="submit" disabled={processing} className="bg-[var(--accent-orange)] text-white hover:opacity-90">Save</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <span 
                                                className="px-2 py-0.5 rounded-[var(--radius-sm)] text-[var(--text-tiny)] font-medium"
                                                style={{ backgroundColor: `${tag.color}20`, color: tag.color, border: `1px solid ${tag.color}40` }}
                                            >
                                                #{tag.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                type="button" 
                                                onClick={() => startEdit(tag)}
                                                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-orange)] hover:bg-[var(--accent-orange-soft)] rounded-[var(--radius-md)] transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    if(confirm('Are you sure you want to delete this tag?')) {
                                                        destroy(route('settings.tags.destroy', tag.id));
                                                    }
                                                }}
                                                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)] rounded-[var(--radius-md)] transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </SettingsLayout>
    );
}
