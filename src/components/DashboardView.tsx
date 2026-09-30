import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';
import { DocumentItem } from '../types';
import {
  FileText,
  Star,
  MoreVertical,
  Download,
  Trash2,
  FolderInput,
  Share2,
  History,
  FileEdit,
  Info,
  Calendar,
  Layers,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  Tag as TagIcon,
  FilePlus2,
  Combine,
  Scissors,
  PenTool,
  Minimize2,
  Stamp,
  Folder as FolderIcon,
  FolderOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenDocument: (doc: DocumentItem) => void;
  onOpenTool: (tool: string, doc?: DocumentItem) => void;
  onShareDocument: (doc: DocumentItem) => void;
  onVersionHistory: (doc: DocumentItem) => void;
  onMetadataModal: (doc: DocumentItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenDocument,
  onOpenTool,
  onShareDocument,
  onVersionHistory,
  onMetadataModal,
}) => {
  const { user } = useAuth();
  const {
    documents,
    folders,
    currentFolderId,
    setCurrentFolderId,
    selectedDocIds,
    toggleSelectDoc,
    selectAllDocs,
    clearSelection,
    searchQuery,
    selectedTag,
    setSelectedTag,
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    renameDocument,
    toggleFavorite,
    moveDocumentToFolder,
    moveToTrash,
    downloadDocument,
    storageStats,
  } = useDocuments();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);

  // Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Current folder name
  const currentFolder = folders.find((f) => f.id === currentFolderId);
  const childFolders = folders.filter((f) => f.parentId === currentFolderId);

  // Filter documents
  let filteredDocs = documents.filter((doc) => {
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.filename.toLowerCase().includes(q);
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchAuthor = doc.author.toLowerCase().includes(q);
      const matchTag = doc.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchTitle && !matchAuthor && !matchTag) return false;
    }

    // Tag filter
    if (selectedTag && !doc.tags.includes(selectedTag)) return false;

    // View filter
    if (activeFilter === 'favorites' && !doc.isFavorite) return false;
    if (activeFilter === 'recent') {
      const twoDaysAgo = Date.now() - 48 * 3600 * 1000;
      return new Date(doc.updatedAt).getTime() > twoDaysAgo;
    }

    // Folder filter (only when not searching or in special filter)
    if (!searchQuery && activeFilter === 'all') {
      return doc.folderId === currentFolderId;
    }

    return true;
  });

  // Sort documents
  filteredDocs.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'name-asc') return a.filename.localeCompare(b.filename);
    if (sortBy === 'name-desc') return b.filename.localeCompare(a.filename);
    if (sortBy === 'size') return b.fileSize - a.fileSize;
    return 0;
  });

  // Collect all unique tags for filter pills
  const allTags = Array.from(new Set(documents.flatMap((d) => d.tags)));

  // Format bytes
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRename = (doc: DocumentItem) => {
    const currentBase = doc.filename.replace(/\.pdf$/i, '');
    const newName = window.prompt('Rename document:', currentBase);
    if (newName && newName.trim()) {
      renameDocument(doc.id, newName.trim());
    }
  };

  const handleMovePrompt = (docId: string) => {
    const options = [
      { id: null, name: 'Root (My PDFs)' },
      ...folders.map((f) => ({ id: f.id, name: f.name })),
    ];
    const choice = window.prompt(
      'Move to folder:\n' + options.map((o, idx) => `${idx + 1}. ${o.name}`).join('\n')
    );
    const idx = parseInt(choice || '', 10) - 1;
    if (idx >= 0 && idx < options.length) {
      moveDocumentToFolder(docId, options[idx].id);
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6 space-y-8">
      {/* Top Welcome & Summary Section */}
      <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {getGreeting()}, <span className="text-rose-600">{user?.name ? user.name.split(' ')[0] : 'Creator'}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your personal PDF workspace remembers everything you create.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenTool('create-blank')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <FilePlus2 className="w-4 h-4 text-rose-400" />
              <span>Blank Document</span>
            </button>
            <button
              onClick={() => onOpenTool('all-tools')}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-medium transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Explore Tools</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Documents</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{storageStats.totalActiveCount}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">● Auto-saved to library</div>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vault Storage</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {(storageStats.usedBytes / (1024 * 1024)).toFixed(1)}{' '}
              <span className="text-xs text-slate-400 font-normal">MB</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{storageStats.quotaPercent}% of limit</div>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Favorites</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{storageStats.favoritesCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Starred documents</div>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recovery Vault</div>
            <div className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">{storageStats.trashCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Protected in Trash</div>
          </div>
        </div>
      </div>

      {/* Quick Launch PDF Tools Banner */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Core PDF Tools</span>
          </h2>
          <button
            onClick={() => onOpenTool('all-tools')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            View all 12 tools →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onOpenTool('merge')}
            className="p-3.5 bg-white hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-2xl text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Combine className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800">Merge PDFs</div>
            <div className="text-[11px] text-slate-400">Combine files</div>
          </button>

          <button
            onClick={() => onOpenTool('split')}
            className="p-3.5 bg-white hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 rounded-2xl text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Scissors className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800">Split PDF</div>
            <div className="text-[11px] text-slate-400">Extract pages</div>
          </button>

          <button
            onClick={() => onOpenTool('sign')}
            className="p-3.5 bg-white hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-2xl text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PenTool className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800">Sign PDF</div>
            <div className="text-[11px] text-slate-400">Draw or type</div>
          </button>

          <button
            onClick={() => onOpenTool('compress')}
            className="p-3.5 bg-white hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 rounded-2xl text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Minimize2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800">Compress</div>
            <div className="text-[11px] text-slate-400">Reduce file size</div>
          </button>

          <button
            onClick={() => onOpenTool('watermark')}
            className="p-3.5 bg-white hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-200 rounded-2xl text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Stamp className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800">Watermark</div>
            <div className="text-[11px] text-slate-400">Text & image</div>
          </button>

          <button
            onClick={() => onOpenTool('extract-text')}
            className="p-3.5 bg-white hover:bg-rose-50/50 border border-slate-200/80 hover:border-rose-200 rounded-2xl text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800">Extract Text</div>
            <div className="text-[11px] text-slate-400">Copy & Markdown</div>
          </button>
        </div>
      </div>

      {/* Main Document Explorer Bar */}
      <div>
        {/* Breadcrumb & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                setCurrentFolderId(null);
                setActiveFilter('all');
              }}
              className={`font-semibold hover:text-rose-600 flex items-center gap-1.5 ${
                currentFolderId === null && activeFilter === 'all'
                  ? 'text-slate-900'
                  : 'text-slate-400'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>My PDFs</span>
            </button>

            {currentFolder && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <FolderIcon className="w-4 h-4" style={{ color: currentFolder.color || '#3b82f6' }} />
                  {currentFolder.name}
                </span>
              </>
            )}

            {activeFilter === 'favorites' && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="font-semibold text-amber-600 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-500" />
                  Favorites
                </span>
              </>
            )}

            {activeFilter === 'recent' && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="font-semibold text-slate-700">Recent Documents</span>
              </>
            )}
          </div>

          {/* View Mode & Sorting */}
          <div className="flex items-center gap-2.5">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-xs cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size">Largest file</option>
              </select>
            </div>

            {/* Grid vs List Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400'
                }`}
                title="List view"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-folders chips if any */}
        {childFolders.length > 0 && !searchQuery && (
          <div className="flex flex-wrap gap-2 pt-4">
            {childFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolderId(folder.id)}
                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs"
              >
                <FolderIcon className="w-4 h-4" style={{ color: folder.color || '#3b82f6' }} />
                <span>{folder.name}</span>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {documents.filter((d) => d.folderId === folder.id).length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 pt-3 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1 mr-1">
              <TagIcon className="w-3.5 h-3.5" />
              Tags:
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                selectedTag === null
                  ? 'bg-slate-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Bulk Selection Bar */}
        {selectedDocIds.length > 0 && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium text-rose-900 animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="font-bold">{selectedDocIds.length} selected</span>
              <button onClick={selectAllDocs} className="underline hover:text-rose-700">
                Select all ({filteredDocs.length})
              </button>
              <button onClick={clearSelection} className="underline hover:text-rose-700">
                Clear
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const choice = window.prompt(
                    'Move to folder:\n1. Root\n' +
                      folders.map((f, i) => `${i + 2}. ${f.name}`).join('\n')
                  );
                  const idx = parseInt(choice || '', 10) - 1;
                  if (idx === 0) moveDocumentToFolder(selectedDocIds, null);
                  else if (idx > 0 && idx <= folders.length) {
                    moveDocumentToFolder(selectedDocIds, folders[idx - 1].id);
                  }
                }}
                className="px-3 py-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-100/50 flex items-center gap-1.5 transition-colors"
              >
                <FolderInput className="w-3.5 h-3.5" />
                <span>Move</span>
              </button>
              <button
                onClick={() => moveToTrash(selectedDocIds)}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Documents Content */}
        {filteredDocs.length === 0 ? (
          <div className="mt-12 text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-white/50">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No documents found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
              {searchQuery
                ? `No documents matched "${searchQuery}". Try a different keyword.`
                : 'Your PDF Studio library is ready. Create a blank PDF or upload an existing file.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onOpenTool('create-blank')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                Create Blank PDF
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDocIds.includes(doc.id);
              const isMenuOpen = activeMenuDocId === doc.id;

              return (
                <div
                  key={doc.id}
                  className={`group relative bg-white rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => onOpenDocument(doc)}
                >
                  {/* Card Thumbnail Preview */}
                  <div className="relative aspect-[3/4] max-h-52 bg-slate-100 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                    {doc.thumbnail ? (
                      <img
                        src={doc.thumbnail}
                        alt={doc.filename}
                        className="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-300">
                        <FileText className="w-12 h-12 stroke-[1.2]" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">PDF</span>
                      </div>
                    )}

                    {/* Page Count Badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-300" />
                      <span>{doc.pageCount || 1} {doc.pageCount === 1 ? 'page' : 'pages'}</span>
                    </div>

                    {/* Select Checkbox (top-left) */}
                    <div
                      className="absolute top-2.5 left-2.5 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectDoc(doc.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer shadow-xs"
                      />
                    </div>

                    {/* Star Favorite Button (top-right) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(doc.id);
                      }}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-sm transition-all ${
                        doc.isFavorite
                          ? 'bg-amber-50 text-amber-500 shadow-xs'
                          : 'bg-white/80 text-slate-400 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                      }`}
                      title="Toggle Favorite"
                    >
                      <Star
                        className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Card Metadata Details */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors"
                          title={doc.filename}
                        >
                          {doc.filename}
                        </h4>

                        {/* More Action Menu Button */}
                        <div
                          className="relative shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setActiveMenuDocId(isMenuOpen ? null : doc.id)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div
                              className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 text-xs text-slate-700 font-medium"
                              onMouseLeave={() => setActiveMenuDocId(null)}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuDocId(null);
                                  onOpenDocument(doc);
                                }}
                                className="w-full px-3.5 py-1.5 text-left hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2.5"
                              >
                                <FileEdit className="w-3.5 h-3.5 text-rose-600" />
                                <span>Edit in Studio</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuDocId(null);
                                  downloadDocument(doc);
                                }}
                                className="w-full px-3.5 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                <span>Download PDF</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuDocId(null);
                                  handleRename(doc);
                                }}
                                className="w-full px-3.5 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <TagIcon className="w-3.5 h-3.5 text-slate-500" />
                                <span>Rename</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuDocId(null);
                                  handleMovePrompt(doc.id);
                                }}
                                className="w-full px-3.5 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <FolderInput className="w-3.5 h-3.5 text-slate-500" />
                                <span>Move to folder</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuDocId(null);
                                  onShareDocument(doc);
                                }}
                                className="w-full px-3.5 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Share link</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuDocId(null);
                                  onVersionHistory(doc);
                                }}
                                className="w-full px-3.5 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <History className="w-3.5 h-3.5 text-slate-500" />
                                <span>Version history (v{doc.version || 1})</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuDocId(null);
                                  onMetadataModal(doc);
                                }}
                                className="w-full px-3.5 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <Info className="w-3.5 h-3.5 text-slate-500" />
                                <span>Metadata info</span>
                              </button>
                              <div className="my-1 border-t border-slate-100" />
                              <button
                                onClick={() => {
                                  setActiveMenuDocId(null);
                                  moveToTrash(doc.id);
                                }}
                                className="w-full px-3.5 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Move to Trash</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {doc.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                      <span>{formatSize(doc.fileSize)}</span>
                      <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDocIds.includes(doc.id);

              return (
                <div
                  key={doc.id}
                  onClick={() => onOpenDocument(doc)}
                  className={`flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-rose-50/60' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelectDoc(doc.id)}
                      className="w-4 h-4 rounded text-rose-600 border-slate-300 cursor-pointer"
                    />

                    <div className="w-9 h-11 bg-slate-100 rounded-lg shrink-0 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {doc.thumbnail ? (
                        <img src={doc.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">{doc.filename}</span>
                        {doc.isFavorite && (
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span>{formatSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>{doc.pageCount} page(s)</span>
                        <span>•</span>
                        <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onShareDocument(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveToTrash(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
