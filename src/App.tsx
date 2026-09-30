import React, { useState, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentProvider, useDocuments } from './context/DocumentContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { RecoveryVaultView } from './components/RecoveryVaultView';
import { UnifiedEditorView } from './components/UnifiedEditorView';
import { ToastContainer } from './components/ToastContainer';

// Modals
import { AllToolsModal } from './components/modals/AllToolsModal';
import { MergeModal } from './components/modals/MergeModal';
import { SplitModal } from './components/modals/SplitModal';
import { SignModal } from './components/modals/SignModal';
import { WatermarkModal } from './components/modals/WatermarkModal';
import { CompressModal } from './components/modals/CompressModal';
import { TextExtractionModal } from './components/modals/TextExtractionModal';
import { ImageExtractionModal } from './components/modals/ImageExtractionModal';
import { PageNumberModal } from './components/modals/PageNumberModal';
import { CreateBlankModal } from './components/modals/CreateBlankModal';
import { CreateFromImagesModal } from './components/modals/CreateFromImagesModal';
import { ShareModal } from './components/modals/ShareModal';
import { VersionHistoryModal } from './components/modals/VersionHistoryModal';
import { MetadataModal } from './components/modals/MetadataModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AuthModal } from './components/modals/AuthModal';
import { DuplicateModal } from './components/modals/DuplicateModal';

import { DocumentItem, AppView } from './types';
import { UploadCloud } from 'lucide-react';
import { LegalView } from './components/LegalView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BetaModal } from './components/modals/BetaModal';
import { ProtectModal } from './components/modals/ProtectModal';
import { PageOrganizerModal } from './components/modals/PageOrganizerModal';
import { LandingPage } from './components/landing/LandingPage';
import { DevelopmentBanner } from './components/DevelopmentBanner';
import { WelcomeModal } from './components/modals/WelcomeModal';

const MainAppContent: React.FC = () => {
  const {
    activeDocument,
    setActiveDocument,
    activeFilter,
    saveNewDocument,
    findDuplicateByChecksum,
    addToast,
    storageStats,
  } = useDocuments();

  // App Mode: 'landing' (public marketing & overview website) vs 'workspace' (application)
  const [appMode, setAppMode] = useState<'landing' | 'workspace'>('landing');

  // Primary view routing: 'dashboard' | 'legal' etc.
  const [currentLegalTab, setCurrentLegalTab] = useState<
    'terms' | 'privacy' | 'cookies' | 'beta' | 'security' | 'contact' | null
  >(null);

  // Modals state
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);
  const [modalTargetDoc, setModalTargetDoc] = useState<DocumentItem | null>(null);

  const [shareDoc, setShareDoc] = useState<DocumentItem | null>(null);
  const [versionDoc, setVersionDoc] = useState<DocumentItem | null>(null);
  const [metadataDoc, setMetadataDoc] = useState<DocumentItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  // Duplicate upload detection state
  const [duplicateExisting, setDuplicateExisting] = useState<DocumentItem | null>(null);
  const [pendingUpload, setPendingUpload] = useState<{ name: string; buffer: Uint8Array } | null>(
    null
  );

  // Drag and drop state
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Open Tool Helper
  const handleOpenTool = (toolName: string, doc?: DocumentItem) => {
    setModalTargetDoc(doc || null);
    setActiveToolModal(toolName);
  };

  const handleOpenLegal = (tab: 'terms' | 'privacy' | 'cookies' | 'beta' | 'security' | 'contact') => {
    setCurrentLegalTab(tab);
  };

  const handleEnterWorkspace = () => {
    setAppMode('workspace');
    if (!sessionStorage.getItem('pdf_studio_welcomed')) {
      setIsWelcomeModalOpen(true);
      sessionStorage.setItem('pdf_studio_welcomed', 'true');
    }
  };

  // Upload handler with duplicate detection
  const processUploadedFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      addToast('Please upload a valid PDF document (.pdf)', 'warning');
      return;
    }

    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      const duplicate = await findDuplicateByChecksum(buffer);

      if (duplicate) {
        setDuplicateExisting(duplicate);
        setPendingUpload({ name: file.name, buffer });
      } else {
        const newDoc = await saveNewDocument(file.name, buffer, {
          originalFilename: file.name,
        });
        setActiveDocument(newDoc);
      }
    } catch (err: any) {
      console.error(err);
      addToast('Failed to read or store PDF: ' + err.message, 'error');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
      e.target.value = '';
    }
  };

  // Drag and drop on entire window
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Dedicated Legal / Governance View (Terms, Privacy, Beta, Security, Contact)
  if (currentLegalTab) {
    return (
      <LegalView
        initialTab={currentLegalTab}
        onBack={() => setCurrentLegalTab(null)}
      />
    );
  }

  // When activeDocument is set, full-screen Studio Editor is displayed
  if (activeDocument) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
        <UnifiedEditorView
          document={activeDocument}
          onBack={() => setActiveDocument(null)}
          onOpenTool={handleOpenTool}
          onShare={(doc) => setShareDoc(doc)}
        />

        {/* Modals triggered from within editor */}
        <SignModal
          isOpen={activeToolModal === 'sign'}
          onClose={() => setActiveToolModal(null)}
          document={modalTargetDoc || activeDocument}
          onOpenDocument={(d) => setActiveDocument(d)}
        />
        <WatermarkModal
          isOpen={activeToolModal === 'watermark'}
          onClose={() => setActiveToolModal(null)}
          document={modalTargetDoc || activeDocument}
          onOpenDocument={(d) => setActiveDocument(d)}
        />
        <PageNumberModal
          isOpen={activeToolModal === 'page-numbers'}
          onClose={() => setActiveToolModal(null)}
          document={modalTargetDoc || activeDocument}
          onOpenDocument={(d) => setActiveDocument(d)}
        />
        <TextExtractionModal
          isOpen={activeToolModal === 'extract-text'}
          onClose={() => setActiveToolModal(null)}
          document={modalTargetDoc || activeDocument}
        />
        <ImageExtractionModal
          isOpen={activeToolModal === 'extract-images'}
          onClose={() => setActiveToolModal(null)}
          document={modalTargetDoc || activeDocument}
        />
        <CompressModal
          isOpen={activeToolModal === 'compress'}
          onClose={() => setActiveToolModal(null)}
          document={modalTargetDoc || activeDocument}
          onOpenDocument={(d) => setActiveDocument(d)}
        />
        <PageOrganizerModal
          isOpen={activeToolModal === 'page-organizer'}
          onClose={() => setActiveToolModal(null)}
          targetDoc={modalTargetDoc || activeDocument}
        />
        <ProtectModal
          isOpen={activeToolModal === 'protect' || activeToolModal === 'unlock'}
          onClose={() => setActiveToolModal(null)}
          targetDoc={modalTargetDoc || activeDocument}
        />
        <MetadataModal
          isOpen={activeToolModal === 'metadata'}
          onClose={() => setActiveToolModal(null)}
          document={modalTargetDoc || activeDocument}
        />
        <ShareModal
          isOpen={!!shareDoc}
          onClose={() => setShareDoc(null)}
          document={shareDoc}
        />

        <ToastContainer />
      </div>
    );
  }

  // 1. PUBLIC LANDING WEBSITE (Section 1, 2, 4-13, 19-21, 28)
  if (appMode === 'landing') {
    return (
      <>
        <LandingPage
          onOpenAuth={() => setIsAuthOpen(true)}
          onEnterApp={handleEnterWorkspace}
          onOpenLegal={handleOpenLegal}
          onOpenBetaModal={() => setIsBetaModalOpen(true)}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onOpenLegal={(tab) => {
            setIsAuthOpen(false);
            handleOpenLegal(tab);
          }}
        />

        <BetaModal
          isOpen={isBetaModalOpen}
          onClose={() => setIsBetaModalOpen(false)}
          onOpenBetaPage={() => {
            setIsBetaModalOpen(false);
            handleOpenLegal('beta');
          }}
        />

        <ToastContainer />
      </>
    );
  }

  // 2. LOGGED-IN / DEVELOPMENT APPLICATION WORKSPACE
  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 font-sans relative pb-16 sm:pb-0"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Input for Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Global Drag-and-Drop Overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 bg-rose-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white pointer-events-none animate-in fade-in">
          <UploadCloud className="w-16 h-16 animate-bounce mb-3" />
          <h2 className="text-2xl font-bold">Drop PDF to Upload</h2>
          <p className="text-sm text-rose-100 mt-1">
            Document will be processed and automatically saved to your PDF Studio library.
          </p>
        </div>
      )}

      {/* Persistent Development Status Banner (Section 15) */}
      <DevelopmentBanner
        onLearnMore={() => setIsBetaModalOpen(true)}
        onReturnToWebsite={() => setAppMode('landing')}
      />

      {/* Top Application Header */}
      <Header
        onOpenTool={handleOpenTool}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onUploadClick={() => fileInputRef.current?.click()}
        onOpenBetaModal={() => setIsBetaModalOpen(true)}
        onOpenLegal={handleOpenLegal}
        onBackToLanding={() => setAppMode('landing')}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          onOpenTool={handleOpenTool}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Center Main View (Dashboard or Recovery Vault) */}
        {activeFilter === 'trash' ? (
          <RecoveryVaultView />
        ) : (
          <DashboardView
            onOpenDocument={(doc) => setActiveDocument(doc)}
            onOpenTool={handleOpenTool}
            onShareDocument={(doc) => setShareDoc(doc)}
            onVersionHistory={(doc) => setVersionDoc(doc)}
            onMetadataModal={(doc) => setMetadataDoc(doc)}
            onOpenLegal={handleOpenLegal}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={activeFilter === 'trash' ? 'vault' : 'dashboard'}
        onNavigate={(view) => {
          if (view === 'tools') handleOpenTool('all-tools');
          else if (view === 'vault') {
            handleOpenTool('all-tools');
          }
        }}
        onOpenCreateMenu={() => handleOpenTool('create-blank')}
        trashCount={storageStats.trashCount}
      />

      {/* MODALS SUITE */}
      <AllToolsModal
        isOpen={activeToolModal === 'all-tools'}
        onClose={() => setActiveToolModal(null)}
        onSelectTool={(tool) => handleOpenTool(tool)}
      />

      <MergeModal
        isOpen={activeToolModal === 'merge'}
        onClose={() => setActiveToolModal(null)}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />

      <SplitModal
        isOpen={activeToolModal === 'split'}
        onClose={() => setActiveToolModal(null)}
        document={modalTargetDoc}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />

      <PageOrganizerModal
        isOpen={activeToolModal === 'page-organizer'}
        onClose={() => setActiveToolModal(null)}
        targetDoc={modalTargetDoc}
      />

      <ProtectModal
        isOpen={activeToolModal === 'protect' || activeToolModal === 'unlock'}
        onClose={() => setActiveToolModal(null)}
        targetDoc={modalTargetDoc}
      />

      <SignModal
        isOpen={activeToolModal === 'sign'}
        onClose={() => setActiveToolModal(null)}
        document={modalTargetDoc}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />

      <CompressModal
        isOpen={activeToolModal === 'compress'}
        onClose={() => setActiveToolModal(null)}
        document={modalTargetDoc}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />

      <WatermarkModal
        isOpen={activeToolModal === 'watermark'}
        onClose={() => setActiveToolModal(null)}
        document={modalTargetDoc}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />

      <PageNumberModal
        isOpen={activeToolModal === 'page-numbers'}
        onClose={() => setActiveToolModal(null)}
        document={modalTargetDoc}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />

      <TextExtractionModal
        isOpen={activeToolModal === 'extract-text'}
        onClose={() => setActiveToolModal(null)}
        document={modalTargetDoc}
      />

      <ImageExtractionModal
        isOpen={activeToolModal === 'extract-images'}
        onClose={() => setActiveToolModal(null)}
        document={modalTargetDoc}
      />

      <CreateBlankModal
        isOpen={activeToolModal === 'create-blank'}
        onClose={() => setActiveToolModal(null)}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />

      <CreateFromImagesModal
        isOpen={activeToolModal === 'images-to-pdf'}
        onClose={() => setActiveToolModal(null)}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />

      <ShareModal
        isOpen={!!shareDoc}
        onClose={() => setShareDoc(null)}
        document={shareDoc}
      />

      <VersionHistoryModal
        isOpen={!!versionDoc}
        onClose={() => setVersionDoc(null)}
        document={versionDoc}
      />

      <MetadataModal
        isOpen={!!metadataDoc || activeToolModal === 'metadata'}
        onClose={() => {
          setMetadataDoc(null);
          if (activeToolModal === 'metadata') setActiveToolModal(null);
        }}
        document={metadataDoc || modalTargetDoc}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenAuth={() => {
          setIsSettingsOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onOpenLegal={(tab) => {
          setIsAuthOpen(false);
          handleOpenLegal(tab);
        }}
      />

      <BetaModal
        isOpen={isBetaModalOpen}
        onClose={() => setIsBetaModalOpen(false)}
        onOpenBetaPage={() => {
          setIsBetaModalOpen(false);
          handleOpenLegal('beta');
        }}
      />

      {/* First Login Welcome Onboarding Modal (Section 14) */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onOpenRoadmap={() => {
          setIsWelcomeModalOpen(false);
          setAppMode('landing');
          setTimeout(() => {
            const el = document.getElementById('roadmap');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      <DuplicateModal
        isOpen={!!duplicateExisting}
        onClose={() => {
          setDuplicateExisting(null);
          setPendingUpload(null);
        }}
        existingDoc={duplicateExisting}
        onOpenExisting={(doc) => {
          setDuplicateExisting(null);
          setPendingUpload(null);
          setActiveDocument(doc);
        }}
        onSaveCopy={async () => {
          if (pendingUpload) {
            const baseName = pendingUpload.name.replace(/\.pdf$/i, '');
            const copyName = `${baseName} (Copy).pdf`;
            const newDoc = await saveNewDocument(copyName, pendingUpload.buffer);
            setDuplicateExisting(null);
            setPendingUpload(null);
            setActiveDocument(newDoc);
          }
        }}
      />

      {/* Floating Notifications Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <MainAppContent />
      </DocumentProvider>
    </AuthProvider>
  );
}
