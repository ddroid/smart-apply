import { CloudUpload, FileText } from "lucide-react";

export function ResumeSection() {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full max-w-3xl mx-auto mb-6">
      <h2 className="text-base font-bold text-text-primary mb-1">Resume</h2>
      <p className="text-sm text-text-secondary mb-6">
        Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
      </p>

      <div className="border-2 border-dashed border-border-light rounded-xl p-8 flex flex-col items-center justify-center bg-surface-secondary/30 mb-6 transition-colors hover:bg-surface-secondary/50 cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mb-4">
          <CloudUpload className="w-6 h-6 text-accent" />
        </div>
        <p className="text-sm font-bold text-text-primary mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-text-muted mb-4">
          PDF formatting only. Maximum file size 5MB.
        </p>
        <button className="bg-transparent border border-border-light text-accent rounded-full px-6 py-2.5 text-sm font-medium hover:bg-accent-light transition-colors">
          Select Resume
        </button>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-text-secondary">
          Need a fresh document based on the fields below?
        </p>
        <button className="bg-accent text-accent-foreground rounded-full px-6 py-2.5 text-sm font-medium hover:bg-accent-dark transition-colors flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate Resume from Profile
        </button>
      </div>
    </div>
  );
}
