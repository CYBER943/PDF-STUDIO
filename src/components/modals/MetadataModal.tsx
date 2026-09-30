import React, { useState, useEffect } from 'react';
import { DocumentItem, PdfMetadata } from '../../types';
import { useDocuments } from '../../context/DocumentContext';
import { getPdfBlob } from '../../services/storage';
import { readPdfMetadata, updatePdfMetadata } from '../../services/pdfEngine';
import {
  X,
  Info,
  Save,
  Loader2,
  Calendar,
  Layers,
  HardDrive,
} from 'lucide-react';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
}

export const MetadataModal: React.FC<MetadataModalProps> = ({ isOpen, onClose, document }) => {
  const { updateDocumentBuffer, addToast } = useDocuments();
  const [meta, setMeta] = useState<PdfMetadata | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen || !document) return;
    getPdfBlob(document.id).then((buffer) => {
      if (!buffer) return;
      readPdfMetadata(buffer).then((m) => {
        setMeta(m);
        setTitle(m.title || document.title || '');
        setAuthor(m.author || document.author || '');
        setSubject(m.subject || document.subject || '');
        setKeywords((m.keywords || []).join(', '));
      });
    });
  }, [isOpen, document]);

  if (!isOpen || !document) return null;

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const buffer = await getPdfBlob(document.id);
      if (!buffer) throw new Error('File data unavailable');

      const kwList = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const updatedBuffer = await updatePdfMetadata(buffer, {
        title: title.trim(),
        author: author.trim(),
        subject: subject.trim(),
        keywords: kwList,
      });

      await updateDocumentBuffer(document.id, updatedBuffer, 'Updated PDF metadata');
      setIsProcessing(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      addToast('Failed to update metadata', 'error');
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">PDF Metadata</h2>
              <p className="text-xs text-slate-500 truncate max-w-xs">{document.filename}</p>
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
        <div className="py-4 space-y-3.5">
          {/* Read-Only Stats */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Format</div>
              <div className="font-bold text-slate-800">PDF v{meta?.pdfVersion || '1.7'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Pages</div>
              <div className="font-bold text-slate-800">{document.pageCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Size</div>
              <div className="font-bold text-slate-800">{formatSize(document.fileSize)}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Author / Creator:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Description:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keywords (comma separated):
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. invoice, cloud, confidential"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
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
            onClick={handleSave}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Metadata</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
