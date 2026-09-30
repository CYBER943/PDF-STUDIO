import React from 'react';
import { AppView } from '../types';
import {
  FileText,
  Wrench,
  Trash2,
  Settings,
  Plus,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCreateMenu: () => void;
  trashCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenCreateMenu,
  trashCount = 0,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 sm:hidden">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            currentView === 'dashboard'
              ? 'text-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>My PDFs</span>
        </button>

        <button
          onClick={() => onNavigate('tools')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            currentView === 'tools'
              ? 'text-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4 mb-0.5" />
          <span>Tools</span>
        </button>

        {/* Action Button: Create / Upload */}
        <button
          onClick={onOpenCreateMenu}
          className="w-11 h-11 -mt-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
          aria-label="Create or Upload PDF"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onNavigate('vault')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-semibold transition-colors relative ${
            currentView === 'vault'
              ? 'text-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trash2 className="w-4 h-4 mb-0.5" />
          <span>Vault</span>
          {trashCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => onNavigate('dashboard')} // Will trigger settings via menu or dedicated
          className="flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-semibold text-slate-500 hover:text-slate-800"
        >
          <Settings className="w-4 h-4 mb-0.5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
