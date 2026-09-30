import React, { useState, useEffect } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { extractImagesFromPdf } from '../../services/pdfEngine';
import { getPdfBlob } from '../../services/storage';
import { DocumentItem } from '../../types';
import {
  X,
  Image as ImageIcon,
  Download,
  Loader2,
} from 'lucide-react';

interface ImageExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
}

export const ImageExtractionModal: React.FC<ImageExtractionModalProps> = ({
  isOpen,
  onClose,
  document: initialDoc,
}) => {
  const { documents, addToast } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDoc?.id || documents[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<
    { id: string; pageNumber: number; dataUrl: string; width: number; height: number; format: string }[]
  >([]);

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
      extractImagesFromPdf(buffer)
        .then((res) => {
          if (cancel) return;
          setImages(res);
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

  const handleDownloadSingle = (img: { dataUrl: string; pageNumber: number; id: string }) => {
    const a = document.createElement('a');
    a.href = img.dataUrl;
    a.download = `${activeDoc?.filename.replace(/\.pdf$/i, '')}_page_${img.pageNumber}_${img.id}.png`;
    a.click();
    addToast('Downloaded image', 'success');
  };

  const handleDownloadAll = () => {
    images.forEach((img, idx) => {
      setTimeout(() => {
        handleDownloadSingle(img);
      }, idx * 200);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Extract Images</h2>
              <p className="text-xs text-slate-500">Discover and export all raster images from PDF</p>
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
                  {d.filename}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-fuchsia-600" />
              <span className="text-xs">Scanning PDF streams for image objects...</span>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-slate-200">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">No embedded images found</div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">
                This document consists primarily of vector shapes, text glyphs, or inline fonts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex flex-col justify-between group hover:border-fuchsia-300 transition-all"
                >
                  <div className="h-32 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1 border border-slate-100">
                    <img src={img.dataUrl} alt="" className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <div>
                      <div>Page {img.pageNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {img.width} × {img.height} • {img.format}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadSingle(img)}
                      className="p-1.5 bg-white hover:bg-fuchsia-50 hover:text-fuchsia-600 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            {images.length} {images.length === 1 ? 'image' : 'images'} detected
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
            {images.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All ({images.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
