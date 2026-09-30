import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { splitPdf } from '../../services/pdfEngine';
import { getPdfBlob } from '../../services/storage';
import { DocumentItem } from '../../types';
import {
  X,
  Scissors,
  Layers,
  Loader2,
  FileText,
} from 'lucide-react';

interface SplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const SplitModal: React.FC<SplitModalProps> = ({
  isOpen,
  onClose,
  document: initialDoc,
  onOpenDocument,
}) => {
  const { documents, saveNewDocument, addToast } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDoc?.id || documents[0]?.id || '');
  const [splitMode, setSplitMode] = useState<'range' | 'every-page'>('range');
  const [rangeInput, setRangeInput] = useState('1-2');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const activeDoc = documents.find((d) => d.id === selectedDocId) || initialDoc;

  const handleSplit = async () => {
    if (!activeDoc) {
      addToast('Please select a document to split', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await getPdfBlob(activeDoc.id);
      if (!buffer) throw new Error('File data unavailable');

      let rangesToExtract: { from: number; to: number }[] = [];

      if (splitMode === 'every-page') {
        const total = activeDoc.pageCount || 1;
        for (let i = 1; i <= total; i++) {
          rangesToExtract.push({ from: i, to: i });
        }
      } else {
        // Parse range input like "1-3, 4-5" or "1, 2"
        const parts = rangeInput.split(',').map((p) => p.trim());
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map((s) => parseInt(s.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
              rangesToExtract.push({ from: start, to: end });
            }
          } else {
            const page = parseInt(part, 10);
            if (!isNaN(page)) {
              rangesToExtract.push({ from: page, to: page });
            }
          }
        }
      }

      if (rangesToExtract.length === 0) {
        addToast('Invalid page range specified', 'error');
        setIsProcessing(false);
        return;
      }

      const results = await splitPdf(buffer, rangesToExtract);
      let lastCreated: DocumentItem | null = null;

      for (let i = 0; i < results.length; i++) {
        const range = rangesToExtract[i];
        const rangeName =
          range.from === range.to ? `Page ${range.from}` : `Pages ${range.from}-${range.to}`;
        const name = `${activeDoc.filename.replace(/\.pdf$/i, '')} (${rangeName}).pdf`;

        lastCreated = await saveNewDocument(name, results[i], {
          tags: ['Split', 'Extracted'],
          folderId: activeDoc.folderId,
        });
      }

      setIsProcessing(false);
      onClose();
      if (lastCreated) {
        onOpenDocument(lastCreated);
      }
    } catch (err: any) {
      console.error(err);
      addToast('Failed to split document: ' + err.message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Split PDF Document</h2>
              <p className="text-xs text-slate-500">Extract pages or split into multiple files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Document to Split:
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename} ({d.pageCount} pages)
                </option>
              ))}
            </select>
          </div>

          {activeDoc && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 text-xs text-slate-600">
              <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Document contains <strong className="text-slate-900">{activeDoc.pageCount || 1} pages</strong>.
              </span>
            </div>
          )}

          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Split Mode:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSplitMode('range')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  splitMode === 'range'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs">Custom Range</div>
                <div className="text-[11px] text-slate-400 mt-0.5">e.g. 1-2, 3-5</div>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('every-page')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  splitMode === 'every-page'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs">Every Page</div>
                <div className="text-[11px] text-slate-400 mt-0.5">1 page per file</div>
              </button>
            </div>
          </div>

          {splitMode === 'range' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Page Ranges (comma separated):
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="1-2, 3, 4-5"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Example: "1-2" extracts pages 1 and 2 into one file.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSplit}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Splitting & Saving...</span>
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Split & Save to Library</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
