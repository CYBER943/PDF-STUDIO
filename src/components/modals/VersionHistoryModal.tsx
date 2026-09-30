import React from 'react';
import { DocumentItem, DocumentVersion } from '../../types';
import { useDocuments } from '../../context/DocumentContext';
import { getPdfBlob } from '../../services/storage';
import { downloadPdf } from '../../services/pdfEngine';
import {
  X,
  History,
  RotateCcw,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const { getDocumentVersions, restoreVersion, addToast } = useDocuments();

  if (!isOpen || !document) return null;

  const versions = getDocumentVersions(document.id);

  const handleDownloadVer = async (ver: DocumentVersion) => {
    const buf = await getPdfBlob(ver.storageKey);
    if (!buf) {
      addToast('Version data unavailable', 'error');
      return;
    }
    const name = `${document.filename.replace(/\.pdf$/i, '')}_v${ver.versionNumber}.pdf`;
    downloadPdf(buf, name);
  };

  const handleRestoreVer = async (ver: DocumentVersion) => {
    if (!window.confirm(`Restore to Version ${ver.versionNumber}? Current changes will be archived.`)) {
      return;
    }
    await restoreVersion(ver);
    onClose();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Version History</h2>
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

        {/* Versions List */}
        <div className="py-4 space-y-3 overflow-y-auto flex-1">
          {versions.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
              Only initial version available for this document.
            </div>
          ) : (
            versions.map((ver, idx) => {
              const isCurrent = ver.versionNumber === document.version;

              return (
                <div
                  key={ver.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Version {ver.versionNumber}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 mt-0.5">{ver.summary}</div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>{new Date(ver.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>{formatSize(ver.fileSize)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDownloadVer(ver)}
                      className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
                      title="Download this version"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {!isCurrent && (
                      <button
                        onClick={() => handleRestoreVer(ver)}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-900 hover:text-white text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shadow-2xs flex items-center gap-1"
                        title="Restore this version"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
