import React, { useState, useRef, useEffect } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { applyOverlays } from '../../services/pdfEngine';
import { getPdfBlob } from '../../services/storage';
import { DocumentItem } from '../../types';
import {
  X,
  PenTool,
  Type,
  Upload,
  Eraser,
  Check,
  FileSignature,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface SignModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const SignModal: React.FC<SignModalProps> = ({
  isOpen,
  onClose,
  document: initialDoc,
  onOpenDocument,
}) => {
  const { documents, updateDocumentBuffer, addToast } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDoc?.id || documents[0]?.id || '');
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');

  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#0f172a'); // deep navy

  // Type signature state
  const [typedName, setTypedName] = useState('Alex Morgan');
  const [fontFamily, setFontFamily] = useState<'Dancing Script' | 'Playfair Display'>('Dancing Script');

  // Uploaded signature
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Position on PDF
  const [targetPage, setTargetPage] = useState<number>(1);
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'center'>('bottom-right');
  const [isProcessing, setIsProcessing] = useState(false);

  const activeDoc = documents.find((d) => d.id === selectedDocId) || initialDoc;

  // Initialize canvas
  useEffect(() => {
    if (!isOpen || tab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = penColor;
  }, [isOpen, tab, penColor]);

  if (!isOpen) return null;

  // Canvas drawing handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Generate PNG data URL from current signature tab
  const getSignatureDataUrl = (): string | null => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : null;
    } else if (tab === 'type') {
      const offscreen = document.createElement('canvas');
      offscreen.width = 400;
      offscreen.height = 120;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = penColor;
      ctx.font = `italic 38px "${fontFamily}", cursive, serif`;
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName || 'Signature', 20, 60);
      return offscreen.toDataURL('image/png');
    } else if (tab === 'upload') {
      return uploadedImage;
    }
    return null;
  };

  const handleApplySignature = async () => {
    if (!activeDoc) {
      addToast('Please select a document', 'warning');
      return;
    }

    const sigDataUrl = getSignatureDataUrl();
    if (!sigDataUrl) {
      addToast('Please draw or provide a signature', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await getPdfBlob(activeDoc.id);
      if (!buffer) throw new Error('File data unavailable');

      let x = 65;
      let y = 82;
      if (position === 'bottom-left') {
        x = 10;
        y = 82;
      } else if (position === 'center') {
        x = 38;
        y = 50;
      }

      const signedBuffer = await applyOverlays(buffer, [
        {
          id: `sig_${Date.now()}`,
          pageIndex: Math.max(0, targetPage - 1),
          type: 'signature',
          x,
          y,
          width: 25,
          height: 10,
          color: penColor,
          imageData: sigDataUrl,
        },
      ]);

      const updated = await updateDocumentBuffer(
        activeDoc.id,
        signedBuffer,
        `Added signature to page ${targetPage}`
      );

      setIsProcessing(false);
      onClose();
      onOpenDocument(updated);
    } catch (err: any) {
      console.error(err);
      addToast('Failed to apply signature: ' + err.message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Sign Document</h2>
              <p className="text-xs text-slate-500">Create and place signature onto your PDF</p>
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
          {/* Target Document */}
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

          {/* Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setTab('draw')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'draw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Draw</span>
            </button>
            <button
              onClick={() => setTab('type')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'type' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Type</span>
            </button>
            <button
              onClick={() => setTab('upload')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>

          {/* Tab 1: Draw on Canvas */}
          {tab === 'draw' && (
            <div className="space-y-2">
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={150}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  className="w-full h-36 bg-white cursor-crosshair touch-none"
                />
                <button
                  onClick={clearCanvas}
                  className="absolute bottom-2 right-2 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1 shadow-2xs"
                  title="Clear signature"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Color Selector */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                <span>Ink Color:</span>
                {['#0f172a', '#1e40af', '#b91c1c'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPenColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      penColor === color ? 'scale-110 border-indigo-600' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Type Signature */}
          {tab === 'type' && (
            <div className="space-y-3">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Type your name..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500"
              />

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center min-h-[90px] flex items-center justify-center">
                <span
                  style={{
                    fontFamily: `"${fontFamily}", cursive`,
                    fontSize: '34px',
                    color: penColor,
                  }}
                >
                  {typedName || 'Signature Preview'}
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Upload Image */}
          {tab === 'upload' && (
            <div>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl bg-slate-50 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Choose PNG or JPG signature image</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Transparent background recommended</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const reader = new FileReader();
                      reader.onload = (re) => setUploadedImage(re.target?.result as string);
                      reader.readAsDataURL(f);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {uploadedImage && (
                <div className="mt-3 p-3 bg-slate-100 rounded-xl flex items-center justify-center">
                  <img src={uploadedImage} alt="Uploaded" className="max-h-24 object-contain" />
                </div>
              )}
            </div>
          )}

          {/* Placement Settings */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Page:</label>
              <input
                type="number"
                min={1}
                max={activeDoc?.pageCount || 1}
                value={targetPage}
                onChange={(e) => setTargetPage(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Position Preset:</label>
              <select
                value={position}
                onChange={(e: any) => setPosition(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="center">Center of Page</option>
              </select>
            </div>
          </div>

          {/* Notice as required by section 20 */}
          <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              This embeds an electronic signature stamp. It does not constitute a legally certified digital cryptographic signature.
            </span>
          </div>
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
            onClick={handleApplySignature}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying Stamp...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Sign & Save to PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
