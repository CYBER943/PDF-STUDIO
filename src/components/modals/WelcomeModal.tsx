import React from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoadmap: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenRoadmap,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-white to-amber-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 font-bold text-sm">
              PS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Welcome to PDF Studio</h2>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                  BETA
                </span>
              </div>
              <p className="text-xs text-slate-500">Your personal PDF workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Section 14) */}
        <div className="p-6 space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
            <p className="font-semibold text-slate-900 text-sm">
              You&apos;re entering the development version of PDF Studio.
            </p>
            <p className="text-slate-600">
              Some features are still being built and may change as development continues. Core
              tools like creating, merging, splitting, signing, and the Recovery Vault are fully operational.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Automatic Saving:</strong> Every PDF created or modified is saved to your private library.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Recovery Vault:</strong> Deleted files are protected by a configurable retention period.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Backup Recommendation:</strong> Please keep copies of critical documents during beta.
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions (Section 14) */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRoadmap();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            What&apos;s coming next?
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Enter PDF Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
