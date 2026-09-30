import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DocumentItem,
  Folder,
  DocumentVersion,
  ActivityLog,
  AppSettings,
} from '../types';
import {
  savePdfBlob,
  getPdfBlob,
  deletePdfBlob,
  getStoredDocuments,
  saveStoredDocuments,
  getStoredFolders,
  saveStoredFolders,
  getStoredVersions,
  saveStoredVersions,
  getStoredActivities,
  logActivity,
  getStoredSettings,
  saveStoredSettings,
} from '../services/storage';
import {
  calculateChecksum,
  generateThumbnail,
  createBlankPdf,
  downloadPdf,
} from '../services/pdfEngine';
import { useAuth } from './AuthContext';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface DocumentContextType {
  documents: DocumentItem[];
  trashDocuments: DocumentItem[];
  folders: Folder[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
  selectedDocIds: string[];
  setSelectedDocIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectDoc: (id: string) => void;
  selectAllDocs: () => void;
  clearSelection: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  activeFilter: 'all' | 'favorites' | 'recent' | 'trash';
  setActiveFilter: (filter: 'all' | 'favorites' | 'recent' | 'trash') => void;
  sortBy: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size';
  setSortBy: (sort: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size') => void;
  activeDocument: DocumentItem | null;
  setActiveDocument: (doc: DocumentItem | null) => void;
  saveNewDocument: (
    title: string,
    buffer: Uint8Array,
    options?: { folderId?: string | null; tags?: string[]; author?: string; originalFilename?: string }
  ) => Promise<DocumentItem>;
  updateDocumentBuffer: (
    id: string,
    buffer: Uint8Array,
    versionSummary?: string
  ) => Promise<DocumentItem>;
  renameDocument: (id: string, newName: string) => void;
  toggleFavorite: (id: string) => void;
  moveDocumentToFolder: (docId: string | string[], folderId: string | null) => void;
  addTagToDocument: (id: string, tag: string) => void;
  removeTagFromDocument: (id: string, tag: string) => void;
  moveToTrash: (docId: string | string[]) => void;
  restoreFromTrash: (docId: string | string[]) => void;
  deletePermanently: (docId: string | string[]) => Promise<void>;
  emptyTrash: () => Promise<void>;
  createFolder: (name: string, parentId?: string | null, color?: string) => Folder;
  renameFolder: (id: string, newName: string) => void;
  deleteFolder: (id: string) => void;
  downloadDocument: (doc: DocumentItem) => Promise<void>;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  activities: ActivityLog[];
  versions: DocumentVersion[];
  getDocumentVersions: (docId: string) => DocumentVersion[];
  restoreVersion: (version: DocumentVersion) => Promise<void>;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  storageStats: {
    totalBytes: number;
    usedBytes: number;
    pdfBytes: number;
    trashBytes: number;
    quotaPercent: number;
    totalActiveCount: number;
    favoritesCount: number;
    trashCount: number;
  };
  findDuplicateByChecksum: (buffer: Uint8Array) => Promise<DocumentItem | null>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'recent' | 'trash'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size'>('newest');
  const [activeDocument, setActiveDocument] = useState<DocumentItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Initial load and sample seeding
  useEffect(() => {
    const loadedDocs = getStoredDocuments();
    const loadedFolders = getStoredFolders();
    const loadedVersions = getStoredVersions();
    const loadedActivities = getStoredActivities();
    const loadedSettings = getStoredSettings();

    setFolders(loadedFolders);
    setVersions(loadedVersions);
    setActivities(loadedActivities);
    setSettings(loadedSettings);

    // Seed default sample documents if storage is completely empty
    if (loadedDocs.length === 0) {
      seedInitialWorkspace(loadedSettings.retentionDays);
    } else {
      // Purge expired trash items automatically based on retention settings
      const now = new Date().getTime();
      const validDocs: DocumentItem[] = [];
      const expiredDocs: DocumentItem[] = [];

      for (const doc of loadedDocs) {
        if (doc.status === 'trash' && doc.retentionExpiry) {
          const expiryTime = new Date(doc.retentionExpiry).getTime();
          if (expiryTime <= now) {
            expiredDocs.push(doc);
            continue;
          }
        }
        validDocs.push(doc);
      }

      if (expiredDocs.length > 0) {
        expiredDocs.forEach((d) => deletePdfBlob(d.id));
        saveStoredDocuments(validDocs);
      }

      setDocuments(validDocs);
    }
  }, []);

  // Helper to seed initial workspace with real PDFs
  const seedInitialWorkspace = async (retentionDays: number) => {
    try {
      const defaultFolders: Folder[] = [
        {
          id: 'fld_work',
          userId: user?.id || 'usr_demo_101',
          name: 'Work & Projects',
          parentId: null,
          color: '#3b82f6',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'fld_invoices',
          userId: user?.id || 'usr_demo_101',
          name: 'Invoices & Receipts',
          parentId: 'fld_work',
          color: '#10b981',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'fld_personal',
          userId: user?.id || 'usr_demo_101',
          name: 'Personal Documents',
          parentId: null,
          color: '#8b5cf6',
          createdAt: new Date().toISOString(),
        },
      ];

      saveStoredFolders(defaultFolders);
      setFolders(defaultFolders);

      // Create Sample 1: Welcome Guide
      const guideBuffer = await createBlankPdf({
        pageSize: 'A4',
        orientation: 'portrait',
        pageCount: 2,
        title: 'Welcome to PDF Studio',
        initialText:
          'PDF Studio is your personal PDF workspace. Every document you create, merge, edit, or split is automatically saved to your private library. Organize with folders, tags, favorites, and rest easy knowing the Recovery Vault protects against accidental deletions with automatic retention countdown.',
      });

      const guideThumb = await generateThumbnail(guideBuffer, 1);
      const guideChecksum = await calculateChecksum(guideBuffer);
      const guideId = 'doc_welcome_guide';

      await savePdfBlob(guideId, guideBuffer);

      const guideDoc: DocumentItem = {
        id: guideId,
        userId: user?.id || 'usr_demo_101',
        filename: 'Welcome to PDF Studio Guide.pdf',
        originalFilename: 'Welcome to PDF Studio Guide.pdf',
        mimeType: 'application/pdf',
        fileSize: guideBuffer.byteLength,
        storageKey: guideId,
        folderId: null,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        deletedAt: null,
        retentionExpiry: null,
        isFavorite: true,
        pageCount: 2,
        pdfVersion: '1.7',
        title: 'Welcome to PDF Studio Guide',
        author: 'PDF Studio Team',
        subject: 'Getting Started Guide',
        tags: ['Guide', 'Important', 'Vault'],
        thumbnail: guideThumb,
        checksum: guideChecksum,
        status: 'active',
        version: 1,
      };

      // Create Sample 2: Invoice
      const invoiceBuffer = await createBlankPdf({
        pageSize: 'A4',
        orientation: 'portrait',
        pageCount: 1,
        title: 'Invoice INV-2026-0948',
        initialText:
          'Billed To: ACME Corporation\nDate: September 2026\nServices: Enterprise Cloud Architecture & Document Security Vault Implementation\nSubtotal: $4,500.00\nTax (0%): $0.00\nTotal Due: $4,500.00\nStatus: Paid in Full via Direct Deposit.',
      });
      const invoiceThumb = await generateThumbnail(invoiceBuffer, 1);
      const invoiceChecksum = await calculateChecksum(invoiceBuffer);
      const invoiceId = 'doc_sample_invoice';

      await savePdfBlob(invoiceId, invoiceBuffer);

      const invoiceDoc: DocumentItem = {
        id: invoiceId,
        userId: user?.id || 'usr_demo_101',
        filename: 'Invoice INV-2026-0948.pdf',
        originalFilename: 'Invoice INV-2026-0948.pdf',
        mimeType: 'application/pdf',
        fileSize: invoiceBuffer.byteLength,
        storageKey: invoiceId,
        folderId: 'fld_invoices',
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        deletedAt: null,
        retentionExpiry: null,
        isFavorite: true,
        pageCount: 1,
        pdfVersion: '1.7',
        title: 'Invoice INV-2026-0948',
        author: 'Finance Dept',
        subject: 'Cloud Services Invoice',
        tags: ['Invoice', 'Work', '2026'],
        thumbnail: invoiceThumb,
        checksum: invoiceChecksum,
        status: 'active',
        version: 1,
      };

      // Create Sample 3: A document in Trash to showcase the Recovery Vault immediately!
      const trashBuffer = await createBlankPdf({
        pageSize: 'A4',
        orientation: 'portrait',
        pageCount: 1,
        title: 'Draft Project Notes - Archived',
        initialText:
          'Old draft notes from preliminary design sprint. This item is kept in the Recovery Vault and can be restored before permanent deletion.',
      });
      const trashThumb = await generateThumbnail(trashBuffer, 1);
      const trashChecksum = await calculateChecksum(trashBuffer);
      const trashId = 'doc_archived_notes';

      await savePdfBlob(trashId, trashBuffer);

      const deletedTimestamp = new Date(Date.now() - 6 * 24 * 3600 * 1000);
      const expiryTimestamp = new Date(deletedTimestamp.getTime() + retentionDays * 24 * 3600 * 1000);

      const trashDoc: DocumentItem = {
        id: trashId,
        userId: user?.id || 'usr_demo_101',
        filename: 'Draft Project Notes - Archived.pdf',
        originalFilename: 'Draft Project Notes - Archived.pdf',
        mimeType: 'application/pdf',
        fileSize: trashBuffer.byteLength,
        storageKey: trashId,
        folderId: 'fld_work',
        createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
        updatedAt: deletedTimestamp.toISOString(),
        deletedAt: deletedTimestamp.toISOString(),
        retentionExpiry: expiryTimestamp.toISOString(),
        isFavorite: false,
        pageCount: 1,
        pdfVersion: '1.7',
        title: 'Draft Project Notes',
        author: 'Alex Morgan',
        subject: 'Preliminary Notes',
        tags: ['Draft', 'Work'],
        thumbnail: trashThumb,
        checksum: trashChecksum,
        status: 'trash',
        version: 1,
      };

      const initialDocs = [guideDoc, invoiceDoc, trashDoc];
      saveStoredDocuments(initialDocs);
      setDocuments(initialDocs);

      logActivity({
        userId: user?.id || 'usr_demo_101',
        documentId: guideId,
        documentName: guideDoc.filename,
        action: 'create',
        description: 'Initialized Welcome Guide in PDF Studio',
      });
    } catch (e) {
      console.error('Failed to seed initial workspace', e);
    }
  };

  // Find duplicate file
  const findDuplicateByChecksum = async (buffer: Uint8Array): Promise<DocumentItem | null> => {
    const checksum = await calculateChecksum(buffer);
    const existing = documents.find((d) => d.status === 'active' && d.checksum === checksum);
    return existing || null;
  };

  // SAVE NEW DOCUMENT (Automatic Save Principle)
  const saveNewDocument = async (
    title: string,
    buffer: Uint8Array,
    options?: { folderId?: string | null; tags?: string[]; author?: string; originalFilename?: string }
  ): Promise<DocumentItem> => {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const checksum = await calculateChecksum(buffer);
    let thumbnail = '';
    try {
      thumbnail = await generateThumbnail(buffer, 1);
    } catch {
      thumbnail = '';
    }

    // Save binary into IndexedDB
    await savePdfBlob(id, buffer);

    const safeFilename = title.endsWith('.pdf') ? title : `${title}.pdf`;

    const newDoc: DocumentItem = {
      id,
      userId: user?.id || 'guest',
      filename: safeFilename,
      originalFilename: options?.originalFilename || safeFilename,
      mimeType: 'application/pdf',
      fileSize: buffer.byteLength,
      storageKey: id,
      folderId: options?.folderId !== undefined ? options.folderId : currentFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      retentionExpiry: null,
      isFavorite: false,
      pageCount: 1, // Will be computed/refined
      pdfVersion: '1.7',
      title: title.replace(/\.pdf$/i, ''),
      author: options?.author || user?.name || 'PDF Studio User',
      subject: '',
      tags: options?.tags || [],
      thumbnail,
      checksum,
      status: 'active',
      version: 1,
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveStoredDocuments(updated);

    // Initial version
    const versionEntry: DocumentVersion = {
      id: `ver_${Date.now()}`,
      documentId: id,
      versionNumber: 1,
      createdAt: new Date().toISOString(),
      fileSize: buffer.byteLength,
      pageCount: 1,
      summary: 'Initial document created',
      storageKey: id,
    };
    const updatedVersions = [versionEntry, ...versions];
    setVersions(updatedVersions);
    saveStoredVersions(updatedVersions);

    logActivity({
      userId: user?.id || 'guest',
      documentId: id,
      documentName: safeFilename,
      action: 'create',
      description: `Created and saved "${safeFilename}" to PDF Studio`,
    });

    addToast(`✓ Saved to PDF Studio: ${safeFilename}`, 'success');
    return newDoc;
  };

  // UPDATE DOCUMENT WITH NEW BUFFER & VERSION
  const updateDocumentBuffer = async (
    id: string,
    buffer: Uint8Array,
    versionSummary: string = 'Updated in PDF Studio'
  ): Promise<DocumentItem> => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) throw new Error('Document not found');

    const thumbnail = await generateThumbnail(buffer, 1);
    const checksum = await calculateChecksum(buffer);
    const newVersionNum = (doc.version || 1) + 1;

    // Save updated binary to IndexedDB
    await savePdfBlob(id, buffer);

    // Optionally save version binary under version key
    const versionKey = `ver_blob_${id}_v${newVersionNum}`;
    await savePdfBlob(versionKey, buffer);

    const updatedDoc: DocumentItem = {
      ...doc,
      fileSize: buffer.byteLength,
      thumbnail,
      checksum,
      updatedAt: new Date().toISOString(),
      version: newVersionNum,
    };

    const updatedDocs = documents.map((d) => (d.id === id ? updatedDoc : d));
    setDocuments(updatedDocs);
    saveStoredDocuments(updatedDocs);

    const newVersion: DocumentVersion = {
      id: `ver_${Date.now()}`,
      documentId: id,
      versionNumber: newVersionNum,
      createdAt: new Date().toISOString(),
      fileSize: buffer.byteLength,
      pageCount: doc.pageCount,
      summary: versionSummary,
      storageKey: versionKey,
    };

    const updatedVersions = [newVersion, ...versions];
    setVersions(updatedVersions);
    saveStoredVersions(updatedVersions);

    logActivity({
      userId: user?.id || 'guest',
      documentId: id,
      documentName: doc.filename,
      action: 'edit',
      description: `Edited "${doc.filename}" (v${newVersionNum})`,
    });

    addToast(`✓ Changes saved to PDF Studio`, 'success');
    return updatedDoc;
  };

  // RENAME
  const renameDocument = (id: string, newName: string) => {
    const cleanName = newName.trim();
    if (!cleanName) return;
    const finalName = cleanName.endsWith('.pdf') ? cleanName : `${cleanName}.pdf`;

    const updated = documents.map((d) => {
      if (d.id === id) {
        logActivity({
          userId: user?.id || 'guest',
          documentId: id,
          documentName: finalName,
          action: 'rename',
          description: `Renamed "${d.filename}" to "${finalName}"`,
        });
        return {
          ...d,
          filename: finalName,
          title: cleanName.replace(/\.pdf$/i, ''),
          updatedAt: new Date().toISOString(),
        };
      }
      return d;
    });

    setDocuments(updated);
    saveStoredDocuments(updated);
    addToast(`Renamed to ${finalName}`, 'info');
  };

  // FAVORITE TOGGLE
  const toggleFavorite = (id: string) => {
    const updated = documents.map((d) => {
      if (d.id === id) {
        const nextState = !d.isFavorite;
        logActivity({
          userId: user?.id || 'guest',
          documentId: id,
          documentName: d.filename,
          action: 'favorite',
          description: nextState ? `Marked "${d.filename}" as favorite` : `Removed favorite from "${d.filename}"`,
        });
        return { ...d, isFavorite: nextState };
      }
      return d;
    });
    setDocuments(updated);
    saveStoredDocuments(updated);
  };

  // MOVE TO FOLDER
  const moveDocumentToFolder = (docIdOrIds: string | string[], folderId: string | null) => {
    const ids = Array.isArray(docIdOrIds) ? docIdOrIds : [docIdOrIds];
    const targetFolder = folders.find((f) => f.id === folderId);
    const targetName = targetFolder ? targetFolder.name : 'My PDFs (Root)';

    const updated = documents.map((d) => {
      if (ids.includes(d.id)) {
        logActivity({
          userId: user?.id || 'guest',
          documentId: d.id,
          documentName: d.filename,
          action: 'move',
          description: `Moved "${d.filename}" to ${targetName}`,
        });
        return { ...d, folderId, updatedAt: new Date().toISOString() };
      }
      return d;
    });

    setDocuments(updated);
    saveStoredDocuments(updated);
    setSelectedDocIds([]);
    addToast(`Moved ${ids.length} document(s) to ${targetName}`, 'success');
  };

  // TAGS
  const addTagToDocument = (id: string, tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    const updated = documents.map((d) => {
      if (d.id === id && !d.tags.includes(clean)) {
        return { ...d, tags: [...d.tags, clean] };
      }
      return d;
    });
    setDocuments(updated);
    saveStoredDocuments(updated);
  };

  const removeTagFromDocument = (id: string, tag: string) => {
    const updated = documents.map((d) => {
      if (d.id === id) {
        return { ...d, tags: d.tags.filter((t) => t !== tag) };
      }
      return d;
    });
    setDocuments(updated);
    saveStoredDocuments(updated);
  };

  // MOVE TO TRASH (Retention countdown starts)
  const moveToTrash = (docIdOrIds: string | string[]) => {
    const ids = Array.isArray(docIdOrIds) ? docIdOrIds : [docIdOrIds];
    const now = new Date();
    const expiry = new Date(now.getTime() + settings.retentionDays * 24 * 3600 * 1000);

    const updated = documents.map((d) => {
      if (ids.includes(d.id)) {
        logActivity({
          userId: user?.id || 'guest',
          documentId: d.id,
          documentName: d.filename,
          action: 'trash',
          description: `Moved "${d.filename}" to Trash (retained for ${settings.retentionDays} days)`,
        });
        return {
          ...d,
          status: 'trash' as const,
          deletedAt: now.toISOString(),
          retentionExpiry: expiry.toISOString(),
        };
      }
      return d;
    });

    setDocuments(updated);
    saveStoredDocuments(updated);
    setSelectedDocIds([]);
    addToast(`Moved ${ids.length} document(s) to Trash. Retained for ${settings.retentionDays} days.`, 'warning');
  };

  // RESTORE FROM TRASH
  const restoreFromTrash = (docIdOrIds: string | string[]) => {
    const ids = Array.isArray(docIdOrIds) ? docIdOrIds : [docIdOrIds];

    const updated = documents.map((d) => {
      if (ids.includes(d.id)) {
        // If original folder still exists, keep it, otherwise restore to root
        const folderExists = d.folderId ? folders.some((f) => f.id === d.folderId) : true;
        const validFolderId = folderExists ? d.folderId : null;

        logActivity({
          userId: user?.id || 'guest',
          documentId: d.id,
          documentName: d.filename,
          action: 'restore',
          description: `Restored "${d.filename}" from Trash`,
        });

        return {
          ...d,
          status: 'active' as const,
          deletedAt: null,
          retentionExpiry: null,
          folderId: validFolderId,
          updatedAt: new Date().toISOString(),
        };
      }
      return d;
    });

    setDocuments(updated);
    saveStoredDocuments(updated);
    setSelectedDocIds([]);
    addToast(`Restored ${ids.length} document(s) to library`, 'success');
  };

  // PERMANENT DELETION (Cannot be recovered)
  const deletePermanently = async (docIdOrIds: string | string[]) => {
    const ids = Array.isArray(docIdOrIds) ? docIdOrIds : [docIdOrIds];

    for (const id of ids) {
      const doc = documents.find((d) => d.id === id);
      await deletePdfBlob(id);
      if (doc) {
        logActivity({
          userId: user?.id || 'guest',
          documentId: id,
          documentName: doc.filename,
          action: 'permanent_delete',
          description: `Permanently erased "${doc.filename}" from storage`,
        });
      }
    }

    const updated = documents.filter((d) => !ids.includes(d.id));
    setDocuments(updated);
    saveStoredDocuments(updated);
    setSelectedDocIds([]);
    addToast(`Permanently deleted ${ids.length} document(s)`, 'info');
  };

  // EMPTY TRASH
  const emptyTrash = async () => {
    const trashedDocs = documents.filter((d) => d.status === 'trash');
    for (const doc of trashedDocs) {
      await deletePdfBlob(doc.id);
    }
    const updated = documents.filter((d) => d.status !== 'trash');
    setDocuments(updated);
    saveStoredDocuments(updated);

    logActivity({
      userId: user?.id || 'guest',
      action: 'permanent_delete',
      description: `Emptied trash (${trashedDocs.length} items permanently removed)`,
    });

    addToast(`Recovery Vault emptied. ${trashedDocs.length} items permanently deleted.`, 'info');
  };

  // FOLDER CRUD
  const createFolder = (name: string, parentId: string | null = null, color: string = '#3b82f6'): Folder => {
    const newFolder: Folder = {
      id: `fld_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: user?.id || 'guest',
      name: name.trim() || 'New Folder',
      parentId,
      color,
      createdAt: new Date().toISOString(),
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    saveStoredFolders(updated);
    addToast(`Created folder "${newFolder.name}"`, 'success');
    return newFolder;
  };

  const renameFolder = (id: string, newName: string) => {
    const clean = newName.trim();
    if (!clean) return;
    const updated = folders.map((f) => (f.id === id ? { ...f, name: clean } : f));
    setFolders(updated);
    saveStoredFolders(updated);
    addToast(`Renamed folder to "${clean}"`, 'info');
  };

  const deleteFolder = (id: string) => {
    const targetFolder = folders.find((f) => f.id === id);
    // Move all docs inside this folder to parent folder or root
    const updatedDocs = documents.map((d) => {
      if (d.folderId === id) {
        return { ...d, folderId: targetFolder?.parentId || null };
      }
      return d;
    });
    setDocuments(updatedDocs);
    saveStoredDocuments(updatedDocs);

    const updatedFolders = folders.filter((f) => f.id !== id);
    setFolders(updatedFolders);
    saveStoredFolders(updatedFolders);

    if (currentFolderId === id) {
      setCurrentFolderId(null);
    }

    addToast(`Folder deleted. Contained files moved to root.`, 'info');
  };

  // DOWNLOAD
  const downloadDocument = async (doc: DocumentItem) => {
    const buffer = await getPdfBlob(doc.id);
    if (!buffer) {
      addToast('File data could not be retrieved from storage', 'error');
      return;
    }
    downloadPdf(buffer, doc.filename);
    logActivity({
      userId: user?.id || 'guest',
      documentId: doc.id,
      documentName: doc.filename,
      action: 'download',
      description: `Downloaded "${doc.filename}"`,
    });
  };

  // VERSION HISTORY
  const getDocumentVersions = (docId: string) => {
    return versions.filter((v) => v.documentId === docId).sort((a, b) => b.versionNumber - a.versionNumber);
  };

  const restoreVersion = async (ver: DocumentVersion) => {
    const buffer = await getPdfBlob(ver.storageKey);
    if (!buffer) {
      addToast('Version data is no longer available', 'error');
      return;
    }
    await updateDocumentBuffer(ver.documentId, buffer, `Restored Version ${ver.versionNumber}`);
  };

  // SETTINGS
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveStoredSettings(updated);
    addToast('Settings updated', 'success');
  };

  // SELECTION HELPERS
  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectAllDocs = () => {
    const active = documents.filter((d) => d.status === (activeFilter === 'trash' ? 'trash' : 'active'));
    setSelectedDocIds(active.map((d) => d.id));
  };

  const clearSelection = () => {
    setSelectedDocIds([]);
  };

  // FILTERED & COMPUTED
  const activeDocs = documents.filter((d) => d.status === 'active');
  const trashDocs = documents.filter((d) => d.status === 'trash');

  const pdfBytes = activeDocs.reduce((sum, d) => sum + d.fileSize, 0);
  const trashBytes = trashDocs.reduce((sum, d) => sum + d.fileSize, 0);
  const usedBytes = pdfBytes + trashBytes;
  const quotaBytes = user?.storageLimitBytes || 500 * 1024 * 1024;
  const quotaPercent = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));

  const storageStats = {
    totalBytes: quotaBytes,
    usedBytes,
    pdfBytes,
    trashBytes,
    quotaPercent,
    totalActiveCount: activeDocs.length,
    favoritesCount: activeDocs.filter((d) => d.isFavorite).length,
    trashCount: trashDocs.length,
  };

  return (
    <DocumentContext.Provider
      value={{
        documents: activeDocs,
        trashDocuments: trashDocs,
        folders,
        currentFolderId,
        setCurrentFolderId,
        selectedDocIds,
        setSelectedDocIds,
        toggleSelectDoc,
        selectAllDocs,
        clearSelection,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        activeFilter,
        setActiveFilter,
        sortBy,
        setSortBy,
        activeDocument,
        setActiveDocument,
        saveNewDocument,
        updateDocumentBuffer,
        renameDocument,
        toggleFavorite,
        moveDocumentToFolder,
        addTagToDocument,
        removeTagFromDocument,
        moveToTrash,
        restoreFromTrash,
        deletePermanently,
        emptyTrash,
        createFolder,
        renameFolder,
        deleteFolder,
        downloadDocument,
        settings,
        updateSettings,
        activities,
        versions,
        getDocumentVersions,
        restoreVersion,
        toasts,
        addToast,
        storageStats,
        findDuplicateByChecksum,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocuments must be used within a DocumentProvider');
  return ctx;
};
