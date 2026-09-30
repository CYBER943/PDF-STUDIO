import React, { useState, useEffect, useRef } from 'react';
import { DocumentItem, OverlayAnnotation } from '../types';
import { useDocuments } from '../context/DocumentContext';
import { getPdfBlob } from '../services/storage';
import {
  ensurePdfLibraries,
  rotatePdfPages,
  modifyPageOrder,
  applyOverlays,
  downloadPdf,
} from '../services/pdfEngine';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize,
  Download,
  Save,
  RotateCw,
  Trash2,
  Type,
  PenTool,
  Highlighter,
  Square,
  Circle,
  FileSignature,
  StickyNote,
  Search,
  Check,
  Undo2,
  Redo2,
  Share2,
  Sparkles,
} from 'lucide-react';

interface UnifiedEditorViewProps {
  document: DocumentItem;
  onBack: () => void;
  onOpenTool: (tool: string, doc?: DocumentItem) => void;
  onShare: (doc: DocumentItem) => void;
}

export const UnifiedEditorView: React.FC<UnifiedEditorViewProps> = ({
  document,
  onBack,
  onOpenTool,
  onShare,
}) => {
  const { updateDocumentBuffer, renameDocument, addToast } = useDocuments();

  // State
  const [pdfBuffer, setPdfBuffer] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [title, setTitle] = useState(document.filename);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved');

  // Active Tool Mode
  const [activeTool, setActiveTool] = useState<
    'select' | 'text' | 'draw' | 'highlight' | 'rectangle' | 'signature' | 'note'
  >('select');

  // Tool settings
  const [textColor, setTextColor] = useState('#ef4444');
  const [fontSize, setFontSize] = useState(14);
  const [strokeColor, setStrokeColor] = useState('#ef4444');
  const [highlighterColor, setHighlighterColor] = useState('#fef08a'); // soft yellow

  // Overlay annotations
  const [overlays, setOverlays] = useState<OverlayAnnotation[]>([]);
  const [history, setHistory] = useState<OverlayAnnotation[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Search in text
  const [searchWord, setSearchWord] = useState('');
  const [searchResultsCount, setSearchResultsCount] = useState<number | null>(null);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const drawPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Load PDF binary
  useEffect(() => {
    let isMounted = true;
    getPdfBlob(document.id).then((buf) => {
      if (isMounted && buf) {
        setPdfBuffer(buf);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [document.id]);

  // Render current page to canvas via PDF.js
  useEffect(() => {
    if (!pdfBuffer || !canvasRef.current) return;
    let cancel = false;

    ensurePdfLibraries().then(({ pdfjsLib }) => {
      if (cancel || !pdfjsLib) return;

      const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer.slice(0) });
      loadingTask.promise.then((pdfDoc: any) => {
        if (cancel) return;
        setNumPages(pdfDoc.numPages);
        const pageToRender = Math.min(currentPage, pdfDoc.numPages);

        pdfDoc.getPage(pageToRender).then((page: any) => {
          if (cancel || !canvasRef.current) return;
          const viewport = page.getViewport({ scale: zoomScale * 1.5 });
          const canvas = canvasRef.current;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          page.render({
            canvasContext: ctx,
            viewport: viewport,
          }).promise.then(() => {
            // If drawing canvas is present, sync dimensions
            if (drawingCanvasRef.current) {
              drawingCanvasRef.current.width = viewport.width;
              drawingCanvasRef.current.height = viewport.height;
            }
          });
        });
      });
    });

    return () => {
      cancel = true;
    };
  }, [pdfBuffer, currentPage, zoomScale]);

  // Handle Freehand Drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'draw' && activeTool !== 'highlight') return;
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    isDrawingRef.current = true;
    drawPointsRef.current = [{ x, y }];
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    drawPointsRef.current.push({ x, y });

    // Draw segment
    ctx.lineWidth = activeTool === 'highlight' ? 24 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeTool === 'highlight' ? 'rgba(254, 240, 138, 0.4)' : strokeColor;

    const pts = drawPointsRef.current;
    if (pts.length > 1) {
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    // Commit drawing to overlay
    if (drawingCanvasRef.current) {
      const dataUrl = drawingCanvasRef.current.toDataURL('image/png');
      const newAnn: OverlayAnnotation = {
        id: `ann_${Date.now()}`,
        pageIndex: currentPage - 1,
        type: 'signature',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        color: strokeColor,
        imageData: dataUrl,
      };
      addAnnotation(newAnn);
    }
  };

  // Add click overlay for text / shapes
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'select' || activeTool === 'draw' || activeTool === 'highlight') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTool === 'text') {
      const text = window.prompt('Enter text to stamp on page:');
      if (text && text.trim()) {
        const newAnn: OverlayAnnotation = {
          id: `ann_${Date.now()}`,
          pageIndex: currentPage - 1,
          type: 'text',
          x: xPct,
          y: yPct,
          content: text.trim(),
          color: textColor,
          fontSize: fontSize,
        };
        addAnnotation(newAnn);
      }
    } else if (activeTool === 'rectangle') {
      const newAnn: OverlayAnnotation = {
        id: `ann_${Date.now()}`,
        pageIndex: currentPage - 1,
        type: 'rectangle',
        x: xPct,
        y: yPct,
        width: 25,
        height: 12,
        color: strokeColor,
      };
      addAnnotation(newAnn);
    } else if (activeTool === 'note') {
      const note = window.prompt('Sticky note text:');
      if (note && note.trim()) {
        const newAnn: OverlayAnnotation = {
          id: `ann_${Date.now()}`,
          pageIndex: currentPage - 1,
          type: 'note',
          x: xPct,
          y: yPct,
          content: note.trim(),
          color: '#fbbf24',
        };
        addAnnotation(newAnn);
      }
    }
  };

  const addAnnotation = (ann: OverlayAnnotation) => {
    const updated = [...overlays, ann];
    setOverlays(updated);
    // Push to undo history
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(updated);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setOverlays(prev);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setOverlays([]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setOverlays(next);
    }
  };

  // Rotate current page 90 degrees
  const handleRotateCurrentPage = async () => {
    if (!pdfBuffer) return;
    setSaveStatus('saving');
    try {
      const updatedBuffer = await rotatePdfPages(pdfBuffer, [
        { pageIndex: currentPage - 1, degrees: 90 },
      ]);
      setPdfBuffer(updatedBuffer);
      await updateDocumentBuffer(document.id, updatedBuffer, `Rotated page ${currentPage} by 90°`);
      setSaveStatus('saved');
    } catch (e) {
      console.error(e);
      setSaveStatus('idle');
    }
  };

  // Delete current page
  const handleDeleteCurrentPage = async () => {
    if (!pdfBuffer || numPages <= 1) {
      addToast('Cannot delete the only page in document', 'warning');
      return;
    }
    if (!window.confirm(`Delete page ${currentPage} permanently?`)) return;

    setSaveStatus('saving');
    try {
      const keepIndices = Array.from({ length: numPages }, (_, i) => i).filter(
        (i) => i !== currentPage - 1
      );
      const updatedBuffer = await modifyPageOrder(pdfBuffer, keepIndices);
      setPdfBuffer(updatedBuffer);
      setCurrentPage((prev) => Math.max(1, prev - 1));
      await updateDocumentBuffer(document.id, updatedBuffer, `Deleted page ${currentPage}`);
      setSaveStatus('saved');
    } catch (e) {
      console.error(e);
      setSaveStatus('idle');
    }
  };

  // Save overlays directly to the PDF
  const handleSaveOverlays = async () => {
    if (!pdfBuffer) return;
    setSaveStatus('saving');
    try {
      let finalBuffer = pdfBuffer;
      if (overlays.length > 0) {
        finalBuffer = await applyOverlays(pdfBuffer, overlays);
      }
      setPdfBuffer(finalBuffer);
      setOverlays([]);
      await updateDocumentBuffer(document.id, finalBuffer, 'Baked annotations into PDF');
      setSaveStatus('saved');
    } catch (e) {
      console.error(e);
      setSaveStatus('idle');
    }
  };

  const handleDownload = () => {
    if (!pdfBuffer) return;
    downloadPdf(pdfBuffer, title);
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (title.trim() && title !== document.filename) {
      renameDocument(document.id, title.trim());
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 select-none overflow-hidden">
      {/* 1. TOP CONTROL BAR */}
      <div className="h-14 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Back to Document Library"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Editable Document Name */}
          <div className="flex items-center gap-2 truncate">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                autoFocus
                className="bg-slate-800 px-2.5 py-1 text-sm font-semibold rounded-lg text-white border border-rose-500 outline-none"
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className="text-sm font-semibold text-white truncate hover:bg-slate-800/80 px-2 py-1 rounded-lg cursor-pointer transition-colors"
                title="Click to rename"
              >
                {title}
              </h2>
            )}

            {/* Saved Status Pill */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              <Check className="w-3 h-3" />
              <span>Saved to PDF Studio</span>
            </span>
          </div>
        </div>

        {/* Center Page Nav & Zoom */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Page Selector */}
          <div className="flex items-center bg-slate-800/80 rounded-xl px-2 py-1 text-xs text-slate-300 border border-slate-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              {currentPage} / {numPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
              className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="hidden md:flex items-center bg-slate-800/80 rounded-xl px-1.5 py-1 text-xs border border-slate-700">
            <button
              onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.15))}
              className="p-1 hover:text-white text-slate-400 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium text-slate-300">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((z) => Math.min(2.0, z + 0.15))}
              className="p-1 hover:text-white text-slate-400 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {overlays.length > 0 && (
            <button
              onClick={handleSaveOverlays}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Bake Edits</span>
            </button>
          )}

          <button
            onClick={() => onShare(document)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-white text-slate-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* 2. SECONDARY TOOLBAR (Tools Selector) */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-4 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTool('select')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTool === 'select' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span>Select / View</span>
          </button>

          <button
            onClick={() => setActiveTool('text')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTool === 'text' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text</span>
          </button>

          <button
            onClick={() => setActiveTool('draw')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTool === 'draw' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Pen</span>
          </button>

          <button
            onClick={() => setActiveTool('highlight')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTool === 'highlight' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Highlight</span>
          </button>

          <button
            onClick={() => setActiveTool('rectangle')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTool === 'rectangle' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>Box</span>
          </button>

          <button
            onClick={() => setActiveTool('note')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTool === 'note' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" />
            <span>Sticky Note</span>
          </button>

          <button
            onClick={() => onOpenTool('sign', document)}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSignature className="w-3.5 h-3.5 text-indigo-400" />
            <span>Signature...</span>
          </button>
        </div>

        {/* Undo / Redo & Page Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex < 0}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={handleRotateCurrentPage}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Rotate this page 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteCurrentPage}
            className="p-1.5 rounded-lg hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
            title="Delete this page"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thumbnails Strip */}
        <div className="w-44 bg-slate-950 border-r border-slate-800 p-3 overflow-y-auto hidden sm:flex flex-col gap-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Pages ({numPages})
          </div>
          {Array.from({ length: numPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;

            return (
              <div
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  isCurrent
                    ? 'bg-rose-950/40 border-rose-500 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-24 h-32 bg-white rounded-md shadow-xs flex items-center justify-center text-slate-300 text-xs">
                  Page {pageNum}
                </div>
                <span className={`text-[11px] font-medium ${isCurrent ? 'text-rose-400' : 'text-slate-400'}`}>
                  {pageNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center PDF Canvas Viewport */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-900/90 relative">
          <div
            className="relative bg-white shadow-2xl rounded-sm overflow-hidden"
            onClick={handlePageClick}
            style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
          >
            {/* The PDF.js Canvas */}
            <canvas ref={canvasRef} className="block max-w-none" />

            {/* The Freehand Canvas Overlay */}
            <canvas
              ref={drawingCanvasRef}
              onMouseDown={startDrawing}
              onMouseMove={drawMove}
              onMouseUp={stopDrawing}
              className={`absolute inset-0 z-10 ${
                activeTool === 'draw' || activeTool === 'highlight'
                  ? 'pointer-events-auto cursor-crosshair'
                  : 'pointer-events-none'
              }`}
            />

            {/* Stamped Interactive Overlays on Current Page */}
            {overlays
              .filter((ann) => ann.pageIndex === currentPage - 1)
              .map((ann) => {
                if (ann.type === 'text') {
                  return (
                    <div
                      key={ann.id}
                      className="absolute z-20 px-1 py-0.5 rounded font-sans font-semibold shadow-xs"
                      style={{
                        left: `${ann.x}%`,
                        top: `${ann.y}%`,
                        color: ann.color,
                        fontSize: `${ann.fontSize || 14}px`,
                      }}
                    >
                      {ann.content}
                    </div>
                  );
                } else if (ann.type === 'rectangle') {
                  return (
                    <div
                      key={ann.id}
                      className="absolute z-20 border-2 rounded-xs"
                      style={{
                        left: `${ann.x}%`,
                        top: `${ann.y}%`,
                        width: `${ann.width || 20}%`,
                        height: `${ann.height || 10}%`,
                        borderColor: ann.color,
                      }}
                    />
                  );
                } else if (ann.type === 'note') {
                  return (
                    <div
                      key={ann.id}
                      className="absolute z-20 p-2 bg-amber-200 text-amber-900 text-xs rounded-lg shadow-md max-w-xs border border-amber-300 font-medium"
                      style={{
                        left: `${ann.x}%`,
                        top: `${ann.y}%`,
                      }}
                    >
                      📌 {ann.content}
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </div>

        {/* Right Helper / Quick Tools Shelf */}
        <div className="w-56 bg-slate-950 border-l border-slate-800 p-4 hidden lg:flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tool Operations
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => onOpenTool('watermark', document)}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Stamp Watermark...
              </button>
              <button
                onClick={() => onOpenTool('page-numbers', document)}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Add Page Numbers...
              </button>
              <button
                onClick={() => onOpenTool('extract-text', document)}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Extract All Text...
              </button>
              <button
                onClick={() => onOpenTool('extract-images', document)}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Extract Images...
              </button>
              <button
                onClick={() => onOpenTool('compress', document)}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Compress Document...
              </button>
              <button
                onClick={() => onOpenTool('metadata', document)}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Edit PDF Metadata...
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-200">Tip:</span> Select "Text" or "Box" and click anywhere on the page to stamp overlays. Click "Bake Edits" to permanently save into the PDF file.
          </div>
        </div>
      </div>
    </div>
  );
};
