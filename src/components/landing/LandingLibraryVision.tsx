import React from 'react';
import {
  Folder,
  Star,
  Trash2,
  FileText,
  Search,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const LandingLibraryVision: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  return (
    <section id="library-vision" className="py-24 bg-slate-900 text-white scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              The Workspace Vision
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Stop losing track of your PDFs.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              PDF Studio is designed to remember the documents you create and upload, so you
              don&apos;t have to repeatedly search through downloads folders or recreate old files.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block">Automatic Library Storage</span>
                  <span className="text-xs text-slate-400">
                    Outputs from merge, split, compress, and sign operations are saved instantly.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block">Tagging & Folder Structuring</span>
                  <span className="text-xs text-slate-400">
                    Keep tax invoices, client agreements, and project notes separated.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block">Duplicate Checksum Prevention</span>
                  <span className="text-xs text-slate-400">
                    SHA-256 duplicate detection warns you before saving unnecessary copies.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onEnterApp}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
              >
                <span>Preview the Workspace Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Dashboard Mockup Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-700 bg-slate-800/90 shadow-2xl p-6 sm:p-7 space-y-6 relative ring-1 ring-white/10">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">Personal PDF Library</span>
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Product Vision
                </span>
              </div>

              {/* Mockup Library View */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold text-white">My PDFs (4 documents)</span>
                  <span className="text-slate-400">Sorted by Newest</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                    <div className="flex items-start justify-between">
                      <FileText className="w-5 h-5 text-rose-400" />
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block truncate">
                        Project Report.pdf
                      </span>
                      <span className="text-[10px] text-slate-400">12 pages • 2.4 MB</span>
                    </div>
                    <span className="inline-block text-[9px] font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded">
                      Client
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                    <div className="flex items-start justify-between">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block truncate">
                        Invoice.pdf
                      </span>
                      <span className="text-[10px] text-slate-400">2 pages • 180 KB</span>
                    </div>
                    <span className="inline-block text-[9px] font-bold text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded">
                      Finance
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                    <div className="flex items-start justify-between">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block truncate">
                        Resume.pdf
                      </span>
                      <span className="text-[10px] text-slate-400">1 page • 95 KB</span>
                    </div>
                    <span className="inline-block text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                      Personal
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                    <div className="flex items-start justify-between">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block truncate">
                        Research Paper.pdf
                      </span>
                      <span className="text-[10px] text-slate-400">24 pages • 8.1 MB</span>
                    </div>
                    <span className="inline-block text-[9px] font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">
                      Notes
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                <span>✓ Saved automatically to PDF Studio</span>
                <span className="text-slate-400">Recovery Vault Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
