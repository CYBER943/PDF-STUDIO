import React from 'react';
import {
  FileUp,
  Sliders,
  BookmarkCheck,
  Search,
  ArrowRight,
} from 'lucide-react';

export const LandingHowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Create or Upload',
      subtitle: 'Start with blank documents or import',
      desc: 'Drag and drop any PDF file or build a document from scratch with customizable page layouts and orientations.',
      icon: <FileUp className="w-5 h-5 text-rose-600" />,
      color: 'border-rose-200 bg-rose-50/50',
    },
    {
      num: '02',
      title: 'Work With It',
      subtitle: 'In-browser tool suite',
      desc: 'Merge files, extract pages, sign agreements, add watermarks, compress sizes, or draw highlights right on the page.',
      icon: <Sliders className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-200 bg-blue-50/50',
    },
    {
      num: '03',
      title: 'Save to Your Library',
      subtitle: 'Automatic persistent storage',
      desc: 'Signed-in users never need to manually re-upload. Output PDFs automatically save to their private document library.',
      icon: <BookmarkCheck className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50/50',
    },
    {
      num: '04',
      title: 'Find It Again',
      subtitle: 'Instant search & Recovery Vault',
      desc: 'Locate files instantly with title and tag search, organize folders, or restore deleted files before retention expiry.',
      icon: <Search className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/50',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-b border-slate-200/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Simple Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How PDF Studio works.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From creation to long-term recovery, PDF Studio bridges the gap between single-use web
            utilities and desktop document management software.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-5 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-slate-300">
                    {step.num}
                  </span>
                  <div className={`p-2.5 rounded-2xl border ${step.color}`}>
                    {step.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <div className="text-xs font-semibold text-rose-600 mb-2">
                    {step.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Phase {step.num}</span>
                <span className="font-semibold text-slate-500">Fast & Private</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
