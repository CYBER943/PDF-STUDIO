import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { createPdfFromImages } from '../../services/pdfEngine';
import { DocumentItem } from '../../types';
import {
  X,
  Image as ImageIcon,
  Upload,
  Trash2,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface CreateFromImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const CreateFromImagesModal: React.FC<CreateFromImagesModalProps> = ({
  isOpen,
  onClose,
  onOpenDocument,
}) => {
  const { saveNewDocument, addToast } = useDocuments();
  const [images, setImages] = useState<{ dataUrl: string; name: string }[]>([]);
  const [title, setTitle] = useState('Photos Document.pdf');
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'FitImage'>('A4');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (re) => {
        setImages((prev) => [
          ...prev,
          {
            dataUrl: re.target?.result as string,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (images.length === 0) {
      addToast('Please upload at least one image', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await createPdfFromImages(images, { pageSize });
      const newDoc = await saveNewDocument(title, buffer, {
        tags: ['Images', 'Photos'],
      });

      setIsProcessing(false);
      onClose();
      onOpenDocument(newDoc);
    } catch (err: any) {
      console.error(err);
      addToast('Failed to convert images: ' + err.message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Images to PDF</h2>
              <p className="text-xs text-slate-500">Combine photos and images into a clean PDF</p>
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
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* File Picker */}
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl bg-slate-50 cursor-pointer transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs font-semibold text-slate-700">Select or drop photos (JPG, PNG)</span>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg"
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          {/* Image List Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 group aspect-square bg-slate-100">
                  <img src={img.dataUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Page Layout:</label>
              <select
                value={pageSize}
                onChange={(e: any) => setPageSize(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="A4">A4 Page (Centered)</option>
                <option value="FitImage">Fit Page to Image Dimensions</option>
                <option value="Letter">US Letter Page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            {images.length} {images.length === 1 ? 'image' : 'images'} added
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={images.length === 0 || isProcessing}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Convert to PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
