import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import {
  X,
  Sliders,
  User,
  HardDrive,
  Shield,
  Clock,
  Download,
  ShieldCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const { user, isGuest, updateProfile } = useAuth();
  const {
    settings,
    updateSettings,
    storageStats,
    activities,
    documents,
    trashDocuments,
    folders,
    addToast,
  } = useDocuments();

  const [activeTab, setActiveTab] = useState<'vault' | 'account' | 'activity' | 'privacy'>('vault');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      updateProfile(name.trim(), email.trim());
      addToast('Profile updated', 'success');
    }
  };

  const handleExportAll = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      user,
      settings,
      documentsCount: documents.length,
      documentsMetadata: documents,
      trashCount: trashDocuments.length,
      trashMetadata: trashDocuments,
      folders,
      activities,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pdf_studio_vault_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Vault archive exported successfully', 'success');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">PDF Studio Settings</h2>
              <p className="text-xs text-slate-500">Vault retention, storage analytics, and privacy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold my-4 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex-1 min-w-[90px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'vault' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Vault & Storage</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 min-w-[90px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'activity' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Activity History</span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 min-w-[90px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'account' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 min-w-[90px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'privacy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Notice</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* TAB 1: VAULT & STORAGE */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              {/* Storage Usage Meter */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Storage Used</span>
                  <span>{storageStats.quotaPercent}% Used</span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-600 h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (storageStats.pdfBytes / storageStats.totalBytes) * 100
                      )}%`,
                    }}
                    title="Active PDFs"
                  />
                  <div
                    className="bg-amber-500 h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (storageStats.trashBytes / storageStats.totalBytes) * 100
                      )}%`,
                    }}
                    title="Recovery Vault (Trash)"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    <span>Active PDFs: {formatSize(storageStats.pdfBytes)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Trash Vault: {formatSize(storageStats.trashBytes)}</span>
                  </div>
                  <div className="font-semibold text-slate-700">
                    Total: {formatSize(storageStats.usedBytes)} / {formatSize(storageStats.totalBytes)}
                  </div>
                </div>
              </div>

              {/* Recovery Retention Policy Configuration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recovery Vault Retention Period</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  When you delete a document, it enters the Recovery Vault and remains recoverable until the retention duration expires, after which it is permanently purged.
                </p>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700">Retention Duration:</label>
                  <select
                    value={settings.retentionDays}
                    onChange={(e) =>
                      updateSettings({ retentionDays: parseInt(e.target.value, 10) })
                    }
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days (Default Recommended)</option>
                    <option value={60}>60 Days</option>
                    <option value={90}>90 Days</option>
                  </select>
                </div>
              </div>

              {/* Export Full Workspace Archive */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Export Vault Metadata Backup</div>
                  <div className="text-[11px] text-slate-400">
                    Download complete index of all documents, versions, tags, and activity history
                  </div>
                </div>
                <button
                  onClick={handleExportAll}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY HISTORY */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Recent Document Actions
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 italic">
                  No activity recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {activities.slice(0, 30).map((act) => (
                    <div
                      key={act.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800">{act.description}</div>
                        {act.documentName && (
                          <div className="text-[11px] text-slate-400">{act.documentName}</div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              {isGuest ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <div className="text-xs font-bold text-amber-900">You are currently using Guest Mode</div>
                  <p className="text-xs text-amber-700">
                    Documents are stored locally for this browser session. Create an account to permanently sync and safeguard your PDF Studio library across devices.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Sign In or Create Account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">PDF Studio Privacy Model</div>
                <p>
                  <strong>What is stored?</strong> Your PDF files and metadata are stored securely in your browser's dedicated storage vault (IndexedDB).
                </p>
                <p>
                  <strong>Is document content used for AI training?</strong> No. As stated in our product principles: User documents are <strong>never</strong> used for AI model training.
                </p>
                <p>
                  <strong>Deletion Lifecycle:</strong> When you delete a document, it is preserved in the Recovery Vault for {settings.retentionDays} days. Once permanently deleted or expired, the underlying storage binary is permanently erased.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
