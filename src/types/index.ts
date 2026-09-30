export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  storageLimitBytes: number;
  isGuest: boolean;
  avatarUrl?: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  storageKey: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  retentionExpiry: string | null;
  isFavorite: boolean;
  pageCount: number;
  pdfVersion: string;
  title: string;
  author: string;
  subject: string;
  tags: string[];
  thumbnail: string; // Base64 data URL
  checksum: string;
  status: 'active' | 'trash' | 'archived';
  version: number;
  hasPassword?: boolean;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  parentId: string | null;
  color?: string;
  createdAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  createdAt: string;
  fileSize: number;
  pageCount: number;
  summary: string;
  storageKey: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  documentId?: string;
  documentName?: string;
  action:
    | 'create'
    | 'upload'
    | 'merge'
    | 'split'
    | 'rotate'
    | 'watermark'
    | 'sign'
    | 'edit'
    | 'compress'
    | 'rename'
    | 'move'
    | 'trash'
    | 'restore'
    | 'permanent_delete'
    | 'favorite'
    | 'download';
  description: string;
  timestamp: string;
}

export interface ShareLink {
  id: string;
  documentId: string;
  userId: string;
  code: string;
  allowDownload: boolean;
  hasPassword: boolean;
  password?: string;
  expiresAt?: string;
  createdAt: string;
  accessCount: number;
}

export interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  creationDate?: string;
  modificationDate?: string;
  pdfVersion?: string;
  pageCount: number;
  fileSize: number;
}

export interface OverlayAnnotation {
  id: string;
  pageIndex: number;
  type: 'text' | 'draw' | 'highlight' | 'rectangle' | 'circle' | 'signature' | 'note';
  x: number; // percentage or px
  y: number;
  width?: number;
  height?: number;
  content?: string;
  color: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  opacity?: number;
  strokeWidth?: number;
  points?: { x: number; y: number }[]; // For freehand draw
  rotation?: number;
  imageData?: string; // For signature or embedded image
}

export interface AppSettings {
  retentionDays: number;
  autoSaveIntervalSec: number;
  theme: 'light' | 'dark' | 'system';
  defaultPageSize: 'A4' | 'Letter';
  defaultCompression: 'low' | 'balanced' | 'high';
}
