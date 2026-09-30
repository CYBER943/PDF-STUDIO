import React from 'react';
import {
  X,
  Combine,
  Scissors,
  PenTool,
  Minimize2,
  Stamp,
  FileText,
  Image as ImageIcon,
  Hash,
  FilePlus2,
  Lock,
  Unlock,
  Info,
  Sparkles,
} from 'lucide-react';

interface AllToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: string) => void;
}

export const AllToolsModal: React.FC<AllToolsModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  if (!isOpen) return null;

  const tools = [
    {
      id: 'create-blank',
      name: 'Create Blank PDF',
      description: 'Generate blank or pre-formatted A4 / Letter PDF documents',
      icon: <FilePlus2 className="w-6 h-6 text-rose-600" />,
      tag: 'Create',
    },
    {
      id: 'images-to-pdf',
      name: 'Images to PDF',
      description: 'Convert JPG, PNG, and photos into a high-quality PDF',
      icon: <ImageIcon className="w-6 h-6 text-indigo-600" />,
      tag: 'Convert',
    },
    {
      id: 'merge',
      name: 'Merge PDFs',
      description: 'Combine multiple PDF documents into a single ordered file',
      icon: <Combine className="w-6 h-6 text-blue-600" />,
      tag: 'Organize',
    },
    {
      id: 'split',
      name: 'Split PDF',
      description: 'Separate pages or extract custom page ranges into new PDFs',
      icon: <Scissors className="w-6 h-6 text-emerald-600" />,
      tag: 'Organize',
    },
    {
      id: 'sign',
      name: 'Sign PDF',
      description: 'Draw, type cursive, or upload your signature to place on documents',
      icon: <PenTool className="w-6 h-6 text-indigo-600" />,
      tag: 'Security',
    },
    {
      id: 'compress',
      name: 'Compress PDF',
      description: 'Reduce PDF file size with Low, Balanced, or High presets',
      icon: <Minimize2 className="w-6 h-6 text-purple-600" />,
      tag: 'Optimize',
    },
    {
      id: 'watermark',
      name: 'Watermark PDF',
      description: 'Add custom text or image watermarks with opacity and rotation',
      icon: <Stamp className="w-6 h-6 text-amber-600" />,
      tag: 'Protect',
    },
    {
      id: 'page-numbers',
      name: 'Add Page Numbers',
      description: 'Insert dynamic page numbers with customizable format and placement',
      icon: <Hash className="w-6 h-6 text-sky-600" />,
      tag: 'Format',
    },
    {
      id: 'extract-text',
      name: 'Extract Text',
      description: 'Extract and copy text, export as plain TXT or formatted Markdown',
      icon: <FileText className="w-6 h-6 text-teal-600" />,
      tag: 'Extract',
    },
    {
      id: 'extract-images',
      name: 'Extract Images',
      description: 'Discover and download all embedded images from the PDF',
      icon: <ImageIcon className="w-6 h-6 text-fuchsia-600" />,
      tag: 'Extract',
    },
    {
      id: 'page-organizer',
      name: 'Page Organizer',
      description: 'Reorder, rotate, or delete individual pages with live previews',
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      tag: 'Organize',
    },
    {
      id: 'protect',
      name: 'Protect PDF',
      description: 'Set password security and encryption on private documents',
      icon: <Lock className="w-6 h-6 text-rose-600" />,
      tag: 'Security',
    },
    {
      id: 'unlock',
      name: 'Unlock PDF',
      description: 'Remove password restrictions with authorized access key',
      icon: <Unlock className="w-6 h-6 text-emerald-600" />,
      tag: 'Security',
    },
    {
      id: 'metadata',
      name: 'PDF Metadata',
      description: 'View and edit document Title, Author, Subject, and Keywords',
      icon: <Info className="w-6 h-6 text-slate-600" />,
      tag: 'Inspect',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">PDF Studio Tools</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                {tools.length} Utilities
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              All tools process documents in your browser and automatically save results to your library.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-6 overflow-y-auto flex-1 pr-1">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onClose();
                onSelectTool(t.id);
              }}
              className="p-4 bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-rose-300 hover:shadow-md rounded-2xl text-left transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-white shadow-2xs group-hover:scale-105 transition-transform">
                    {t.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                    {t.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  {t.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.description}</p>
              </div>

              <div className="mt-4 text-[11px] font-semibold text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Launch tool</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
