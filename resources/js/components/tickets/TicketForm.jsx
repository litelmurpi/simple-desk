import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { PriorityIndicator } from './PriorityIndicator';

export function TicketForm({ ticket = null, subjects = [], tags = [], className }) {
    const isEdit = !!ticket;
    
    const { data, setData, post, patch, processing, errors } = useForm({
        title: ticket?.title || '',
        description: ticket?.description || '',
        type: ticket?.type || 'todo',
        priority: ticket?.priority || 'medium',
        status: ticket?.status || 'open',
        subject_id: ticket?.subject_id ? String(ticket.subject_id) : 'none',
        deadline_at: ticket?.deadline_at ? ticket.deadline_at.split('T')[0] : '', // simple date input for now
        tags: ticket?.tags?.map(t => t.id) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert "none" to empty string for backend validation
        const submitData = { ...data };
        if (submitData.subject_id === 'none') {
            submitData.subject_id = '';
        }

        if (isEdit) {
            patch(route('tickets.update', ticket.id), { data: submitData });
        } else {
            post(route('tickets.store'), { data: submitData });
        }
    };

    const toggleTag = (id) => {
        setData('tags', data.tags.includes(id) 
            ? data.tags.filter(t => t !== id) 
            : [...data.tags, id]
        );
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-[var(--space-6)]", className)}>
            <div className="space-y-[var(--space-2)]">
                <Label htmlFor="title" className="text-[var(--text-label)]">Issue Title <span className="text-[var(--accent-red)]">*</span></Label>
                <Input 
                    id="title" 
                    value={data.title} 
                    onChange={e => setData('title', e.target.value)} 
                    placeholder="E.g. Fix login bug or Finish assignment"
                    className="bg-[var(--bg-surface)] border-[var(--border-default)] focus-visible:ring-[var(--accent-orange)]"
                />
                {errors.title && <p className="text-[var(--text-caption)] text-[var(--accent-red)]">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
                <div className="space-y-[var(--space-2)]">
                    <Label className="text-[var(--text-label)]">Issue Type <span className="text-[var(--accent-red)]">*</span></Label>
                    <Select value={data.type} onValueChange={val => setData('type', val)}>
                        <SelectTrigger className="w-full bg-[var(--bg-surface)] border-[var(--border-default)]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--bg-overlay)] border-[var(--border-default)]">
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="tugas">Tugas Kuliah</SelectItem>
                            <SelectItem value="bug">Bug</SelectItem>
                            <SelectItem value="project">Project Component</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.type && <p className="text-[var(--text-caption)] text-[var(--accent-red)]">{errors.type}</p>}
                </div>

                <div className="space-y-[var(--space-2)]">
                    <Label className="text-[var(--text-label)]">Priority <span className="text-[var(--accent-red)]">*</span></Label>
                    <Select value={data.priority} onValueChange={val => setData('priority', val)}>
                        <SelectTrigger className="w-full bg-[var(--bg-surface)] border-[var(--border-default)]">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--bg-overlay)] border-[var(--border-default)]">
                            <SelectItem value="urgent"><PriorityIndicator priority="urgent" showLabel /></SelectItem>
                            <SelectItem value="high"><PriorityIndicator priority="high" showLabel /></SelectItem>
                            <SelectItem value="medium"><PriorityIndicator priority="medium" showLabel /></SelectItem>
                            <SelectItem value="low"><PriorityIndicator priority="low" showLabel /></SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.priority && <p className="text-[var(--text-caption)] text-[var(--accent-red)]">{errors.priority}</p>}
                </div>
            </div>

            {isEdit && (
                <div className="space-y-[var(--space-2)]">
                    <Label className="text-[var(--text-label)]">Status <span className="text-[var(--accent-red)]">*</span></Label>
                    <Select value={data.status} onValueChange={val => setData('status', val)}>
                        <SelectTrigger className="w-full bg-[var(--bg-surface)] border-[var(--border-default)]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--bg-overlay)] border-[var(--border-default)]">
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
                <div className="space-y-[var(--space-2)]">
                    <Label className="text-[var(--text-label)]">Related Subject</Label>
                    <Select value={data.subject_id} onValueChange={val => setData('subject_id', val)}>
                        <SelectTrigger className="w-full bg-[var(--bg-surface)] border-[var(--border-default)]">
                            <SelectValue placeholder="Select subject (Optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--bg-overlay)] border-[var(--border-default)]">
                            <SelectItem value="none">No Subject</SelectItem>
                            {subjects.map(s => (
                                <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-[var(--space-2)]">
                    <Label className="text-[var(--text-label)]">Deadline</Label>
                    <Input 
                        type="date"
                        value={data.deadline_at}
                        onChange={e => setData('deadline_at', e.target.value)}
                        className="bg-[var(--bg-surface)] border-[var(--border-default)] focus-visible:ring-[var(--accent-orange)] [color-scheme:dark]"
                    />
                     {errors.deadline_at && <p className="text-[var(--text-caption)] text-[var(--accent-red)]">{errors.deadline_at}</p>}
                </div>
            </div>

            <div className="space-y-[var(--space-2)]">
                <Label className="text-[var(--text-label)]">Tags</Label>
                <div className="flex flex-wrap gap-3 p-3 border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--bg-surface)]">
                    {tags.map(tag => (
                        <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`tag-${tag.id}`} 
                                checked={data.tags.includes(tag.id)} 
                                onCheckedChange={() => toggleTag(tag.id)} 
                                className="border-[var(--border-strong)] data-[state=checked]:bg-[var(--accent-orange)] data-[state=checked]:border-[var(--accent-orange)]"
                            />
                            <label
                                htmlFor={`tag-${tag.id}`}
                                className="text-[var(--text-caption)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                            >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></span>
                                {tag.name}
                            </label>
                        </div>
                    ))}
                    {tags.length === 0 && <p className="text-[var(--text-caption)] text-[var(--text-tertiary)]">No tags available.</p>}
                </div>
            </div>

            <div className="space-y-[var(--space-2)]">
                <Label htmlFor="description" className="text-[var(--text-label)]">Description (Markdown Supported)</Label>
                <Textarea 
                    id="description" 
                    value={data.description} 
                    onChange={e => setData('description', e.target.value)} 
                    placeholder="Write details, acceptance criteria, or context here..."
                    className="min-h-[150px] bg-[var(--bg-surface)] border-[var(--border-default)] focus-visible:ring-[var(--accent-orange)]"
                />
            </div>

            <div className="pt-[var(--space-4)] flex justify-end gap-[var(--space-3)]">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => window.history.back()}
                    className="text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={processing}
                    className="bg-[var(--accent-orange)] text-white hover:opacity-90 transition-opacity"
                >
                    {isEdit ? 'Save Changes' : 'Create Ticket'}
                </Button>
            </div>
        </form>
    );
}
