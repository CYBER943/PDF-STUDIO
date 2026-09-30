import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { addWatermark } from '../../services/pdfEngine';
import { getPdfBlob } from '../../services/storage';
import { DocumentItem } from '../../types';
import {
  X,
  Stamp,
  Type,
  Image as ImageIcon,
  Loader2,
  Check,
} from 'lucide-react';

interface WatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const WatermarkModal: React.FC<WatermarkModalProps> = ({
  isOpen,
  onClose,
  document: initialDoc,
  onOpenDocument,
}) => {
  const { documents, updateDocumentBuffer, addToast } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDoc?.id || documents[0]?.id || '');
  const [type, setType] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [rotation, setRotation] = useState(-45);
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ef4444');
  const [position, setPosition] = useState<
    'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile'
  >('center');
  const [imageBytes, setImageBytes] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const activeDoc = documents.find((d) => d.id === selectedDocId) || initialDoc;

  const handleApplyWatermark = async () => {
    if (!activeDoc) {
      addToast('Please select a document', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await getPdfBlob(activeDoc.id);
      if (!buffer) throw new Error('File data unavailable');

      const watermarked = await addWatermark(buffer, {
        type,
        text,
        imageBytes: imageBytes || undefined,
        opacity,
        rotation,
        fontSize,
        color,
        position,
      });

      const updated = await updateDocumentBuffer(
        activeDoc.id,
        watermarked,
        `Added watermark: "${type === 'text' ? text : 'Image logo'}"`
      );

      setIsProcessing(false);
      onClose();
      onOpenDocument(updated);
    } catch (err: any) {
      console.error(err);
      addToast('Failed to apply watermark: ' + err.message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Watermark</h2>
              <p className="text-xs text-slate-500">Protect or brand pages with text or image watermark</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
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
                  {d.filename} ({d.pageCount} pgs)
                </option>
              ))}
            </select>
          </div>

          {/* Type Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setType('text')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text Watermark</span>
            </button>
            <button
              onClick={() => setType('image')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'image' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image Watermark</span>
            </button>
          </div>

          {type === 'text' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Watermark Text:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                  {['CONFIDENTIAL', 'DRAFT', 'DO NOT COPY'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setText(preset)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-semibold text-slate-600"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Font Size ({fontSize}px):
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={96}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <span className="text-xs font-mono text-slate-500">{color}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-amber-300 rounded-2xl bg-slate-50 cursor-pointer">
                <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Choose Logo or Stamp Image (PNG/JPG)</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const ab = await f.arrayBuffer();
                      setImageBytes(new Uint8Array(ab));
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Opacity & Rotation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opacity ({Math.round(opacity * 100)}%):
              </label>
              <input
                type="range"
                min={0.05}
                max={1.0}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rotation ({rotation}°):
              </label>
              <input
                type="range"
                min={-90}
                max={90}
                step={15}
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
          </div>

          {/* Position Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Placement:</label>
            <select
              value={position}
              onChange={(e: any) => setPosition(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="center">Center of Page</option>
              <option value="tile">Tile Across Entire Page</option>
              <option value="top-right">Top Right Corner</option>
              <option value="top-left">Top Left Corner</option>
              <option value="bottom-right">Bottom Right Corner</option>
              <option value="bottom-left">Bottom Left Corner</option>
            </select>
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
            onClick={handleApplyWatermark}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying Watermark...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Apply & Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
