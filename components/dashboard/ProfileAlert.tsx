import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function ProfileAlert() {
  return (
    <div className="bg-surface border border-error/20 rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-error" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary">Your profile is incomplete</h2>
          <p className="text-sm text-text-secondary mt-0.5">Complete your profile to get more accurate job matches.</p>
        </div>
      </div>
      <Link 
        href="/profile" 
        className="px-6 py-2.5 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent-dark transition-colors"
      >
        Complete Profile
      </Link>
    </div>
  );
}
