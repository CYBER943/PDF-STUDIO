import React from 'react';
import {
  Trash2,
  Clock,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const LandingRecovery: React.FC = () => {
  return (
    <section className="py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Recovery Vault
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Deleted doesn&apos;t have to mean immediately gone.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Accidental deletions happen. With PDF Studio, deleted documents are held safely in your
            Recovery Vault and can be restored at any point during your configured retention window.
          </p>
        </div>

        {/* Visual Deletion Lifecycle Flow (Section 11) */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400">
            Transparent Document Deletion Lifecycle
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900">Active PDF</h4>
              <p className="text-[11px] text-slate-500">Accessible in your active library partition.</p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900">Moved to Vault</h4>
              <p className="text-[11px] text-slate-500">Hidden from main views, protected from purge.</p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900">Retention Window</h4>
              <p className="text-[11px] text-slate-500">Restorable for 7, 14, 30, 60, or 90 days.</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 mx-auto flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h4 className="text-xs font-bold text-slate-900">Permanent Purge</h4>
              <p className="text-[11px] text-slate-500">Irreversibly erased from primary storage.</p>
            </div>
          </div>

          {/* Honest Transparent Deletion Notice (Section 11 & 16) */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3.5 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">
                Honest Data Recovery Transparency:
              </span>
              <span>
                Files that have passed the configured retention period or have been explicitly
                permanently deleted may no longer be recoverable through PDF Studio. We do not make
                false promises of infinite undelete capabilities.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
