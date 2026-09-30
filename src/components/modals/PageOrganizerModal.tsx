import React, { useState, useEffect } from 'react';
import { DocumentItem } from '../../types';
import { useDocuments } from '../../context/DocumentContext';
import { getPdfBlob } from '../../services/storage';
import { renderAllPageThumbnails, modifyPageOrder, rotatePdfPages } from '../../services/pdfEngine';
import {
  X,
  RotateCw,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface PageOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDoc?: DocumentItem | null;
}

interface PageItem {
  pageIndex: number;
  originalIndex: number;
  dataUrl: string;
  rotation: number;
  isDeleted: boolean;
}

export const PageOrganizerModal: React.FC<PageOrganizerModalProps> = ({
  isOpen,
  onClose,
  targetDoc,
}) => {
  const { documents, updateDocumentBuffer, saveNewDocument, addToast } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>(targetDoc?.id || '');
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveAsCopy, setSaveAsCopy] = useState(false);

  useEffect(() => {
    if (targetDoc) {
      setSelectedDocId(targetDoc.id);
    } else if (documents.length > 0 && !selectedDocId) {
      setSelectedDocId(documents[0].id);
    }
  }, [targetDoc, documents]);

  useEffect(() => {
    if (!isOpen || !selectedDocId) return;

    let isMounted = true;
    setLoading(true);

    getPdfBlob(selectedDocId).then(async (buffer) => {
      if (!isMounted || !buffer) {
        setLoading(false);
        return;
      }

      const thumbs = await renderAllPageThumbnails(buffer);
      if (isMounted) {
        setPages(
          thumbs.map((t) => ({
            pageIndex: t.pageIndex,
            originalIndex: t.pageIndex,
            dataUrl: t.dataUrl,
            rotation: 0,
            isDeleted: false,
          }))
        );
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedDocId]);

  if (!isOpen) return null;

  const activePages = pages.filter((p) => !p.isDeleted);
  const currentDoc = documents.find((d) => d.id === selectedDocId);

  const handleRotatePage = (indexInActive: number) => {
    const targetItem = activePages[indexInActive];
    setPages((prev) =>
      prev.map((p) =>
        p.originalIndex === targetItem.originalIndex
          ? { ...p, rotation: (p.rotation + 90) % 360 }
          : p
      )
    );
  };

  const handleDeletePage = (indexInActive: number) => {
    if (activePages.length <= 1) {
      addToast('Cannot delete all pages from document', 'warning');
      return;
    }
    const targetItem = activePages[indexInActive];
    setPages((prev) =>
      prev.map((p) =>
        p.originalIndex === targetItem.originalIndex ? { ...p, isDeleted: true } : p
      )
    );
  };

  const handleMovePage = (indexInActive: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? indexInActive - 1 : indexInActive + 1;
    if (targetIndex < 0 || targetIndex >= activePages.length) return;

    const newActive = [...activePages];
    const temp = newActive[indexInActive];
    newActive[indexInActive] = newActive[targetIndex];
    newActive[targetIndex] = temp;

    // Reconstruct full list preserving deleted ones
    const deletedPages = pages.filter((p) => p.isDeleted);
    setPages([...newActive, ...deletedPages]);
  };

  const handleRotateAll = () => {
    setPages((prev) =>
      prev.map((p) => ({ ...p, rotation: (p.rotation + 90) % 360 }))
    );
  };

  const handleReset = () => {
    setPages((prev) =>
      [...prev]
        .sort((a, b) => a.originalIndex - b.originalIndex)
        .map((p) => ({ ...p, isDeleted: false, rotation: 0 }))
    );
  };

  const handleSave = async () => {
    if (!currentDoc || activePages.length === 0) return;
    setIsSaving(true);

    try {
      const buffer = await getPdfBlob(currentDoc.id);
      if (!buffer) throw new Error('Original buffer could not be loaded');

      // 1. Apply page reordering and deletion
      const indicesToKeep = activePages.map((p) => p.originalIndex);
      let organizedBuffer = await modifyPageOrder(buffer, indicesToKeep);

      // 2. Apply page rotations
      const rotationActions = activePages
        .map((p, newIndex) => ({
          pageIndex: newIndex,
          degrees: p.rotation,
        }))
        .filter((r) => r.degrees !== 0);

      if (rotationActions.length > 0) {
        organizedBuffer = await rotatePdfPages(organizedBuffer, rotationActions);
      }

      if (saveAsCopy) {
        const copyTitle = currentDoc.filename.replace(/\.pdf$/i, '') + ' (Organized).pdf';
        await saveNewDocument(copyTitle, organizedBuffer, {
          folderId: currentDoc.folderId,
          tags: [...currentDoc.tags, 'Organized'],
        });
        addToast(`Organized copy saved to library`, 'success');
      } else {
        await updateDocumentBuffer(
          currentDoc.id,
          organizedBuffer,
          `Organized ${activePages.length} pages (reordered/rotated)`
        );
        addToast(`Document successfully updated & saved`, 'success');
      }

      onClose();
    } catch (err: any) {
      addToast(err?.message || 'Failed to save organized PDF', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Page Organizer</h2>
              <p className="text-xs text-slate-500">
                Reorder, rotate, or delete individual pages with live preview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700">Document:</label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename} ({d.pageCount} pages)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRotateAll}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate All 90°
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Reset
            </button>
            <span className="text-slate-400 font-normal">|</span>
            <span className="font-semibold text-slate-600">
              {activePages.length} active {activePages.length === 1 ? 'page' : 'pages'}
            </span>
          </div>
        </div>

        {/* Grid content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              <p className="text-xs">Generating high-fidelity page previews...</p>
            </div>
          ) : activePages.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-xs">All pages marked for deletion. Click reset to restore.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {activePages.map((page, index) => (
                <div
                  key={`${page.originalIndex}-${index}`}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-2 flex flex-col items-center relative group"
                >
                  {/* Page number badge */}
                  <div className="w-full flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      Page {index + 1}
                    </span>
                    {page.rotation !== 0 && (
                      <span className="text-[10px] text-blue-600 font-semibold">
                        +{page.rotation}°
                      </span>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-full aspect-3/4 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100 p-1">
                    <img
                      src={page.dataUrl}
                      alt={`Page ${index + 1}`}
                      className="max-w-full max-h-full object-contain transition-transform duration-200"
                      style={{ transform: `rotate(${page.rotation}deg)` }}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="w-full flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-0.5">
                      <button
                        title="Move left"
                        disabled={index === 0}
                        onClick={() => handleMovePage(index, 'left')}
                        className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Move right"
                        disabled={index === activePages.length - 1}
                        onClick={() => handleMovePage(index, 'right')}
                        className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        title="Rotate 90°"
                        onClick={() => handleRotatePage(index)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-50"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete page"
                        onClick={() => handleDeletePage(index)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={saveAsCopy}
              onChange={(e) => setSaveAsCopy(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span>Save as a new copy (preserve original document)</span>
          </label>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || activePages.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              {isSaving ? (
                'Processing...'
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Apply & Save to Library
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
