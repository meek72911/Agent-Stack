"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  File,
  X,
  Loader2,
  CheckCircle2,
  Image,
  FileText,
  FileSpreadsheet,
  FileArchive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress?: number;
}

export function FileUploadZone() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-6 w-6" />;
    if (type.includes("pdf")) return <FileText className="h-6 w-6" />;
    if (type.includes("sheet") || type.includes("excel")) return <FileSpreadsheet className="h-6 w-6" />;
    if (type.includes("zip") || type.includes("archive")) return <FileArchive className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading" as const,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: "completed" as const, progress: 100 } : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress } : f
            )
          );
        }
      }, 200);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all cursor-pointer",
          isDragging
            ? "border-[#F97316] bg-[#F97316]/5"
            : "border-[#1C1F2E] hover:border-[#F97316]/50"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={cn(
              "p-4 rounded-full mb-4",
              isDragging ? "bg-[#F97316]/20" : "bg-[#1C1F2E]"
            )}
          >
            <Upload className={cn("h-8 w-8", isDragging ? "text-[#F97316]" : "text-[#94A3B8]")} />
          </motion.div>
          <p className="text-sm text-[#94A3B8] mb-1">
            <span className="text-[#F97316] font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-[#3F4558]">
            PDF, DOCX, images, spreadsheets up to 100MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0F17] border border-[#1C1F2E]"
            >
              <div className="p-2 rounded bg-[#1C1F2E] text-[#94A3B8]">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#3F4558]">
                    {formatFileSize(file.size)}
                  </span>
                  {file.status === "completed" && (
                    <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  )}
                  {file.status === "uploading" && (
                    <span className="text-xs text-blue-400">
                      {Math.round(file.progress || 0)}%
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                {file.status === "uploading" && (
                  <div className="h-1 bg-[#1C1F2E] rounded-full mt-2">
                    <div
                      className="h-full bg-[#F97316] rounded-full transition-all"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#94A3B8] hover:text-[#F97316]"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Info banner */}
      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
        <div className="flex items-center gap-3">
          <Upload className="h-5 w-5 text-cyan-500" />
          <div>
            <p className="text-sm font-medium">R2 File Storage</p>
            <p className="text-xs text-muted-foreground">
              Files are uploaded to Cloudflare R2 for fast, secure storage and processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
