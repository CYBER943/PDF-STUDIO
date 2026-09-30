import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const LandingFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is PDF Studio?',
      a: 'PDF Studio is a persistent web-based PDF workspace designed to let you create, merge, split, annotate, organize, and recover PDF documents directly in your browser without requiring separate desktop app installations.',
    },
    {
      q: 'Is PDF Studio free to use during development?',
      a: 'Yes. During the development and public beta preview phase, all available tools and personal workspace features are free to test and use.',
    },
    {
      q: 'Do I need to install an application?',
      a: 'No. PDF Studio runs entirely in modern web browsers (Chrome, Edge, Safari, Firefox). You can also optionally install it as a lightweight Progressive Web App (PWA) to your home screen for quick access.',
    },
    {
      q: 'Where are my PDFs stored?',
      a: 'In the development version, documents are stored securely in your browser’s private IndexedDB client partition. When Supabase cloud credentials are configured, documents are synchronized into private, isolated cloud storage buckets.',
    },
    {
      q: 'Can I access my PDFs from another device?',
      a: 'Currently, the development build stores files in your local browser workspace. Multi-device cloud sync via Supabase storage partitions is currently in active development.',
    },
    {
      q: 'Can I recover deleted PDFs?',
      a: 'Yes. When you delete a document, it is moved to the Recovery Vault for your configured retention period (default: 30 days, adjustable from 7 to 90 days). You can restore it with a single click at any time before expiration.',
    },
    {
      q: 'What happens when the recovery period ends?',
      a: 'Once the retention countdown expires or if you manually select "Delete Permanently", the document is irrevocably expunged from primary storage and cannot be recovered.',
    },
    {
      q: 'Is PDF Studio currently available?',
      a: 'Yes, as an early development preview. You can create an account or use Guest Mode to test working tools including Create, Merge, Split, Sign, Watermark, Compress, and the Recovery Vault today.',
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. PDF Studio uses user-partitioned storage, SHA-256 integrity checksums, and strict zero-AI training rules. Your documents are never indexed or used to train artificial intelligence models.',
    },
    {
      q: 'Can I use PDF Studio on mobile?',
      a: 'Yes. The interface is responsive and includes a dedicated mobile bottom navigation bar and touch-friendly canvas for phones and tablets.',
    },
    {
      q: 'When will the full application launch?',
      a: 'We are iteratively releasing features through our beta program. We focus on document reliability and privacy before announcing a commercial general availability date.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50/70 border-b border-slate-200/70 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Answers & Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Clear, straightforward answers about our current development status, storage policies,
            and roadmap.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
