import React from 'react';
import {
  AlertCircle,
  FileQuestion,
  Download,
  Trash2,
  RefreshCw,
  FolderX,
  SearchX,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const LandingWhy: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const problems = [
    {
      icon: <Download className="w-4 h-4 text-rose-500" />,
      title: 'Scattered in Downloads',
      desc: 'Files get lost among hundreds of temporary downloads, receipts, and installers.',
    },
    {
      icon: <FileQuestion className="w-4 h-4 text-amber-500" />,
      title: 'Tool Fragmentation',
      desc: 'Using one website to merge, another to sign, and a desktop app to compress.',
    },
    {
      icon: <RefreshCw className="w-4 h-4 text-blue-500" />,
      title: 'Recreating Lost Work',
      desc: 'Having to re-merge or re-export documents because earlier versions vanished.',
    },
    {
      icon: <Trash2 className="w-4 h-4 text-red-500" />,
      title: 'Instant Accidental Deletion',
      desc: 'One wrong keystroke permanently deletes a signed agreement or tax invoice.',
    },
    {
      icon: <SearchX className="w-4 h-4 text-purple-500" />,
      title: 'Unsearchable Content',
      desc: 'Unable to remember which generic "document (3).pdf" contains the needed clause.',
    },
    {
      icon: <FolderX className="w-4 h-4 text-slate-500" />,
      title: 'Software Installation Fatigue',
      desc: 'Heavy desktop software with bloated up-sells just to sign or extract a page.',
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            The Fundamental Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            PDF management shouldn&apos;t feel complicated.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every day, millions of professionals waste hours jumping between single-use web tools,
            digging through bloated download directories, and recreating PDFs they already built.
          </p>
        </div>

        {/* 6 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all space-y-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* The PDF Studio Solution Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Persistent Workspace Approach</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              A workspace that remembers what you build.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              PDF Studio is being designed as a persistent PDF workspace where your documents can be
              created, organized, searched, and recovered from one place. When you merge, split, or
              annotate a PDF, it is automatically stored in your personal library for future reuse.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onEnterApp}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Try the Development Version</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-400">
                Create → Save → Organize → Search → Recover
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
