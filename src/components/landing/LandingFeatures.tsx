import React, { useState } from 'react';
import {
  FilePlus,
  Image as ImageIcon,
  FileText,
  PenTool,
  Highlighter,
  FileSignature,
  Combine,
  Scissors,
  RotateCw,
  Layers,
  Search,
  Folder,
  Star,
  Tag,
  Clock,
  Lock,
  Stamp,
  Shield,
  Trash2,
  RefreshCw,
  History,
  Cloud,
  Eye,
  CheckCircle2,
  Minimize2,
  Hash,
} from 'lucide-react';

export const LandingFeatures: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Features' },
    { id: 'create', name: 'Create' },
    { id: 'edit', name: 'Edit' },
    { id: 'organize', name: 'Organize' },
    { id: 'manage', name: 'Manage' },
    { id: 'protect', name: 'Protect' },
    { id: 'recover', name: 'Recover' },
    { id: 'advanced', name: 'Advanced Roadmap' },
  ];

  const features = [
    // Create
    {
      category: 'create',
      title: 'Blank PDF Generation',
      desc: 'Create documents with custom dimensions (A4, Letter, Custom) and formatted headers in seconds.',
      status: 'Available in Beta',
      icon: <FilePlus className="w-5 h-5 text-rose-600" />,
    },
    {
      category: 'create',
      title: 'Images to PDF',
      desc: 'Convert collections of JPG, PNG, and photo assets into clean, unified multi-page PDF documents.',
      status: 'Available in Beta',
      icon: <ImageIcon className="w-5 h-5 text-indigo-600" />,
    },
    {
      category: 'create',
      title: 'Text to PDF',
      desc: 'Instant structured document generation from raw text notes or clipboard content.',
      status: 'Available in Beta',
      icon: <FileText className="w-5 h-5 text-teal-600" />,
    },

    // Edit
    {
      category: 'edit',
      title: 'Text & Annotation Overlays',
      desc: 'Add custom text notes, headers, and callouts directly onto document pages.',
      status: 'Available in Beta',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
    },
    {
      category: 'edit',
      title: 'Freehand Draw & Highlight',
      desc: 'Interactive highlighters and freehand pens for marking up contracts and drafts.',
      status: 'Available in Beta',
      icon: <Highlighter className="w-5 h-5 text-amber-600" />,
    },
    {
      category: 'edit',
      title: 'Signature Placement',
      desc: 'Draw signatures, type cursive scripts, or upload stamp graphics to sign agreements in-browser.',
      status: 'Available in Beta',
      icon: <FileSignature className="w-5 h-5 text-indigo-600" />,
    },

    // Organize
    {
      category: 'organize',
      title: 'Merge PDFs',
      desc: 'Combine multiple independent PDFs into a single, ordered document with automatic library saving.',
      status: 'Available in Beta',
      icon: <Combine className="w-5 h-5 text-blue-600" />,
    },
    {
      category: 'organize',
      title: 'Split & Page Extraction',
      desc: 'Extract specific page numbers or ranges (e.g. 1-3, 5) into separate clean PDF files.',
      status: 'Available in Beta',
      icon: <Scissors className="w-5 h-5 text-emerald-600" />,
    },
    {
      category: 'organize',
      title: 'Page Organizer & Reorder',
      desc: 'Visual grid with live thumbnails to drag, rotate individual pages, and delete unwanted pages.',
      status: 'Available in Beta',
      icon: <Layers className="w-5 h-5 text-purple-600" />,
    },
    {
      category: 'organize',
      title: 'Rotate Pages',
      desc: 'Rotate individual or all pages in 90° clockwise increments to fix orientation.',
      status: 'Available in Beta',
      icon: <RotateCw className="w-5 h-5 text-sky-600" />,
    },
    {
      category: 'organize',
      title: 'Compress PDF',
      desc: 'Reduce file weight with Low, Balanced, or High compression presets and reduction metrics.',
      status: 'Available in Beta',
      icon: <Minimize2 className="w-5 h-5 text-rose-600" />,
    },

    // Manage
    {
      category: 'manage',
      title: 'Personal Document Library',
      desc: 'Every created or uploaded file is remembered in your personal workspace partition.',
      status: 'Available in Beta',
      icon: <Folder className="w-5 h-5 text-blue-600" />,
    },
    {
      category: 'manage',
      title: 'Instant Search & Filtering',
      desc: 'Search by filename, document title, author, and tags with debounced instant results.',
      status: 'Available in Beta',
      icon: <Search className="w-5 h-5 text-indigo-600" />,
    },
    {
      category: 'manage',
      title: 'Folders & Tags Hierarchy',
      desc: 'Color-coded folder organization and custom tag categorizations for tidy workspaces.',
      status: 'Available in Beta',
      icon: <Tag className="w-5 h-5 text-teal-600" />,
    },
    {
      category: 'manage',
      title: 'Favorites & Recents',
      desc: 'Pin critical documents and quickly resume working with recently edited files.',
      status: 'Available in Beta',
      icon: <Star className="w-5 h-5 text-amber-500" />,
    },

    // Protect
    {
      category: 'protect',
      title: 'Password Protection & Unlock',
      desc: 'Encrypt documents with security passkeys or remove restrictions with authorized passwords.',
      status: 'Available in Beta',
      icon: <Lock className="w-5 h-5 text-rose-600" />,
    },
    {
      category: 'protect',
      title: 'Watermark Engine',
      desc: 'Apply custom text or graphic watermarks with opacity, rotation, and tiled placements.',
      status: 'Available in Beta',
      icon: <Stamp className="w-5 h-5 text-amber-600" />,
    },
    {
      category: 'protect',
      title: 'Dynamic Page Numbers',
      desc: 'Insert customizable page numbers (Page 1 of N, bottom-right, etc.) into existing documents.',
      status: 'Available in Beta',
      icon: <Hash className="w-5 h-5 text-sky-600" />,
    },

    // Recover
    {
      category: 'recover',
      title: 'Recovery Vault (Trash)',
      desc: 'Two-stage safety net: deleted documents are held during retention before permanent purge.',
      status: 'Available in Beta',
      icon: <Trash2 className="w-5 h-5 text-rose-600" />,
    },
    {
      category: 'recover',
      title: 'Configurable Retention Clock',
      desc: 'Set trash countdown periods (7, 14, 30, 60, or 90 days) with automatic expiry.',
      status: 'Available in Beta',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
    },
    {
      category: 'recover',
      title: 'Document Version History',
      desc: 'Store revisions, inspect modification timestamps, and restore previous document states.',
      status: 'Available in Beta',
      icon: <History className="w-5 h-5 text-purple-600" />,
    },

    // Advanced Roadmap
    {
      category: 'advanced',
      title: 'Cloud Multi-Device Sync',
      desc: 'Seamless real-time synchronization across devices backed by Supabase storage partitions.',
      status: 'In Development',
      icon: <Cloud className="w-5 h-5 text-indigo-500" />,
    },
    {
      category: 'advanced',
      title: 'In-Browser OCR Text Extraction',
      desc: 'Optical character recognition for scanned image-only PDFs using client-side Tesseract.',
      status: 'In Development',
      icon: <Eye className="w-5 h-5 text-teal-500" />,
    },
    {
      category: 'advanced',
      title: 'AI Summary & Document Assistant',
      desc: 'Opt-in document question answering and summaries with strict privacy safeguards.',
      status: 'Planned',
      icon: <Shield className="w-5 h-5 text-amber-500" />,
    },
  ];

  const filteredFeatures =
    activeCategory === 'all'
      ? features
      : features.filter((f) => f.category === activeCategory);

  const getStatusBadge = (status: string) => {
    if (status === 'Available in Beta') {
      return (
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Available in Beta
        </span>
      );
    }
    if (status === 'In Development') {
      return (
        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          In Development
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
        Planned
      </span>
    );
  };

  return (
    <section id="features" className="py-24 bg-slate-50/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for everything you do with PDFs.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every feature is being built with precision, privacy, and browser performance in mind.
            Check below to see what is already working in the beta versus what is currently in development.
          </p>
        </div>

        {/* Category Filter Pills (Section 8) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === c.id
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFeatures.map((f, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                    {f.icon}
                  </div>
                  {getStatusBadge(f.status)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="capitalize">{f.category} tool</span>
                <span className="text-slate-500 font-medium">In-browser processing</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
