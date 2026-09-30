import React from 'react';
import { DocumentItem } from '../../types';
import {
  AlertCircle,
  Copy,
  FolderOpen,
  X,
} from 'lucide-react';

interface DuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingDoc: DocumentItem | null;
  onOpenExisting: (doc: DocumentItem) => void;
  onSaveCopy: () => void;
}

export const DuplicateModal: React.FC<DuplicateModalProps> = ({
  isOpen,
  onClose,
  existingDoc,
  onOpenExisting,
  onSaveCopy,
}) => {
  if (!isOpen || !existingDoc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="text-center">
          <h3 className="text-base font-bold text-slate-900">Duplicate PDF Detected</h3>
          <p className="text-xs text-slate-500 mt-1">
            An identical document with matching checksum already exists in your library:
          </p>
          <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 truncate">
            {existingDoc.filename}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenExisting(existingDoc);
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Open Existing Document</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onSaveCopy();
            }}
            className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4 text-slate-400" />
            <span>Save Another Copy</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
          >
            Cancel Upload
          </button>
        </div>
      </div>
    </div>
  );
};
