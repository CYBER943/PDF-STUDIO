import React, { useState } from 'react';
import { DocumentItem } from '../../types';
import { useDocuments } from '../../context/DocumentContext';
import {
  X,
  Share2,
  Copy,
  Check,
  Lock,
  Calendar,
  Download,
  Eye,
  ShieldCheck,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, document }) => {
  const { addToast } = useDocuments();
  const [allowDownload, setAllowDownload] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDays, setExpiryDays] = useState(7);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !document) return null;

  const shareCode = `pdf_${document.id.slice(-8)}`;
  const shareUrl = `${window.location.origin}/#share=${shareCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast('Share link copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Share Document</h2>
              <p className="text-xs text-slate-500">Create a secure link for {document.filename}</p>
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
        <div className="py-4 space-y-4">
          {/* Share URL Input & Copy */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Secure Share Link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-mono select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Access Permissions */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Link Permissions & Security
            </div>

            {/* View / Download */}
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Allow File Download</div>
                  <div className="text-[11px] text-slate-400">Recipient can download original PDF binary</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowDownload}
                onChange={(e) => setAllowDownload(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            {/* Password Protection */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Password Protection</div>
                    <div className="text-[11px] text-slate-400">Require password before viewing</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasPassword}
                  onChange={(e) => setHasPassword(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              {hasPassword && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access password..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              )}
            </div>

            {/* Expiration Date */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Link Expiration</div>
                    <div className="text-[11px] text-slate-400">Automatically revoke access after period</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasExpiry}
                  onChange={(e) => setHasExpiry(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              {hasExpiry && (
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value={1}>Expires in 24 hours</option>
                  <option value={7}>Expires in 7 days</option>
                  <option value={30}>Expires in 30 days</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
