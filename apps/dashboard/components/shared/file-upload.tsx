"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Upload, X, FileText, CheckCircle2, 
    Loader2, AlertCircle, FileIcon 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
    onUpload?: (files: File[]) => void;
    maxFiles?: number;
    plan?: "free" | "pro" | "team";
}

const LIMITS = {
    free: 10 * 1024 * 1024,
    pro: 50 * 1024 * 1024,
    team: 100 * 1024 * 1024,
};

const ALLOWED_EXTS = [
    "pdf", "docx", "txt", "md", "csv", "xlsx", 
    "py", "js", "ts", "jsx", "tsx", "json", "yaml"
];

export function FileUpload({ onUpload, maxFiles = 3, plan = "free" }: FileUploadProps) {
    const [files, setFiles] = useState<{ file: File; progress: number; preview?: string }[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (newFiles: FileList | File[]) => {
        const fileList = Array.from(newFiles);
        
        if (files.length + fileList.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed`);
            return;
        }

        const validFiles = fileList.filter(file => {
            const ext = file.name.split(".").pop()?.toLowerCase();
            if (!ext || !ALLOWED_EXTS.includes(ext)) {
                toast.error(`Unsupported file type: ${file.name}`);
                return false;
            }
            if (file.size > LIMITS[plan]) {
                toast.error(`File too large: ${file.name} (Max ${plan === "free" ? "10MB" : plan === "pro" ? "50MB" : "100MB"})`);
                return false;
            }
            return true;
        });

        const updatedFiles = [
            ...files,
            ...validFiles.map(file => ({ file, progress: 0 }))
        ];
        
        setFiles(updatedFiles);

        // Mock upload progress
        validFiles.forEach(file => {
            simulateUpload(file);
        });
    };

    const simulateUpload = (file: File) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                // Mock extracted text preview after "upload"
                setFiles(prev => prev.map(f => f.file === file ? { 
                    ...f, 
                    progress: 100,
                    preview: "Extracted metadata: Project proposal for Q3 marketing sprint. Key objectives include 20% growth in organic traffic through automated agent-led SEO optimizations..."
                } : f));
            } else {
                setFiles(prev => prev.map(f => f.file === file ? { ...f, progress } : f));
            }
        }, 300);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
                }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm font-medium">Drag & drop or click to upload</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {ALLOWED_EXTS.join(", ").toUpperCase()} (Max {LIMITS[plan] / (1024 * 1024)}MB)
                    </p>
                </div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                    >
                        {files.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group relative rounded-lg border bg-card p-3 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-1 overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <span className="truncate text-xs font-medium">{item.file.name}</span>
                                            <button 
                                                onClick={() => removeFile(i)}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <Progress value={item.progress} className="h-1" />
                                        
                                        {item.progress === 100 && item.preview && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-2 rounded bg-muted/50 p-2"
                                            >
                                                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
                                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                    Extracted Preview
                                                </div>
                                                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                                    {item.preview}
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
