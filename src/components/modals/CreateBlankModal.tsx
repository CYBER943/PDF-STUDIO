import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { createBlankPdf } from '../../services/pdfEngine';
import { DocumentItem } from '../../types';
import {
  X,
  FilePlus2,
  FileText,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface CreateBlankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const CreateBlankModal: React.FC<CreateBlankModalProps> = ({
  isOpen,
  onClose,
  onOpenDocument,
}) => {
  const { saveNewDocument, currentFolderId, addToast } = useDocuments();
  const [title, setTitle] = useState('Untitled Document');
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Custom'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageCount, setPageCount] = useState<number>(1);
  const [initialText, setInitialText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!title.trim()) {
      addToast('Please enter a document title', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await createBlankPdf({
        pageSize,
        orientation,
        pageCount,
        title: title.trim(),
        initialText: initialText.trim() || undefined,
      });

      const newDoc = await saveNewDocument(title.trim(), buffer, {
        folderId: currentFolderId,
        tags: ['New', pageSize],
      });

      setIsProcessing(false);
      onClose();
      onOpenDocument(newDoc);
    } catch (err: any) {
      console.error(err);
      addToast('Failed to create document: ' + err.message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Blank PDF</h2>
              <p className="text-xs text-slate-500">Generate a fresh document directly in your library</p>
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
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project Plan 2026.pdf"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-rose-500"
            />
          </div>

          {/* Size & Orientation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Page Size:</label>
              <select
                value={pageSize}
                onChange={(e: any) => setPageSize(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="A4">A4 (Standard 210 × 297 mm)</option>
                <option value="Letter">US Letter (8.5 × 11 in)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Orientation:</label>
              <select
                value={orientation}
                onChange={(e: any) => setOrientation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Pages:</label>
            <input
              type="number"
              min={1}
              max={50}
              value={pageCount}
              onChange={(e) => setPageCount(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Content / Notes (Optional):
            </label>
            <textarea
              rows={3}
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
              placeholder="Add introductory text, memo headers, or notes..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-rose-500"
            />
          </div>
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
            onClick={handleCreate}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <FilePlus2 className="w-4 h-4" />
                <span>Create & Open in Studio</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
