import React, { useRef, useState } from 'react';
import { UploadCloud, File, Loader2, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function AttachmentUploader({ ticketId, noteId = null }) {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        file: null,
        note_id: noteId,
    });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        clearErrors();
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        clearErrors();
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        // Validate size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            setData('file', null);
            alert("File is too large. Maximum size is 10MB.");
            return;
        }
        setData('file', file);
    };

    const handleUpload = () => {
        if (!data.file) return;
        post(route('tickets.attachments.store', ticketId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        });
    };

    return (
        <div className="w-full">
            <div 
                className={`border-2 border-dashed rounded-[var(--radius-lg)] p-6 transition-colors text-center ${
                    dragActive ? 'border-[var(--accent-orange)] bg-[var(--accent-orange-soft)]' : 
                    data.file ? 'border-[var(--border-strong)] bg-[var(--bg-raised)]' :
                    'border-[var(--border-default)] bg-[var(--bg-base)] hover:border-[var(--border-strong)]'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !data.file && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip"
                />

                {data.file ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 p-3 bg-[var(--bg-surface)] rounded-[var(--radius-md)] border border-[var(--border-default)]">
                            <File className="w-5 h-5 text-[var(--accent-orange)]" />
                            <div className="text-left">
                                <p className="text-[var(--text-body)] text-[var(--text-primary)] font-medium max-w-[200px] truncate">
                                    {data.file.name}
                                </p>
                                <p className="text-[var(--text-tiny)] text-[var(--text-tertiary)]">
                                    {(data.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button 
                                type="button" 
                                onClick={(e) => { e.stopPropagation(); setData('file', null); }}
                                className="ml-2 p-1 text-[var(--text-secondary)] hover:text-[var(--accent-red)] rounded flex-shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                            disabled={processing}
                            className="bg-[var(--accent-orange)] text-white text-sm font-medium py-1.5 px-4 rounded-[var(--radius-md)] flex items-center gap-2 hover:opacity-90 transition-colors disabled:opacity-70"
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                            {processing ? 'Uploading...' : 'Upload File'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <div className="w-12 h-12 bg-[var(--bg-surface)] rounded-full flex items-center justify-center text-[var(--text-secondary)] mb-2">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-[var(--text-body)] text-[var(--text-primary)]">
                            <span className="text-[var(--accent-orange)] font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[var(--text-caption)] text-[var(--text-tertiary)]">
                            PDF, Images, Word, Excel, or ZIP (Max 10MB)
                        </p>
                    </div>
                )}
            </div>
            
            {errors?.file && (
                <p className="text-[var(--text-tiny)] text-[var(--accent-red)] mt-2">{errors.file}</p>
            )}
        </div>
    );
}
