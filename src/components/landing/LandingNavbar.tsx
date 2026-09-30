import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  ArrowRight,
  Shield,
  Sparkles,
  FileText,
  LogIn,
} from 'lucide-react';

interface LandingNavbarProps {
  onOpenAuth: () => void;
  onEnterApp: () => void;
  onOpenLegal: (tab: 'terms' | 'privacy' | 'beta' | 'security' | 'contact') => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenAuth,
  onEnterApp,
  onOpenLegal,
}) => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3'
          : 'bg-white/70 backdrop-blur-xs border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-100 group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5"
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
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  PDF <span className="text-rose-600">STUDIO</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  DEV PREVIEW
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('library-vision')}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            Library Vision
          </button>
          <button
            onClick={() => scrollToSection('security')}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            Security & Privacy
          </button>
          <button
            onClick={() => scrollToSection('roadmap')}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            Roadmap
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-600/30 transition-all cursor-pointer hover:shadow-md"
            >
              <span>Launch Studio ({user.name ? user.name.split(' ')[0] : 'Workspace'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={onEnterApp}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-600/30 transition-all cursor-pointer hover:shadow-md"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Features & Tools
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('library-vision')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Personal Library Vision
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Security Architecture
            </button>
            <button
              onClick={() => scrollToSection('roadmap')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Development Roadmap
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Frequently Asked Questions
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onEnterApp();
              }}
              className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2"
            >
              <span>Enter PDF Studio App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Log In / Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
