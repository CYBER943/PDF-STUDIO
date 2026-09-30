import React, { useState, useEffect } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { extractTextFromPdf } from '../../services/pdfEngine';
import { getPdfBlob } from '../../services/storage';
import { DocumentItem } from '../../types';
import {
  X,
  FileText,
  Copy,
  Download,
  Search,
  Check,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface TextExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
}

export const TextExtractionModal: React.FC<TextExtractionModalProps> = ({
  isOpen,
  onClose,
  document: initialDoc,
}) => {
  const { documents, addToast } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDoc?.id || documents[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [pageTexts, setPageTexts] = useState<{ page: number; text: string }[]>([]);
  const [fullText, setFullText] = useState('');
  const [isScanned, setIsScanned] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'by-page'>('all');
  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const activeDoc = documents.find((d) => d.id === selectedDocId) || initialDoc;

  useEffect(() => {
    if (!isOpen || !activeDoc) return;
    let cancel = false;
    setIsLoading(true);

    getPdfBlob(activeDoc.id).then((buffer) => {
      if (!buffer || cancel) {
        setIsLoading(false);
        return;
      }
      extractTextFromPdf(buffer)
        .then((res) => {
          if (cancel) return;
          setPageTexts(res.pageTexts);
          setFullText(res.fullText);
          setIsScanned(res.isScannedLikely);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    });

    return () => {
      cancel = true;
    };
  }, [isOpen, activeDoc?.id]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Text copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = () => {
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDoc?.filename.replace(/\.pdf$/i, '') || 'extracted_text'}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    addToast('Exported TXT file', 'success');
  };

  const handleExportMarkdown = () => {
    let md = `# ${activeDoc?.filename.replace(/\.pdf$/i, '')}\n\n`;
    pageTexts.forEach((p) => {
      md += `## Page ${p.page}\n\n${p.text || '_No text detected on this page._'}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDoc?.filename.replace(/\.pdf$/i, '') || 'extracted_text'}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    addToast('Exported Markdown file', 'success');
  };

  const activePageObj = pageTexts.find((p) => p.page === selectedPageNum);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Extract Text</h2>
              <p className="text-xs text-slate-500">Copy text content or export as TXT / Markdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3 flex-1 overflow-hidden flex flex-col">
          {/* Document & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename}
                </option>
              ))}
            </select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search extracted text..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Scanned PDF warning as required by section 13 */}
          {isScanned && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5 shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Scanned Document Notice: </span>
                This document appears to contain scanned pages or image bitmaps. OCR may be required to extract full machine-readable text.
              </div>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                All Pages
              </button>
              <button
                onClick={() => setActiveTab('by-page')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'by-page' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                By Page
              </button>
            </div>

            {activeTab === 'by-page' && pageTexts.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Page:</span>
                <select
                  value={selectedPageNum}
                  onChange={(e) => setSelectedPageNum(parseInt(e.target.value, 10))}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  {pageTexts.map((p) => (
                    <option key={p.page} value={p.page}>
                      Page {p.page}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Text Display Area */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
            {isLoading ? (
              <div className="flex items-center justify-center h-48 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                <span>Extracting document text...</span>
              </div>
            ) : activeTab === 'all' ? (
              fullText ? (
                fullText
              ) : (
                <span className="text-slate-400 italic">No text content detected in document.</span>
              )
            ) : activePageObj ? (
              activePageObj.text || <span className="text-slate-400 italic">No text on this page.</span>
            ) : (
              <span className="text-slate-400 italic">Select a page.</span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeTab === 'all' ? fullText : activePageObj?.text || '')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportTxt}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export .TXT</span>
            </button>
            <button
              onClick={handleExportMarkdown}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export .MD</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
