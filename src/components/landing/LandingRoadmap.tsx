import React from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export const LandingRoadmap: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const phases = [
    {
      phase: 'Phase 1: Foundation',
      status: 'Available in Beta',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      items: [
        'Client-side PDF render engine & viewer',
        'Email & OAuth authentication flows',
        'Private partitioned library storage',
        'SHA-256 duplicate upload prevention',
      ],
    },
    {
      phase: 'Phase 2: Core PDF Tools',
      status: 'Available in Beta',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      items: [
        'Document merger & split page extraction',
        'Compression engine with presets',
        'Signature placement (draw/cursive/stamp)',
        'Watermarks and dynamic page numbering',
        'Password protect & authorized unlock',
      ],
    },
    {
      phase: 'Phase 3: Workspace & Recovery',
      status: 'Available in Beta',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      items: [
        'Color-coded folders & tag categorizations',
        'Debounced title and content search',
        'Recovery Vault with configurable countdown',
        'Visual Page Organizer (drag, rotate, delete)',
        'Document version history tracker',
      ],
    },
    {
      phase: 'Phase 4: Advanced Capabilities',
      status: 'In Development',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      items: [
        'Supabase cloud cross-device synchronization',
        'Client-side Tesseract OCR text recognition',
        'Temporary time-restricted document share links',
        'Encrypted backup export & account migration',
      ],
    },
    {
      phase: 'Phase 5: Future Vision',
      status: 'Planned',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      items: [
        'Privacy-first AI document summaries',
        'Form field auto-detection & filling',
        'Real-time collaborative PDF annotations',
        'Enterprise RBAC & organization workspaces',
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-24 bg-white border-b border-slate-200/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Development Roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How PDF Studio is being built.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We believe in complete transparency. Rather than promising unverified features, here is
            our exact development progress from working foundation to future releases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{p.phase}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeClass}`}
                  >
                    {p.status}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600">
                  {p.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-400 font-medium">
                {p.status === 'Available in Beta' ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Working in dev build
                  </span>
                ) : p.status === 'In Development' ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Under active development
                  </span>
                ) : (
                  <span>Scheduled for future iteration</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <span>Test the Available Beta Tools Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
