import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Search,
  HardDrive,
  Trash2,
  FileText,
  Star,
  ShieldCheck,
  CheckCircle2,
  Folder,
  Sliders,
  Maximize2,
  PenTool,
  Lock,
} from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
  onLearnDevelopment: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onGetStarted,
  onExploreFeatures,
  onLearnDevelopment,
}) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-slate-100/40">
      {/* Background radial accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-amber-100/30 to-blue-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Development Notification Pill (Section 5) */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-200 text-amber-900 text-xs shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold">Development Preview Active</span>
            <span className="text-amber-400">•</span>
            <button
              onClick={onLearnDevelopment}
              className="text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Learn about development status →
            </button>
          </div>
        </div>

        {/* Main Headline & Supporting copy */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 text-balance leading-[1.12]">
            Your PDFs.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600">
              All in one place.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal text-balance">
            Create, organize, edit, manage, and recover your PDF documents from one simple web
            workspace. No desktop installations required.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Get Started with Early Access</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              Explore Planned Features
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              In-browser processing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Private user library
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Recovery Vault protection
            </span>
          </div>
        </div>

        {/* Development Status Banner Box (Section 5) */}
        <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 rounded-2xl border border-amber-200/90 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  PDF Studio is currently in development
                </span>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                  Beta
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                We&apos;re building a complete web-based PDF workspace designed to make working with
                documents simpler. You can preview and test working core tools in the development version today.
              </p>
            </div>
          </div>
          <button
            onClick={onLearnDevelopment}
            className="shrink-0 px-3.5 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Roadmap & Status
          </button>
        </div>

        {/* Product Mockup (Section 4) */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          {/* Mockup Outer Card */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 overflow-hidden ring-1 ring-slate-900/5">
            {/* Mockup Window Chrome Bar */}
            <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-4 w-px bg-slate-200 mx-2" />
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  pdfstudio.app/workspace
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Product Preview — Coming in PDF Studio
                </span>
              </div>
            </div>

            {/* Mockup Simulated Application Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px] bg-slate-50/60">
              {/* Simulated Sidebar */}
              <div className="hidden md:block md:col-span-3 bg-white border-r border-slate-200 p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    PS
                  </div>
                  <span className="font-bold text-xs text-slate-800">My Workspace</span>
                </div>

                <div className="space-y-1 text-xs font-medium text-slate-600">
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-semibold">
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> All Documents
                    </span>
                    <span className="text-[10px] bg-rose-100 px-1.5 py-0.5 rounded">12</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
                    <Star className="w-3.5 h-3.5 text-amber-500" /> Favorites
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
                    <Folder className="w-3.5 h-3.5 text-blue-500" /> Client Contracts
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
                    <Folder className="w-3.5 h-3.5 text-emerald-500" /> Invoices 2026
                  </div>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
                    <span className="flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" /> Recovery Vault
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">30d</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">Vault Meter</div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-rose-600 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>14.2 MB used</span>
                    <span>1.0 GB</span>
                  </div>
                </div>
              </div>

              {/* Simulated Main Dashboard Content */}
              <div className="md:col-span-9 p-5 sm:p-6 space-y-5">
                {/* Search & Action bar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      disabled
                      placeholder="Search documents, tags, or content..."
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs shadow-xs">
                      + New PDF
                    </span>
                  </div>
                </div>

                {/* Quick Tools Carousel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
                    <div className="w-7 h-7 mx-auto rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1 text-xs font-bold">
                      ☍
                    </div>
                    <span className="text-xs font-bold text-slate-800">Merge</span>
                    <p className="text-[10px] text-slate-400">Combine files</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
                    <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 text-xs font-bold">
                      ✂
                    </div>
                    <span className="text-xs font-bold text-slate-800">Split</span>
                    <p className="text-[10px] text-slate-400">Extract pages</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
                    <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 text-xs font-bold">
                      ✍
                    </div>
                    <span className="text-xs font-bold text-slate-800">Sign</span>
                    <p className="text-[10px] text-slate-400">Add signature</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
                    <div className="w-7 h-7 mx-auto rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1 text-xs font-bold">
                      ⇲
                    </div>
                    <span className="text-xs font-bold text-slate-800">Compress</span>
                    <p className="text-[10px] text-slate-400">Optimize size</p>
                  </div>
                </div>

                {/* Simulated Documents Grid */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
                    <span>Recent Library Documents</span>
                    <span className="text-[11px] text-rose-600 font-semibold cursor-pointer">
                      View All (12)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Doc 1 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="aspect-4/3 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 border border-slate-100">
                        <FileText className="w-8 h-8 text-rose-500" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block truncate">
                          Q3 Financial Report.pdf
                        </span>
                        <span className="text-[10px] text-slate-400">8 pages • 1.2 MB</span>
                      </div>
                    </div>

                    {/* Doc 2 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="aspect-4/3 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 border border-slate-100">
                        <FileText className="w-8 h-8 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block truncate">
                          Master Service Agreement.pdf
                        </span>
                        <span className="text-[10px] text-slate-400">4 pages • 340 KB</span>
                      </div>
                    </div>

                    {/* Doc 3 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="aspect-4/3 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 border border-slate-100">
                        <FileText className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block truncate">
                          Product Architecture 2026.pdf
                        </span>
                        <span className="text-[10px] text-slate-400">14 pages • 4.6 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Overlay */}
          <div className="mt-4 text-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors cursor-pointer border border-rose-200/60"
            >
              <span>Launch Live Development Workspace to test tools now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
