import React, { useState } from 'react';
import { File, Download, Trash2, Image as ImageIcon, FileText, FileArchive, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';

const getFileIcon = (mimeType) => {
    if (!mimeType) return File;
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('compressed')) return FileArchive;
    return File;
};

export default function AttachmentList({ attachments, ticketId }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this file permanently?')) return;
        
        setDeletingId(id);
        router.delete(route('tickets.attachments.destroy', { ticket: ticketId, ticket_attachment: id }), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null)
        });
    };

    if (!attachments || attachments.length === 0) {
        return (
            <div className="py-8 text-center text-[var(--text-secondary)] border border-dashed border-[var(--border-default)] rounded-[var(--radius-lg)] bg-[var(--bg-base)] mt-6">
                <p>No files attached yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {attachments.map((file) => {
                const Icon = getFileIcon(file.mime_type);
                const isImage = file.mime_type?.startsWith('image/');
                
                return (
                    <div key={file.id} className="group relative border border-[var(--border-default)] bg-[var(--bg-raised)] rounded-[var(--radius-lg)] p-3 flex items-start gap-3 hover:border-[var(--border-strong)] transition-colors">
                        <div className={`w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0 ${isImage ? 'bg-[var(--accent-orange-soft)] text-[var(--accent-orange)]' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'}`}>

                            <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-8">
                            <h4 className="text-[var(--text-label)] text-[var(--text-primary)] font-medium truncate" title={file.file_name}>
                                {file.file_name}
                            </h4>
                            <p className="text-[var(--text-tiny)] text-[var(--text-tertiary)]">
                                {(file.file_size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>

                        <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 [&:hover]:opacity-100" style={{opacity: 1}}>
                            <a 
                                href={route('tickets.attachments.download', { ticket: ticketId, ticket_attachment: file.id })}
                                className="p-1.5 bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-orange)] rounded hover:bg-[var(--bg-overlay)] transition-colors"
                title="Download"
                                download
                            >
                                <Download className="w-4 h-4" />
                            </a>
                            <button 
                                onClick={() => handleDelete(file.id)}
                                disabled={deletingId === file.id}
                                className="p-1.5 bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-red)] rounded hover:bg-[var(--accent-red-soft)] transition-colors"
                                title="Delete"
                            >
                                {deletingId === file.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
