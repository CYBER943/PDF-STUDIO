import React from 'react';

interface LandingFooterProps {
  onOpenAuth: () => void;
  onOpenLegal: (tab: 'terms' | 'privacy' | 'cookies' | 'beta' | 'security' | 'contact') => void;
  onEnterApp: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onOpenAuth,
  onOpenLegal,
  onEnterApp,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                PS
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                PDF STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              A web-based workspace for creating, managing, organizing, and recovering PDFs.
              Designed with privacy and security in mind.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded uppercase tracking-wider">
                Currently in development
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('roadmap')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('beta')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Development Notice
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal('security')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Security Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('cookies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('beta')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>© 2026 PDF Studio. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button
              onClick={onEnterApp}
              className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Enter Development Studio →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
