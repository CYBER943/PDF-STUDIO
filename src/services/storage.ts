import { DocumentItem, Folder, DocumentVersion, ActivityLog, ShareLink, AppSettings } from '../types';

const DB_NAME = 'pdf_studio_vault';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_blobs';

// Initialize IndexedDB for storing PDF files
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Store PDF binary in IndexedDB
export async function savePdfBlob(id: string, data: Uint8Array | Blob): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    // Ensure we store as a Blob for optimal IndexedDB binary handling
    const blob = data instanceof Blob ? data : new Blob([data as any], { type: 'application/pdf' });
    const req = store.put(blob, id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Retrieve PDF binary from IndexedDB
export async function getPdfBlob(id: string): Promise<Uint8Array | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = async () => {
      const res = req.result;
      if (!res) {
        resolve(null);
        return;
      }
      if (res instanceof Blob) {
        const arrayBuffer = await res.arrayBuffer();
        resolve(new Uint8Array(arrayBuffer));
      } else if (res instanceof Uint8Array) {
        resolve(res);
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// Delete PDF binary from IndexedDB
export async function deletePdfBlob(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// LocalStorage helpers for Metadata
const STORAGE_PREFIX = 'pdf_studio_';

export function getStoredDocuments(): DocumentItem[] {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}documents`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredDocuments(documents: DocumentItem[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}documents`, JSON.stringify(documents));
  } catch (err) {
    console.error('Failed to save documents metadata', err);
  }
}

export function getStoredFolders(): Folder[] {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}folders`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredFolders(folders: Folder[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}folders`, JSON.stringify(folders));
  } catch (err) {
    console.error('Failed to save folders', err);
  }
}

export function getStoredVersions(): DocumentVersion[] {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}versions`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredVersions(versions: DocumentVersion[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}versions`, JSON.stringify(versions));
  } catch (err) {
    console.error('Failed to save versions', err);
  }
}

export function getStoredActivities(): ActivityLog[] {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}activities`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
  const current = getStoredActivities();
  const entry: ActivityLog = {
    ...activity,
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [entry, ...current].slice(0, 200); // keep recent 200
  try {
    localStorage.setItem(`${STORAGE_PREFIX}activities`, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to log activity', err);
  }
  return entry;
}

export function getStoredShareLinks(): ShareLink[] {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}shares`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredShareLinks(shares: ShareLink[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}shares`, JSON.stringify(shares));
  } catch (err) {
    console.error('Failed to save shares', err);
  }
}

export function getStoredSettings(): AppSettings {
  const defaults: AppSettings = {
    retentionDays: 30,
    autoSaveIntervalSec: 10,
    theme: 'light',
    defaultPageSize: 'A4',
    defaultCompression: 'balanced',
  };
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}settings`);
    return data ? { ...defaults, ...JSON.parse(data) } : defaults;
  } catch {
    return defaults;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}
