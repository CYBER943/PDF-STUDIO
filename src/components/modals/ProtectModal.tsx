import React, { useState } from 'react';
import { DocumentItem } from '../../types';
import { useDocuments } from '../../context/DocumentContext';
import { getPdfBlob } from '../../services/storage';
import { protectPdf, verifyAndUnlockPdf } from '../../services/pdfEngine';
import { X, Lock, Unlock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProtectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDoc?: DocumentItem | null;
}

export const ProtectModal: React.FC<ProtectModalProps> = ({
  isOpen,
  onClose,
  targetDoc,
}) => {
  const { documents, saveNewDocument, updateDocumentBuffer, addToast } = useDocuments();
  const [mode, setMode] = useState<'protect' | 'unlock'>('protect');
  const [selectedDocId, setSelectedDocId] = useState<string>(targetDoc?.id || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync when targetDoc changes
  React.useEffect(() => {
    if (targetDoc) {
      setSelectedDocId(targetDoc.id);
      if (targetDoc.hasPassword) {
        setMode('unlock');
      } else {
        setMode('protect');
      }
    } else if (documents.length > 0 && !selectedDocId) {
      setSelectedDocId(documents[0].id);
    }
  }, [targetDoc, documents]);

  if (!isOpen) return null;

  const currentDoc = documents.find((d) => d.id === selectedDocId);

  const handleProtect = async () => {
    setErrorMsg(null);
    if (!password) {
      setErrorMsg('Please enter a password');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!currentDoc) {
      setErrorMsg('Please select a document');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await getPdfBlob(currentDoc.id);
      if (!buffer) throw new Error('Document buffer could not be loaded');

      const { protectedBuffer } = await protectPdf(buffer, password);
      const newTitle = currentDoc.filename.replace(/\.pdf$/i, '') + ' (Protected).pdf';

      await saveNewDocument(newTitle, protectedBuffer, {
        folderId: currentDoc.folderId,
        tags: [...currentDoc.tags, 'Protected', 'Encrypted'],
      });

      addToast(`Document protected and saved to library`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to protect document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlock = async () => {
    setErrorMsg(null);
    if (!password) {
      setErrorMsg('Please enter the document password');
      return;
    }
    if (!currentDoc) {
      setErrorMsg('Please select a document');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await getPdfBlob(currentDoc.id);
      if (!buffer) throw new Error('Document buffer could not be loaded');

      const result = await verifyAndUnlockPdf(buffer, password);
      if (!result.success || !result.unlockedBuffer) {
        setErrorMsg(result.error || 'Incorrect password');
        setIsProcessing(false);
        return;
      }

      await updateDocumentBuffer(currentDoc.id, result.unlockedBuffer, 'Unlocked document with authorized password');
      addToast(`Document successfully unlocked`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to unlock document');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              {mode === 'protect' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {mode === 'protect' ? 'Protect PDF' : 'Unlock PDF'}
              </h2>
              <p className="text-xs text-slate-500">Security & Password Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('protect');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'protect'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Protect Document
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('unlock');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'unlock'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" /> Unlock Document
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Document selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename} ({Math.round(d.fileSize / 1024)} KB)
                </option>
              ))}
            </select>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {mode === 'protect' ? 'Set Password' : 'Enter Authorized Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full text-xs px-3 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password (only for protect mode) */}
          {mode === 'protect' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password..."
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                The protected document will be encrypted and saved to your personal library.
              </p>
            </div>
          )}

          {mode === 'unlock' && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Provide the password configured when this document was protected.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={mode === 'protect' ? handleProtect : handleUnlock}
            disabled={isProcessing}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            {isProcessing ? (
              'Processing...'
            ) : mode === 'protect' ? (
              <>
                <Lock className="w-3.5 h-3.5" /> Protect & Save
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" /> Unlock Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
