"use client";

import { useState, useRef } from "react";
import { CloudUpload, FileText, Loader2, Sparkles, CheckCircle2, Download } from "lucide-react";
import { insforge } from "@/lib/insforge-client";
import { saveResumeUrl } from "@/actions/profile";

interface ResumeSectionProps {
  hasResume: boolean;
  resumeUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  onExtractSuccess: (data: any) => void;
}

export function ResumeSection({ hasResume, resumeUrl, onUploadSuccess, onExtractSuccess }: ResumeSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [extractError, setExtractError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  


  const processFile = async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are supported.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be under 5MB.");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      const { data: { user } } = await insforge.auth.getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const filePath = `${user.id}/resume-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.pdf`;
      
      // Delete old file if exists
      if (resumeUrl) {
        const urlParts = resumeUrl.split('/resumes/objects/');
        if (urlParts.length >= 2) {
          const oldFilePath = decodeURIComponent(urlParts[1]);
          await insforge.storage.from("resumes").remove(oldFilePath as any);
        }
      }

      const { error: uploadErr } = await insforge.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadErr) throw uploadErr;

      const publicUrl = insforge.storage
        .from("resumes")
        .getPublicUrl(filePath);

      // Save the URL to the profile via server action
      const result = await saveResumeUrl(publicUrl);
        
      if (!result.success) throw new Error(result.error);

      onUploadSuccess(publicUrl);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload resume.");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isUploading) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resumeUrl) return;

    try {
      const urlParts = resumeUrl.split('/resumes/objects/');
      if (urlParts.length < 2) throw new Error("Invalid resume URL format");
      
      const filePath = decodeURIComponent(urlParts[1]);
      
      const { data, error } = await insforge.storage.from("resumes").download(filePath);
      if (error || !data) throw error || new Error("Failed to download");

      const blobUrl = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error: any) {
      console.error("Download failed:", error);
      // Fallback: try opening it anyway
      window.open(resumeUrl, '_blank');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError("");

    try {
      const res = await fetch("/api/resume/generate", { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to generate resume.");
      }

      onUploadSuccess(json.resume_pdf_url);
    } catch (err: any) {
      setGenerateError(err.message || "Failed to generate resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtract = async () => {
    setIsExtracting(true);
    setExtractError("");

    try {
      const res = await fetch("/api/resume/extract", { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Extraction failed.");
      }

      onExtractSuccess(json.data);
    } catch (err: any) {
      setExtractError(err.message || "Failed to extract resume data.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full max-w-3xl mx-auto mb-6">
      <h2 className="text-base font-bold text-text-primary mb-1">Resume</h2>
      <p className="text-sm text-text-secondary mb-6">
        Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
      </p>

      {uploadError && (
        <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
          {uploadError}
        </div>
      )}
      
      {extractError && (
        <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
          {extractError}
        </div>
      )}

      {generateError && (
        <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
          {generateError}
        </div>
      )}

      <div 
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center mb-6 transition-colors ${
          isUploading 
            ? 'border-accent/50 opacity-70 bg-surface-secondary/30' 
            : isDragging 
              ? 'border-accent bg-accent/5 cursor-pointer' 
              : 'border-border-light hover:bg-surface-secondary/50 bg-surface-secondary/30 cursor-pointer'
        }`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="application/pdf" 
          className="hidden" 
        />
        
        <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mb-4">
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          ) : hasResume ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <CloudUpload className="w-6 h-6 text-accent" />
          )}
        </div>
        
        <p className="text-sm font-bold text-text-primary mb-1">
          {isUploading ? "Uploading..." : hasResume ? "Resume Uploaded" : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-text-muted mb-4">
          {hasResume ? "Click to replace. PDF formatting only. Max 5MB." : "PDF formatting only. Maximum file size 5MB."}
        </p>
        
        <button 
          disabled={isUploading}
          className="bg-transparent border border-border-light text-accent rounded-full px-6 py-2.5 text-sm font-medium hover:bg-accent-light transition-colors disabled:opacity-50"
        >
          {hasResume ? "Replace Resume" : "Select Resume"}
        </button>
      </div>

      {hasResume && (
        <div className="bg-accent-light/30 border border-accent/20 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-text-primary mb-0.5">Resume ready for extraction</p>
            <p className="text-xs text-text-secondary">Let AI read your PDF and auto-fill the form fields below.</p>
          </div>
          <button 
            onClick={handleExtract}
            disabled={isExtracting}
            className="shrink-0 bg-accent text-accent-foreground rounded-full px-5 py-2 text-sm font-medium hover:bg-accent-dark transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Extracting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Extract from Resume
              </>
            )}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border-light">
        <p className="text-sm text-text-secondary">
          Need a fresh document based on the fields below?
        </p>
        <div className="flex gap-2">
          {resumeUrl && (
            <button 
              onClick={handleDownload}
              className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-surface-secondary text-text-primary border border-border rounded-full px-6 py-2.5 text-sm font-medium hover:bg-border-light transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-text-muted" />
            )}
            {isGenerating ? "Generating..." : "Generate PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
