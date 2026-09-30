import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { compressPdf } from '../../services/pdfEngine';
import { getPdfBlob } from '../../services/storage';
import { DocumentItem } from '../../types';
import {
  X,
  Minimize2,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CompressModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const CompressModal: React.FC<CompressModalProps> = ({
  isOpen,
  onClose,
  document: initialDoc,
  onOpenDocument,
}) => {
  const { documents, saveNewDocument, addToast } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDoc?.id || documents[0]?.id || '');
  const [level, setLevel] = useState<'low' | 'balanced' | 'high'>('balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultStats, setResultStats] = useState<{
    originalSize: number;
    compressedSize: number;
    savedPercent: number;
    newDoc: DocumentItem;
  } | null>(null);

  if (!isOpen) return null;

  const activeDoc = documents.find((d) => d.id === selectedDocId) || initialDoc;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleCompress = async () => {
    if (!activeDoc) {
      addToast('Please select a document', 'warning');
      return;
    }

    setIsProcessing(true);
    setResultStats(null);
    try {
      const buffer = await getPdfBlob(activeDoc.id);
      if (!buffer) throw new Error('File data unavailable');

      const res = await compressPdf(buffer, level);

      const name = `${activeDoc.filename.replace(/\.pdf$/i, '')} (Compressed).pdf`;
      const newDoc = await saveNewDocument(name, res.compressedBuffer, {
        tags: ['Compressed'],
        folderId: activeDoc.folderId,
      });

      setResultStats({
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        savedPercent: res.savedPercent,
        newDoc,
      });

      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      addToast('Failed to compress document: ' + err.message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Minimize2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Compress PDF</h2>
              <p className="text-xs text-slate-500">Reduce document size while maintaining readability</p>
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
              onChange={(e) => {
                setSelectedDocId(e.target.value);
                setResultStats(null);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename} ({formatSize(d.fileSize)})
                </option>
              ))}
            </select>
          </div>

          {/* Compression Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Compression Level:
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  level === 'low'
                    ? 'border-purple-500 bg-purple-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="level"
                  checked={level === 'low'}
                  onChange={() => setLevel('low')}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">LOW Compression</div>
                  <div className="text-[11px] text-slate-500">
                    Maximum image quality. Cleans stream structure and removes redundant fonts.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  level === 'balanced'
                    ? 'border-purple-500 bg-purple-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="level"
                  checked={level === 'balanced'}
                  onChange={() => setLevel('balanced')}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    BALANCED Compression <span className="text-purple-600">(Recommended)</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ideal balance between visual crispness and compact file size.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  level === 'high'
                    ? 'border-purple-500 bg-purple-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="level"
                  checked={level === 'high'}
                  onChange={() => setLevel('high')}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">HIGH Compression</div>
                  <div className="text-[11px] text-slate-500">
                    Maximum size reduction. Downsamples photos and optimizes for email and sharing.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Real Results Display */}
          {resultStats && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Compression Successful & Auto-Saved to Library</span>
              </div>

              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-emerald-100">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Original</div>
                  <div className="font-bold text-slate-800">{formatSize(resultStats.originalSize)}</div>
                </div>

                <ArrowRight className="w-4 h-4 text-emerald-500" />

                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Compressed</div>
                  <div className="font-bold text-emerald-700">{formatSize(resultStats.compressedSize)}</div>
                </div>

                <div className="pl-3 border-l border-slate-100 text-right">
                  <div className="text-[10px] text-emerald-600 uppercase font-semibold">Saved</div>
                  <div className="font-bold text-emerald-700">{resultStats.savedPercent}%</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenDocument(resultStats.newDoc);
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Open Compressed Document in Studio →
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
          {!resultStats && (
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compressing...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Compress Document</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
