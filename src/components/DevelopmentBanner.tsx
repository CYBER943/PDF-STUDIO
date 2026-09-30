import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

interface DevelopmentBannerProps {
  onLearnMore: () => void;
  onReturnToWebsite?: () => void;
}

export const DevelopmentBanner: React.FC<DevelopmentBannerProps> = ({
  onLearnMore,
  onReturnToWebsite,
}) => {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('pdf_studio_dev_banner_dismissed') === 'true';
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem('pdf_studio_dev_banner_dismissed', 'true');
    setDismissed(true);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-white px-4 py-2 text-xs font-medium shadow-xs relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-bold text-amber-200">🚧 Development Preview:</span>
          <span className="truncate">
            PDF Studio is currently under active development. Core tools are functional.
          </span>
          <button
            onClick={onLearnMore}
            className="underline font-bold text-white hover:text-amber-100 shrink-0 cursor-pointer hidden sm:inline"
          >
            Learn more
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onReturnToWebsite && (
            <button
              onClick={onReturnToWebsite}
              className="text-[11px] bg-white/20 hover:bg-white/30 text-white font-bold px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              ← Overview Website
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-md transition-colors cursor-pointer text-white/80 hover:text-white"
            title="Dismiss for this session"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
