# PDF Studio

> **Create. Manage. Find. Recover.**
> Your Personal Web-Based PDF Workspace — Create, Store, Organize & Recover.

PDF Studio is a full-featured personal PDF workspace built to solve the fragmentation of modern PDF handling. Instead of processing a document, downloading it, and losing it in your downloads folder, every PDF created or transformed in PDF Studio is **automatically organized inside your personal document library**.

---

## Core Principles

1. **CREATE**: Generate blank PDFs, convert images, merge files, split ranges, and annotate directly in the browser.
2. **SAVE**: Created PDFs are automatically saved to your private library in IndexedDB binary storage.
3. **ORGANIZE**: Categorize with nested folders, colored tags, favorites, and instant debounced search.
4. **RECOVER**: Accidental deletions move to the **Recovery Vault** with an automatic retention period countdown (configurable: 7 to 90 days), with one-click restore.
5. **ACCESS**: Responsive web application running cleanly across desktop, tablet, and mobile with zero software installation required.

---

## Key Features

- **Document Library & Vault**:
  - Auto-save on every generation or edit.
  - Hierarchical folder system (Work, Personal, Invoices, Contracts).
  - Star favorites for quick access.
  - Custom tag filters.
  - Debounced search across filenames, titles, authors, and text.
  - Multi-file bulk selection (Move, Download, Delete).
  - SHA-256 Checksum duplicate detection.

- **Recovery Vault (Trash)**:
  - Deletion lifecycle: Active → Trash → Retention Period → Permanent Deletion.
  - Real remaining countdown indicator ("Automatically deleted in 26 days").
  - Restore documents back to their original folder.
  - Permanent erasure with verified confirmation warnings.

- **Full Suite of In-Browser PDF Tools**:
  - **Merge PDFs**: Reorder, preview, and combine multiple files.
  - **Split PDF**: Extract page ranges (e.g., `1-3, 5`) or split every page into separate documents.
  - **Sign PDF**: Smooth freehand drawing canvas, cursive script typography, or image signature upload.
  - **Compress PDF**: Low, Balanced, and High presets with real byte calculations showing percentage saved.
  - **Watermark**: Custom text or image watermarks with opacity, rotation angle, and placement options.
  - **Add Page Numbers**: Multiple numbering formats (`1`, `Page 1`, `1 / N`, `Page 1 of N`) and position selectors.
  - **Text Extraction**: Inspect extracted text per page, copy to clipboard, or export as `.txt` / `.md`.
  - **Image Extraction**: Scan PDF streams for embedded images with preview and bulk export.
  - **PDF Metadata**: Inspect and update Title, Author, Subject, and Keywords.
  - **Create Blank PDF**: Generate clean documents in A4 or Letter sizes with custom layout and orientation.
  - **Images to PDF**: Convert JPG and PNG image collections into a PDF document.

- **Unified PDF Studio Editor**:
  - High-fidelity PDF page rendering via HTML5 Canvas.
  - Page thumbnails sidebar with page rotation (90° increments) and deletion.
  - Freehand drawing pen, translucent highlighter, text box stamper, and sticky notes.
  - Version history tracking with one-click restore and download.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Engine**: PDF-Lib & PDF.js (in-browser processing without third-party server exposure)
- **Local Vault Storage**: IndexedDB (binary blobs) + LocalStorage (metadata index)

---

## Local Development

```bash
npm install
npm run dev
```

The application runs on `http://localhost:3000`.

To build for production:

```bash
npm run build
```

---

## Vercel Deployment

PDF Studio is configured for one-click Vercel deployment with client-side SPA rewrite rules in `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
