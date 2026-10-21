import React from 'react';
import { Volume2, Sparkles, FileText, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'voice' | 'profile' | 'cv';
  setActiveTab: (tab: 'voice' | 'profile' | 'cv') => void;
  isLiveActive: boolean;
  onOpenCvModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isLiveActive,
  onOpenCvModal,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0c0d0e]/85 border-b border-white/[0.06] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500/20 via-white/10 to-transparent border border-amber-500/30 shadow-inner">
            <span className="font-serif text-lg font-medium tracking-wider text-amber-200">U</span>
            {isLiveActive && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-medium tracking-tight text-white">Uma</span>
              <span className="text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full bg-white/[0.06] text-amber-200/90 border border-white/[0.08]">
                Voice Assistant
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light tracking-wide">
              Representing <span className="text-zinc-200 font-medium">Enara Pagarizabal</span>
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'voice'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Voice Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Profile & CV</span>
          </button>

          {/* Quick PDF button */}
          <button
            onClick={onOpenCvModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 transition-all ml-1"
            title="View Original CV Document"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View PDF CV</span>
            <span className="sm:hidden">CV</span>
          </button>
        </nav>

        {/* Language Badge */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.03] px-2.5 py-1.5 rounded-full border border-white/[0.06]">
          <Globe className="w-3.5 h-3.5 text-amber-400/80" />
          <span>EN (US) & ES (ES)</span>
        </div>
      </div>
    </header>
  );
};
