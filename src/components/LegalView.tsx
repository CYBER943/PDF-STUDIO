import React, { useState } from 'react';
import { AppView } from '../types';
import {
  ArrowLeft,
  Shield,
  FileText,
  Lock,
  Cookie,
  HelpCircle,
  Sparkles,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Send,
  ExternalLink,
} from 'lucide-react';

interface LegalViewProps {
  initialTab?: 'terms' | 'privacy' | 'cookies' | 'beta' | 'security' | 'contact';
  onBack: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ initialTab = 'terms', onBack }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cookies' | 'beta' | 'security' | 'contact'>(
    initialTab
  );

  // Contact form state
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage) return;
    setContactSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Studio</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight">PDF Studio</span>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                Legal & Governance
              </span>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium flex items-center gap-1.5"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Page</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs sticky top-24 space-y-1">
              <button
                onClick={() => setActiveTab('terms')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  activeTab === 'terms'
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Terms of Service</span>
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  activeTab === 'privacy'
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>Privacy Policy</span>
              </button>

              <button
                onClick={() => setActiveTab('cookies')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  activeTab === 'cookies'
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Cookie className="w-4 h-4 shrink-0" />
                <span>Cookie Policy</span>
              </button>

              <button
                onClick={() => setActiveTab('beta')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  activeTab === 'beta'
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Beta Program</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  activeTab === 'security'
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Security Architecture</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  activeTab === 'contact'
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0 text-blue-600" />
                <span>Contact & Support</span>
              </button>
            </div>
          </aside>

          {/* Document Content */}
          <main className="md:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs prose prose-slate max-w-none">
              {/* 1. TERMS OF SERVICE */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                        Legal Agreement
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        Terms v1.0
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Terms of Service
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Effective Date: September 30, 2026 • Last Updated: September 30, 2026
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      By accessing, signing up for, or using PDF Studio (&quot;the Service&quot;),
                      you enter into a binding agreement subject to these Terms of Service and our
                      Privacy Policy. If you do not agree with any part of these Terms, you must
                      refrain from using the application.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      2. Beta / Development Status
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      PDF Studio is currently released in development / beta status. Certain
                      features may be experimental, updated, or temporarily unavailable. While we
                      strive for continuous uptime and reliability, the service is provided on an
                      &quot;as is&quot; and &quot;as available&quot; basis to the maximum extent
                      permitted under applicable law.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      3. Document Ownership & License
                    </h2>
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
                      <p className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        You own your documents. Always.
                      </p>
                      <p className="leading-relaxed">
                        You retain full ownership of and intellectual property rights in all
                        documents, images, and texts you upload, create, or process within PDF Studio.
                        We do not claim ownership of any user documents.
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You grant PDF Studio only the strictly limited, non-exclusive license necessary
                      to host, store, execute processing (such as merge, split, compression, or
                      watermarking), generate visual previews, and transmit documents back to you in
                      order to provide the service.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">4. User Responsibilities</h2>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                      <li>You are responsible for safeguarding your login credentials and sessions.</li>
                      <li>
                        You confirm you possess all required rights, authorizations, and licenses for
                        any files or documents you upload or process.
                      </li>
                      <li>
                        You are responsible for maintaining independent backup copies of critical or
                        mission-critical documents.
                      </li>
                      <li>You agree to comply with all applicable local, national, and international laws.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">5. Prohibited Use Policy</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You may not use PDF Studio to store, distribute, or process:
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                      <li>Malicious payloads, ransomware, spyware, or exploits.</li>
                      <li>Fraudulent, defamatory, or unlawful materials.</li>
                      <li>Content that infringes upon third-party copyrights or trademarks.</li>
                      <li>
                        Automated bot scrapers or unauthorized attempts to access another user&apos;s
                        private storage partitions.
                      </li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      6. Recovery Vault & Document Deletion
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      When documents are moved to the Trash, they are stored in the Recovery Vault
                      for a configured retention period (standard default: 30 days). During this
                      period, documents can be restored. Once permanently deleted or when the
                      retention period expires, the files are irreversibly expunged from primary
                      storage and cannot be recovered by PDF Studio.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">7. Third-Party Services</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      The service may interface with trusted third-party providers including
                      Supabase, Google, Microsoft, and cloud hosting infrastructure. Use of such
                      integrations is subject to their respective terms and policies.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      8. Limitation of Liability & Dispute Resolution
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      To the fullest extent permitted by applicable law, PDF Studio and its
                      operators shall not be liable for incidental, special, or consequential
                      damages resulting from service interruptions or file processing failures. These
                      Terms shall be governed by and construed in accordance with applicable laws,
                      with disputes resolved via good-faith negotiation or competent courts.
                    </p>
                  </section>
                </div>
              )}

              {/* 2. PRIVACY POLICY */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                        Data Protection
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        Privacy v1.0
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Privacy Policy
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Effective Date: September 30, 2026 • Last Updated: September 30, 2026
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      1. Information We Collect
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      We collect only the minimum information necessary to provide a private, reliable
                      PDF workspace:
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                      <li>
                        <strong>Account Information:</strong> Your email, display name, and avatar URL
                        as provided upon sign up or via Google / Microsoft authentication.
                      </li>
                      <li>
                        <strong>User Documents:</strong> The PDF files and images you upload or create,
                        stored in your private partition.
                      </li>
                      <li>
                        <strong>Metadata:</strong> Document filenames, page counts, checksums, tags,
                        and folder organization preferences.
                      </li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      2. No AI Training on User Documents
                    </h2>
                    <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2">
                      <p className="font-semibold flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                        Explicit Non-Training Guarantee
                      </p>
                      <p className="leading-relaxed">
                        Your uploaded documents and files are private. User documents are never used,
                        indexed, or shared to train public artificial intelligence models.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      3. How Documents are Processed & Stored
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      PDF operations (such as splitting, merging, rotating, watermarking, and
                      annotating) execute inside client memory and encrypted storage partitions.
                      Signed URLs and strict authorization rules protect access so that other users
                      cannot view or modify your documents.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      4. Account Deletion & Data Rights
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You have full control over your data. You may export all document metadata,
                      empty your Recovery Vault, or delete your account at any time through the
                      Settings dashboard. Account deletion irrevocably purges all associated
                      documents, folders, and history logs.
                    </p>
                  </section>
                </div>
              )}

              {/* 3. COOKIE POLICY */}
              {activeTab === 'cookies' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                        Cookies & Local Storage
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        Cookies v1.0
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Cookie Policy
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Effective Date: September 30, 2026
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">How We Use Cookies</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      PDF Studio does not use invasive cross-site marketing trackers. We use only
                      strictly necessary cookies and browser local storage mechanisms required for
                      core functionality:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                        <span className="font-bold text-slate-900">Authentication Cookies</span>
                        <p className="text-slate-600">
                          Maintains secure sessions and verifies your user token across requests.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                        <span className="font-bold text-slate-900">Local Workspace Storage</span>
                        <p className="text-slate-600">
                          Preserves folder hierarchies, recent document caches, and theme
                          preferences.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* 4. BETA PROGRAM */}
              {activeTab === 'beta' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                        Early Access
                      </span>
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono font-bold">
                        BETA RELEASE
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Beta Program Disclosure
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      PDF Studio is currently under active development.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                    <p className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      Important Information for Early Users
                    </p>
                    <p className="leading-relaxed">
                      We are continuously improving reliability, performance, and functionality.
                      While all PDF tools are functional, some features may change or experience
                      temporary limits.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                      Guidelines for Beta Testing
                    </h2>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
                      <li>
                        <strong>Maintain Backups:</strong> Always preserve your own original copy of
                        vital legal, financial, or confidential documents.
                      </li>
                      <li>
                        <strong>Complex PDFs:</strong> Unusually complex, corrupted, or non-standard
                        PDF files might require specific rendering adjustments.
                      </li>
                      <li>
                        <strong>Report Feedback:</strong> If you observe any issue, use our Contact
                        tab to let our engineering team know directly.
                      </li>
                    </ul>
                  </section>
                </div>
              )}

              {/* 5. SECURITY ARCHITECTURE */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                        Engineering Architecture
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        Zero Trust
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Security at PDF Studio
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Honest, modern, and verifiable security controls.
                    </p>
                  </div>

                  <section className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          TLS
                        </div>
                        <h3 className="text-xs font-bold text-slate-900">Encrypted Transport</h3>
                        <p className="text-xs text-slate-600">
                          All communications and API transactions use TLS 1.3 encryption in transit.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          RLS
                        </div>
                        <h3 className="text-xs font-bold text-slate-900">Row Level Security</h3>
                        <p className="text-xs text-slate-600">
                          PostgreSQL Row Level Security ensures users can only read and mutate their
                          own partitioned records.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                          URI
                        </div>
                        <h3 className="text-xs font-bold text-slate-900">Temporary Signed Access</h3>
                        <p className="text-xs text-slate-600">
                          Files are stored in private buckets; direct links expire automatically
                          after a short duration.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                          HASH
                        </div>
                        <h3 className="text-xs font-bold text-slate-900">SHA-256 Checksums</h3>
                        <p className="text-xs text-slate-600">
                          Duplicate detection and integrity verification use SHA-256 cryptographic
                          digests.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* 6. CONTACT & SUPPORT */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        Help & Feedback
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Contact & Support
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Have questions, feedback, or a feature request? We&apos;re here to help.
                    </p>
                  </div>

                  {contactSent ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h3 className="text-sm font-bold text-emerald-900">Message Received!</h3>
                      <p className="text-xs text-emerald-700 max-w-md mx-auto">
                        Thank you for reaching out to the PDF Studio team. We review all beta
                        inquiries and will get back to you promptly.
                      </p>
                      <button
                        onClick={() => {
                          setContactSent(false);
                          setContactMessage('');
                        }}
                        className="mt-3 px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Send Another Note
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Topic / Subject
                        </label>
                        <input
                          type="text"
                          required
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="e.g. Bug report, feature idea, or question"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Message
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Describe the issue or feedback with as much detail as possible..."
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit to Support
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
