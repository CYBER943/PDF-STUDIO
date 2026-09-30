import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { mergePdfs, readPdfMetadata } from '../../services/pdfEngine';
import { getPdfBlob } from '../../services/storage';
import { DocumentItem } from '../../types';
import {
  X,
  Combine,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface MergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDocument: (doc: DocumentItem) => void;
}

interface MergeItem {
  id: string;
  name: string;
  buffer: Uint8Array;
  pageCount: number;
}

export const MergeModal: React.FC<MergeModalProps> = ({ isOpen, onClose, onOpenDocument }) => {
  const { documents, saveNewDocument, addToast } = useDocuments();
  const [items, setItems] = useState<MergeItem[]>([]);
  const [outputName, setOutputName] = useState('Merged Document.pdf');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Add from local file system
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = new Uint8Array(await file.arrayBuffer());
      try {
        const meta = await readPdfMetadata(buffer);
        setItems((prev) => [
          ...prev,
          {
            id: `item_${Date.now()}_${i}`,
            name: file.name,
            buffer,
            pageCount: meta.pageCount || 1,
          },
        ]);
      } catch (err) {
        addToast(`Could not read "${file.name}"`, 'error');
      }
    }
  };

  // Add from existing library
  const handleAddFromLibrary = async (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;
    const buffer = await getPdfBlob(doc.id);
    if (!buffer) return;

    setItems((prev) => [
      ...prev,
      {
        id: `lib_${Date.now()}`,
        name: doc.filename,
        buffer,
        pageCount: doc.pageCount || 1,
      },
    ]);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (items.length < 2) {
      addToast('Please add at least 2 PDF documents to merge', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const buffers = items.map((it) => it.buffer);
      const mergedBuffer = await mergePdfs(buffers);

      const finalName = outputName.trim().endsWith('.pdf')
        ? outputName.trim()
        : `${outputName.trim()}.pdf`;

      const newDoc = await saveNewDocument(finalName, mergedBuffer, {
        tags: ['Merged'],
      });

      setIsProcessing(false);
      onClose();
      onOpenDocument(newDoc);
    } catch (err: any) {
      console.error(err);
      addToast('Failed to merge documents', 'error');
      setIsProcessing(false);
    }
  };

  const totalPages = items.reduce((sum, item) => sum + item.pageCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Combine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Merge PDF Documents</h2>
              <p className="text-xs text-slate-500">Order and combine files into one document</p>
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
        <div className="py-4 space-y-4 flex-1 overflow-y-auto">
          {/* File Picker & Library Add */}
          <div className="flex flex-wrap gap-2">
            <label className="flex-1 min-w-[140px] px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add from Computer</span>
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {documents.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddFromLibrary(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="flex-1 min-w-[140px] px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                <option value="">+ Add from Library...</option>
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.filename} ({d.pageCount} pgs)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* List of Files to Merge */}
          {items.length === 0 ? (
            <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-700">No documents added yet</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Add 2 or more PDF documents to merge them together.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {index + 1}
                    </span>
                    <span className="truncate font-semibold">{item.name}</span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      ({item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-1 hover:bg-rose-100 rounded text-rose-600 ml-1 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Merge Summary & Name */}
          {items.length > 0 && (
            <div className="pt-2 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Merged Document Filename:
                </label>
                <input
                  type="text"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500 font-medium bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                <span>Total Documents: {items.length}</span>
                <span>Combined Pages: {totalPages}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleMerge}
            disabled={items.length < 2 || isProcessing}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Merging & Saving...</span>
              </>
            ) : (
              <>
                <Combine className="w-4 h-4" />
                <span>Merge & Save to Library</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
