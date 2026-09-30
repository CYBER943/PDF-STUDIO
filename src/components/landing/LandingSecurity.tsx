import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  KeyRound,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export const LandingSecurity: React.FC = () => {
  const securityPillars = [
    {
      icon: <Lock className="w-5 h-5 text-rose-600" />,
      title: 'User-Specific Isolation',
      desc: 'Strict multi-tenant partitioning ensures no user can ever access or query another user’s PDF records.',
    },
    {
      icon: <EyeOff className="w-5 h-5 text-blue-600" />,
      title: 'Zero AI Document Training',
      desc: 'Your documents are never indexed, analyzed, or shared to train public or private artificial intelligence models.',
    },
    {
      icon: <KeyRound className="w-5 h-5 text-amber-600" />,
      title: 'Private Encrypted Partitions',
      desc: 'Stored files reside in private storage buckets with temporary signed URLs that expire automatically.',
    },
    {
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
      title: 'Cryptographic SHA-256 Checksums',
      desc: 'Every file is fingerprinted at the byte level to prevent accidental duplicate uploads and verify integrity.',
    },
    {
      icon: <Server className="w-5 h-5 text-indigo-600" />,
      title: 'In-Browser Processing Engine',
      desc: 'Core operations like splitting, merging, rotating, and watermarking execute directly inside your browser memory.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      title: 'Irrevocable Deletion Control',
      desc: 'When you purge a document or request account deletion, data is completely expunged with zero retention.',
    },
  ];

  return (
    <section id="security" className="py-24 bg-slate-50/70 border-b border-slate-200/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Security & Privacy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed with privacy and security in mind.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We avoid marketing slogans like &quot;unhackable&quot; or &quot;100% immune&quot;. Instead,
            we engineer concrete architectural boundaries so you remain the sole owner of your documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
