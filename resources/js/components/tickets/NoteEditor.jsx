import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function NoteEditor({ 
    initialValue = '', 
    onSubmit, 
    onCancel = null, 
    isSubmitting = false,
    placeholder = 'Add a detail, log an update, or clarify the issue... (Markdown supported)'
}) {
    const [body, setBody] = useState(initialValue);
    const [activeTab, setActiveTab] = useState('write');

    // Reset local state if initialValue changes drastically (e.g. after successful post where parent clears it)
    useEffect(() => {
        if (!isSubmitting) {
            setBody(initialValue);
        }
    }, [initialValue, isSubmitting]);

    const handleSubmit = () => {
        if (!body.trim() || isSubmitting) return;
        onSubmit(body);
    };

    return (
        <div className="border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--bg-raised)] focus-within:border-[var(--border-strong)] transition-colors">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between border-b border-[var(--border-default)] px-2 py-1 bg-[var(--bg-overlay)]">
                    <TabsList className="bg-transparent text-sm gap-2">
                        <TabsTrigger 
                            value="write" 
                            className="data-[state=active]:bg-[var(--bg-surface)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-none px-3 py-1.5 rounded-[var(--radius-md)]"
                        >
                            Write
                        </TabsTrigger>
                        <TabsTrigger 
                            value="preview" 
                            className="data-[state=active]:bg-[var(--bg-surface)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-none px-3 py-1.5 rounded-[var(--radius-md)]"
                        >
                            Preview
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="p-3">
                    <TabsContent value="write" className="mt-0">
                        <Textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder={placeholder}
                            disabled={isSubmitting}
                            className="min-h-[120px] resize-y border-0 focus-visible:ring-0 p-0 text-[var(--text-body)] placeholder:text-[var(--text-tertiary)] bg-transparent"
                        />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-0 min-h-[120px] prose prose-invert prose-blue max-w-none text-[var(--text-body)]">
                        {body.trim() ? (
                            <div className="markdown-preview max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {body}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-[var(--text-tertiary)] italic">Nothing to preview. Try writing some markdown!</p>
                        )}
                    </TabsContent>
                </div>

                <div className="flex items-center justify-between p-3 border-t border-[var(--border-default)] bg-[var(--bg-base)]">
                    <div className="text-[var(--text-tiny)] text-[var(--text-tertiary)] flex gap-4">
                        <span className="hidden sm:inline-block">Supports Markdown <strong>**bold**</strong>, <em>*italic*</em>, <code>`code`</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                        {onCancel && (
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button 
                            type="button" 
                            size="sm" 
                            className="bg-[var(--accent-blue)] text-white hover:opacity-90"
                            disabled={!body.trim() || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save Note
                        </Button>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
