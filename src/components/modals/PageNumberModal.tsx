import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { addPageNumbers } from '../../services/pdfEngine';
import { getPdfBlob } from '../../services/storage';
import { DocumentItem } from '../../types';
import {
  X,
  Hash,
  Loader2,
  Check,
} from 'lucide-react';

interface PageNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const PageNumberModal: React.FC<PageNumberModalProps> = ({
  isOpen,
  onClose,
  document: initialDoc,
  onOpenDocument,
}) => {
  const { documents, updateDocumentBuffer, addToast } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDoc?.id || documents[0]?.id || '');
  const [startNumber, setStartNumber] = useState<number>(1);
  const [startPage, setStartPage] = useState<number>(1);
  const [format, setFormat] = useState<'1' | 'Page 1' | '1 / N' | 'Page 1 of N'>('Page 1 of N');
  const [position, setPosition] = useState<
    'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right'
  >('bottom-center');
  const [fontSize, setFontSize] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const activeDoc = documents.find((d) => d.id === selectedDocId) || initialDoc;

  const handleApply = async () => {
    if (!activeDoc) {
      addToast('Please select a document', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await getPdfBlob(activeDoc.id);
      if (!buffer) throw new Error('File data unavailable');

      const updatedBuffer = await addPageNumbers(buffer, {
        startNumber,
        startPage,
        format,
        position,
        fontSize,
      });

      const updated = await updateDocumentBuffer(
        activeDoc.id,
        updatedBuffer,
        `Added page numbers (${format})`
      );

      setIsProcessing(false);
      onClose();
      onOpenDocument(updated);
    } catch (err: any) {
      console.error(err);
      addToast('Failed to add page numbers: ' + err.message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Page Numbers</h2>
              <p className="text-xs text-slate-500">Insert custom page headers or footers</p>
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
              Select Document:
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename} ({d.pageCount} pgs)
                </option>
              ))}
            </select>
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Number Format:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '1', label: '1, 2, 3...' },
                { id: 'Page 1', label: 'Page 1' },
                { id: '1 / N', label: '1 / 20' },
                { id: 'Page 1 of N', label: 'Page 1 of 20' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                    format === f.id
                      ? 'border-sky-500 bg-sky-50/60 text-sky-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Position Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Position:</label>
            <select
              value={position}
              onChange={(e: any) => setPosition(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="bottom-center">Bottom Center (Recommended)</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>

          {/* Start Number & Start Page */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Page:</label>
              <input
                type="number"
                min={1}
                value={startPage}
                onChange={(e) => setStartPage(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Number:</label>
              <input
                type="number"
                min={1}
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
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
            onClick={handleApply}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Add Page Numbers</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
