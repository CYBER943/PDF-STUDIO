import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';
import {
  Search,
  Plus,
  Upload,
  FilePlus2,
  HardDrive,
  Wrench,
  User as UserIcon,
  LogOut,
  FolderPlus,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenTool: (tool: string) => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onUploadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTool,
  onOpenSettings,
  onOpenAuth,
  onUploadClick,
}) => {
  const { user, isGuest, logout } = useAuth();
  const { searchQuery, setSearchQuery, storageStats, createFolder } = useDocuments();
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleCreateFolderPrompt = () => {
    const name = window.prompt('Enter folder name:');
    if (name && name.trim()) {
      createFolder(name.trim());
    }
    setShowNewMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-100">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 15h6"></path>
              <path d="M9 18h4"></path>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                PDF <span className="text-rose-600">STUDIO</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                Workspace
              </span>
            </div>
            <p className="hidden md:block text-[11px] font-medium text-slate-400 -mt-0.5">
              Create. Manage. Find. Recover.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by filename, tag, or content..."
              className="w-full pl-10 pr-10 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-rose-400 focus:ring-3 focus:ring-rose-500/10 rounded-xl text-sm transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Create / Upload Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNewMenu(!showNewMenu)}
              className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-sm font-semibold shadow-sm shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New PDF</span>
            </button>

            {showNewMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowNewMenu(false)}
              >
                <button
                  onClick={onUploadClick}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-3 transition-colors"
                >
                  <Upload className="w-4 h-4 text-rose-600" />
                  <div>
                    <div className="font-semibold">Upload PDF</div>
                    <div className="text-xs text-slate-400">Import existing document</div>
                  </div>
                </button>
                <button
                  onClick={() => onOpenTool('create-blank')}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-3 transition-colors"
                >
                  <FilePlus2 className="w-4 h-4 text-rose-600" />
                  <div>
                    <div className="font-semibold">Create Blank PDF</div>
                    <div className="text-xs text-slate-400">Custom size, blank or formatted</div>
                  </div>
                </button>
                <button
                  onClick={() => onOpenTool('images-to-pdf')}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-3 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="font-semibold">Images to PDF</div>
                    <div className="text-xs text-slate-400">Convert JPG/PNG to PDF</div>
                  </div>
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={handleCreateFolderPrompt}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <FolderPlus className="w-4 h-4 text-slate-500" />
                  <span>New Folder</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Tools Button */}
          <button
            onClick={() => onOpenTool('all-tools')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            title="Browse all PDF Tools"
          >
            <Wrench className="w-4 h-4 text-slate-500" />
            <span>Tools</span>
          </button>

          {/* Storage Quota Indicator */}
          <div
            onClick={onOpenSettings}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/70 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-600 border border-slate-200/60 cursor-pointer transition-colors"
            title="Storage Vault Usage"
          >
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {(storageStats.usedBytes / (1024 * 1024)).toFixed(1)} MB / {(storageStats.totalBytes / (1024 * 1024)).toFixed(0)} MB
            </span>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  storageStats.quotaPercent > 85 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, storageStats.quotaPercent)}%` }}
              />
            </div>
          </div>

          {/* User Account / Guest Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase ring-2 ring-slate-100">
                {isGuest ? 'G' : user?.name ? user.name[0] : 'U'}
              </div>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowUserMenu(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-semibold text-sm text-slate-900">{user?.name || 'Guest User'}</div>
                  <div className="text-xs text-slate-400 truncate">{user?.email || 'Temporary Session'}</div>
                  {isGuest && (
                    <div className="mt-2 text-xs bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded-lg">
                      ⚠️ Guest Mode. Documents are stored locally for this session.
                    </div>
                  )}
                </div>

                {isGuest ? (
                  <button
                    onClick={onOpenAuth}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" />
                    Sign in or Create Account
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onOpenSettings}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Sliders className="w-4 h-4 text-slate-400" />
                      Settings & Vault Retention
                    </button>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
