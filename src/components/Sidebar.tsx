import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import {
  FileText,
  Clock,
  Star,
  Folder as FolderIcon,
  Trash2,
  Wrench,
  Plus,
  ChevronRight,
  HardDrive,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  onOpenTool: (toolName: string) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenTool, onOpenSettings }) => {
  const {
    folders,
    currentFolderId,
    setCurrentFolderId,
    activeFilter,
    setActiveFilter,
    storageStats,
    createFolder,
    settings,
  } = useDocuments();

  const [foldersOpen, setFoldersOpen] = useState(true);

  const handleNewFolder = () => {
    const name = window.prompt('New folder name:');
    if (name && name.trim()) {
      createFolder(name.trim(), currentFolderId);
    }
  };

  const navItemClass = (isActive: boolean) =>
    `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
      isActive
        ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs shadow-rose-100'
        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
    }`;

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200 bg-white/60 p-4 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      {/* Navigation Sections */}
      <div className="space-y-6">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Document Library
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveFilter('all');
                setCurrentFolderId(null);
              }}
              className={navItemClass(activeFilter === 'all' && currentFolderId === null)}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>My PDFs</span>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-normal">
                {storageStats.totalActiveCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveFilter('recent');
                setCurrentFolderId(null);
              }}
              className={navItemClass(activeFilter === 'recent')}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Recent</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveFilter('favorites');
                setCurrentFolderId(null);
              }}
              className={navItemClass(activeFilter === 'favorites')}
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Favorites</span>
              </div>
              {storageStats.favoritesCount > 0 && (
                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {storageStats.favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Folders Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <button
              onClick={() => setFoldersOpen(!foldersOpen)}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${foldersOpen ? 'rotate-90' : ''}`}
              />
              <span>Folders</span>
            </button>
            <button
              onClick={handleNewFolder}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
              title="Add Folder"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {foldersOpen && (
            <div className="space-y-1">
              {folders.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-400 italic">No folders created yet</div>
              ) : (
                folders.map((folder) => {
                  const isCurrent = currentFolderId === folder.id;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setActiveFilter('all');
                        setCurrentFolderId(folder.id);
                      }}
                      className={navItemClass(isCurrent)}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FolderIcon
                          className="w-4 h-4 shrink-0"
                          style={{ color: folder.color || '#3b82f6' }}
                        />
                        <span className="truncate">{folder.name}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* PDF Tools Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            PDF Tools
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onOpenTool('merge')}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Merge PDFs</span>
            </button>
            <button
              onClick={() => onOpenTool('split')}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Split PDF</span>
            </button>
            <button
              onClick={() => onOpenTool('compress')}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Compress PDF</span>
            </button>
            <button
              onClick={() => onOpenTool('all-tools')}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Browse All Tools →</span>
            </button>
          </div>
        </div>

        {/* Recovery Vault / Trash */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Vault Protection
          </div>
          <button
            onClick={() => {
              setActiveFilter('trash');
              setCurrentFolderId(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeFilter === 'trash'
                ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-slate-500" />
              <span>Recovery Vault</span>
            </div>
            {storageStats.trashCount > 0 ? (
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold">
                {storageStats.trashCount}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">0</span>
            )}
          </button>
          <div className="px-3 mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Retained for {settings.retentionDays} days</span>
          </div>
        </div>
      </div>

      {/* Storage Vault Meter Widget at Bottom */}
      <div className="pt-4 border-t border-slate-200">
        <div
          onClick={onOpenSettings}
          className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              <span>Vault Storage</span>
            </div>
            <span className="text-slate-500">{storageStats.quotaPercent}%</span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                storageStats.quotaPercent > 85 ? 'bg-rose-500' : 'bg-rose-600'
              }`}
              style={{ width: `${Math.min(100, storageStats.quotaPercent)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{(storageStats.usedBytes / (1024 * 1024)).toFixed(1)} MB used</span>
            <span>{(storageStats.totalBytes / (1024 * 1024)).toFixed(0)} MB quota</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
