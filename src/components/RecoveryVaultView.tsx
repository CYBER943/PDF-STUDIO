import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { DocumentItem } from '../types';
import {
  ShieldAlert,
  RotateCcw,
  Trash2,
  AlertTriangle,
  Folder,
  Calendar,
  Layers,
  FileText,
  Info,
} from 'lucide-react';

export const RecoveryVaultView: React.FC = () => {
  const {
    trashDocuments,
    folders,
    restoreFromTrash,
    deletePermanently,
    emptyTrash,
    settings,
  } = useDocuments();

  const [confirmPermanentDoc, setConfirmPermanentDoc] = useState<DocumentItem | null>(null);
  const [showConfirmEmpty, setShowConfirmEmpty] = useState(false);

  // Calculate days remaining until automatic permanent deletion
  const getDaysRemaining = (retentionExpiry: string | null) => {
    if (!retentionExpiry) return settings.retentionDays;
    const now = new Date().getTime();
    const expiry = new Date(retentionExpiry).getTime();
    const diffDays = Math.ceil((expiry - now) / (1000 * 3600 * 24));
    return Math.max(0, diffDays);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Recovery Vault Header & Lifecycle Explanation Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-slate-100 rounded-3xl border border-amber-200/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Recovery Vault
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  {trashDocuments.length} Protected Items
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Items in Trash are automatically deleted after{' '}
                <strong className="text-slate-900 font-semibold">{settings.retentionDays} days</strong>.
                You can safely restore any document back to its original folder before the retention period expires.
              </p>
            </div>
          </div>

          {trashDocuments.length > 0 && (
            <button
              onClick={() => setShowConfirmEmpty(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Vault</span>
            </button>
          )}
        </div>

        {/* Data Retention Lifecycle Visual */}
        <div className="mt-4 pt-4 border-t border-amber-200/40 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active Library</span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Recovery Vault (Trash)</span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>{settings.retentionDays} Days Retention</span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Permanent Deletion</span>
          </div>
        </div>
      </div>

      {/* List of Trashed Documents */}
      {trashDocuments.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Your Recovery Vault is empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            When you delete documents from your library, they are safely retained here for {settings.retentionDays} days before being permanently purged.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trashDocuments.map((doc) => {
            const daysLeft = getDaysRemaining(doc.retentionExpiry);
            const originalFolder = folders.find((f) => f.id === doc.folderId);

            return (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-16 bg-slate-100 rounded-xl shrink-0 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {doc.thumbnail ? (
                      <img src={doc.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate" title={doc.filename}>
                      {doc.filename}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Folder className="w-3.5 h-3.5 text-slate-400" />
                        <span>Original: {originalFolder ? originalFolder.name : 'My PDFs (Root)'}</span>
                      </span>
                      <span>•</span>
                      <span>{formatSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deleted {doc.deletedAt ? new Date(doc.deletedAt).toLocaleDateString() : 'Recently'}</span>
                      </span>
                    </div>

                    {/* Retention Countdown Badge */}
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>
                        {daysLeft === 0
                          ? 'Scheduled for automatic purge today'
                          : `Automatically deleted in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vault Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => restoreFromTrash(doc.id)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    onClick={() => setConfirmPermanentDoc(doc)}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200/60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal: Delete Permanently */}
      {confirmPermanentDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Delete Permanently?</h3>
              <p className="text-xs text-rose-600 font-semibold mt-1">
                “This action permanently deletes the file and it cannot be recovered through PDF Studio.”
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to permanently erase <strong className="text-slate-700">{confirmPermanentDoc.filename}</strong>?
                The underlying storage blob and all versions will be immediately destroyed.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfirmPermanentDoc(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePermanently(confirmPermanentDoc.id);
                  setConfirmPermanentDoc(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Empty Vault */}
      {showConfirmEmpty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Empty Recovery Vault?</h3>
              <p className="text-xs text-rose-600 font-semibold mt-1">
                “This action permanently deletes all {trashDocuments.length} files in the Recovery Vault and they cannot be recovered through PDF Studio.”
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmEmpty(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  emptyTrash();
                  setShowConfirmEmpty(false);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                Yes, Empty Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
