import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2, Archive, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Subjects({ subjects }) {
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const { data: addData, setData: setAddData, post: postAdd, reset: resetAdd, errors: addErrors, processing: addProcessing } = useForm({
        name: '',
        code: '',
        color: '#3B82F6',
        semester: 1,
        is_active: true,
    });

    const { data: editData, setData: setEditData, put: putEdit, reset: resetEdit, errors: editErrors, processing: editProcessing } = useForm({
        name: '',
        code: '',
        color: '',
        semester: 1,
        is_active: true,
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        postAdd(route('settings.subjects.store'), {
            onSuccess: () => {
                resetAdd();
                setIsAdding(false);
            }
        });
    };

    const startEditing = (subject) => {
        setEditingId(subject.id);
        setEditData({
            name: subject.name,
            code: subject.code || '',
            color: subject.color,
            semester: subject.semester,
            is_active: subject.is_active,
        });
    };

    const handleEditSubmit = (e, id) => {
        e.preventDefault();
        putEdit(route('settings.subjects.update', id), {
            onSuccess: () => {
                setEditingId(null);
                resetEdit();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this subject? Ensure no tickets are attached to it.')) {
            router.delete(route('settings.subjects.destroy', id));
        }
    };

    const handleArchiveAll = () => {
        if (confirm('Are you sure you want to archive all subjects? This typically marks the end of a semester.')) {
            router.post(route('settings.subjects.bulk'), { action: 'archive_all' });
        }
    };

    const PRESET_COLORS = [
        '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', 
        '#F97316', '#EAB308', '#22C55E', '#14B8A6'
    ];

    return (
        <AppLayout title="Subject Settings">
            <Head title="Subject Settings" />

            <div className="max-w-4xl mx-auto py-[var(--space-6)]">
                <div className="flex justify-between items-center mb-[var(--space-8)] border-b border-[var(--border-default)] pb-[var(--space-4)]">
                    <div>
                        <h1 className="text-[var(--text-title)] font-semibold text-[var(--text-primary)]">Manage Subjects</h1>
                        <p className="text-[var(--text-body)] text-[var(--text-secondary)] mt-1">Add, edit, or archive your courses and projects.</p>
                    </div>
                    <Button onClick={handleArchiveAll} variant="outline" className="border-[var(--accent-orange)] text-[var(--accent-orange)] hover:bg-[var(--accent-orange-soft)]">
                        <Archive className="w-4 h-4 mr-2" /> Start New Semester
                    </Button>
                </div>

                {/* Add New Subject */}
                {!isAdding ? (
                    <Button onClick={() => setIsAdding(true)} className="mb-[var(--space-6)] bg-[var(--accent-blue)] text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Subject
                    </Button>
                ) : (
                    <div className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5 mb-[var(--space-6)] shadow-sm animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-[var(--text-heading)] font-semibold text-[var(--text-primary)] mb-4">New Subject</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name <span className="text-[var(--accent-red)]">*</span></Label>
                                    <Input id="name" value={addData.name} onChange={e => setAddData('name', e.target.value)} placeholder="e.g. Data Structures" required />
                                    {addErrors.name && <p className="text-[var(--accent-red)] text-[var(--text-tiny)]">{addErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Course Code</Label>
                                    <Input id="code" value={addData.code} onChange={e => setAddData('code', e.target.value)} placeholder="e.g. CS201" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Color <span className="text-[var(--accent-red)]">*</span></Label>
                                    <div className="flex gap-2 flex-wrap mt-1">
                                        {PRESET_COLORS.map(c => (
                                            <button 
                                                key={c} 
                                                type="button" 
                                                onClick={() => setAddData('color', c)}
                                                className={cn("w-8 h-8 rounded-full border-2 transition-transform", addData.color === c ? "border-white scale-110 shadow-glow" : "border-transparent opacity-70 hover:opacity-100")}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                    {addErrors.color && <p className="text-[var(--accent-red)] text-[var(--text-tiny)]">{addErrors.color}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="semester">Semester <span className="text-[var(--accent-red)]">*</span></Label>
                                        <Input id="semester" type="number" min="1" max="14" value={addData.semester} onChange={e => setAddData('semester', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="opacity-0">Active</Label>
                                        <div className="flex items-center space-x-2 h-10">
                                            <Checkbox id="is_active" checked={addData.is_active} onCheckedChange={c => setAddData('is_active', c)} />
                                            <label htmlFor="is_active" className="text-[var(--text-label)] cursor-pointer">Active</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                                <Button type="submit" disabled={addProcessing} className="bg-[var(--accent-blue)] text-white">Save Subject</Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Subjects List */}
                <div className="space-y-3">
                    {subjects.length === 0 ? (
                        <p className="text-[var(--text-secondary)] text-center py-8">No subjects created yet.</p>
                    ) : (
                        subjects.map(subject => (
                            <div key={subject.id} className="bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden transition-colors hover:border-[var(--border-strong)]">
                                {editingId === subject.id ? (
                                    <form onSubmit={(e) => handleEditSubmit(e, subject.id)} className="p-5 animate-in fade-in">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input value={editData.name} onChange={e => setEditData('name', e.target.value)} required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Code</Label>
                                                <Input value={editData.code} onChange={e => setEditData('code', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Color</Label>
                                                <div className="flex gap-2 flex-wrap mt-1">
                                                    {PRESET_COLORS.map(c => (
                                                        <button 
                                                            key={c} 
                                                            type="button" 
                                                            onClick={() => setEditData('color', c)}
                                                            className={cn("w-7 h-7 rounded-full border-2 transition-transform", editData.color === c ? "border-white scale-110 shadow-glow" : "border-transparent opacity-70 hover:opacity-100")}
                                                            style={{ backgroundColor: c }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Semester</Label>
                                                    <Input type="number" min="1" max="14" value={editData.semester} onChange={e => setEditData('semester', e.target.value)} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="opacity-0">Active</Label>
                                                    <div className="flex items-center space-x-2 h-10">
                                                        <Checkbox id={`edit_active_${subject.id}`} checked={editData.is_active} onCheckedChange={c => setEditData('is_active', c)} />
                                                        <label htmlFor={`edit_active_${subject.id}`} className="text-[var(--text-label)] cursor-pointer">Active</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 border-t border-[var(--border-default)] pt-4">
                                            <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                            <Button type="submit" disabled={editProcessing} className="bg-[var(--accent-blue)] text-white">Update Subject</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className={cn("p-4 flex items-center justify-between", !subject.is_active && "opacity-60")}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-white" style={{ backgroundColor: subject.color }}>
                                                {subject.code ? subject.code.substring(0, 2) : <BookOpen className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-[var(--text-body)] font-medium text-[var(--text-primary)]">{subject.name}</h4>
                                                    {!subject.is_active && (
                                                        <span className="text-[var(--text-tiny)] border border-[var(--border-default)] text-[var(--text-tertiary)] px-1.5 py-0.5 rounded-[var(--radius-sm)] uppercase tracking-wider">
                                                            Archived
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[var(--text-caption)] text-[var(--text-secondary)]">
                                                    {subject.code && <span className="mr-2 font-mono">{subject.code}</span>}
                                                    Semester {subject.semester}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [&:hover]:opacity-100" style={{opacity: 1}}>
                                            <Button variant="ghost" size="sm" onClick={() => startEditing(subject)} className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)]">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(subject.id)} className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)]">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
