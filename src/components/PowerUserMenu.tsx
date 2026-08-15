import React, { useEffect } from 'react';
import { 
  X, 
  Layers, 
  Zap, 
  Compass, 
  Chrome, 
  PanelRight, 
  FileCode2, 
  ShieldCheck, 
  MessageSquare, 
  Store, 
  Crown, 
  Upload, 
  Download, 
  Share2, 
  RotateCcw, 
  HelpCircle, 
  Lock, 
  FileText, 
  Mail, 
  ChevronRight,
  ExternalLink,
  Sliders,
  Sparkles,
  Terminal,
  Database,
  Plus
} from 'lucide-react';
import { AppViewMode, Bookmark, UserProfile } from '../types';

interface PowerUserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  bookmarks: Bookmark[];
  currentUser: UserProfile;
  onImportClick: () => void;
  onExportClick: () => void;
  onShareClick: () => void;
  onDownloadExtensionClick: () => void;
  onResetDemoClick: () => void;
  onAddBookmarkClick: () => void;
  onOpenBrokenLinksModal: () => void;
  brokenCount: number;
}

export const PowerUserMenu: React.FC<PowerUserMenuProps> = ({
  isOpen,
  onClose,
  viewMode,
  setViewMode,
  bookmarks,
  currentUser,
  onImportClick,
  onExportClick,
  onShareClick,
  onDownloadExtensionClick,
  onResetDemoClick,
  onAddBookmarkClick,
  onOpenBrokenLinksModal,
  brokenCount
}) => {
  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectView = (mode: AppViewMode) => {
    setViewMode(mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-[#0e0e12] border-l border-white/10 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#131318]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Power Tools & Advanced
                <span className="px-2 py-0.2 rounded-full text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Developer tools, marketplace, audit & compliance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 text-xs custom-scrollbar">
          
          {/* Section 1: Core Navigation Shortcuts */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-1">
              Main Views
            </span>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                onClick={() => handleSelectView('dashboard')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-2 transition ${
                  viewMode === 'dashboard'
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs">Bookmarks</span>
              </button>

              <button
                onClick={() => handleSelectView('newtab')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-2 transition ${
                  viewMode === 'newtab'
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs">New Tab</span>
              </button>

              <button
                onClick={() => handleSelectView('directory')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-2 transition ${
                  viewMode === 'directory'
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">Top 100</span>
              </button>
            </div>
          </div>

          {/* Section 2: Chrome Extension & Developer Tools */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Extension & Developer
              </span>
              <span className="text-[10px] font-mono text-indigo-400">Manifest V3</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenBrokenLinksModal();
                }}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    brokenCount > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white">Link Health Auditor</h4>
                    <p className="text-[11px] text-slate-400">Background 404 & dead link checker</p>
                  </div>
                </div>
                {brokenCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-600 text-white">
                    {brokenCount} broken
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                )}
              </button>

              <button
                onClick={() => handleSelectView('extension-popup')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Chrome className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white">Popup Simulator</h4>
                    <p className="text-[11px] text-slate-400">Test the extension 380px popup UI</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => handleSelectView('sidepanel')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <PanelRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white">Side Panel Companion</h4>
                    <p className="text-[11px] text-slate-400">Chrome sidebar companion preview</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => handleSelectView('extension-code')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileCode2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white">Unpacked Code & Manifest</h4>
                    <p className="text-[11px] text-slate-400">View files & download extension .ZIP</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Section 3: Community & Marketplace Features */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-1">
              Community & Marketplace
            </span>

            <div className="flex flex-col gap-1.5 mt-2">
              <button
                onClick={() => handleSelectView('messageboard')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white">Community Board</h4>
                    <p className="text-[11px] text-slate-400">Discussions, shared lists & curation</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => handleSelectView('marketplace')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white">Bookmark Marketplace</h4>
                    <p className="text-[11px] text-slate-400">Browse & clone curated resource packs</p>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300">
                  FREE PREVIEW
                </span>
              </button>

              <button
                onClick={() => handleSelectView('vendor-hub')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white">Vendor Portal</h4>
                    <p className="text-[11px] text-slate-400">Publish packs & manage storefront</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => handleSelectView('vip-vault')}
                className="w-full p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-200 group-hover:text-white">VIP Vault</h4>
                    <p className="text-[11px] text-amber-300/70">Exclusive high-tier developer assets</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Section 4: Data Management & Sync */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-1">
              Data & Library Management
            </span>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => {
                  onClose();
                  onImportClick();
                }}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-left flex items-center gap-2.5 transition text-slate-300 hover:text-white"
              >
                <Upload className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs block">Import HTML</span>
                  <span className="text-[10px] text-slate-500">From browser</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onExportClick();
                }}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-left flex items-center gap-2.5 transition text-slate-300 hover:text-white"
              >
                <Download className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs block">Export HTML</span>
                  <span className="text-[10px] text-slate-500">Netscape file</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onShareClick();
                }}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-left flex items-center gap-2.5 transition text-slate-300 hover:text-white"
              >
                <Share2 className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs block">Share Bundle</span>
                  <span className="text-[10px] text-slate-500">Get share code</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onResetDemoClick();
                }}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-left flex items-center gap-2.5 transition text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs block">Reset Demo</span>
                  <span className="text-[10px] text-slate-500">Load sample data</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 5: Help & Chrome Store Compliance */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-1">
              Compliance & Legal
            </span>

            <div className="flex flex-col gap-1.5 mt-2">
              <button
                onClick={() => handleSelectView('help-compliance')}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white">Help & Store Policies</h4>
                    <p className="text-[11px] text-slate-400">Privacy, terms, permissions & contact</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-[#131318] flex items-center justify-between text-slate-400 text-[11px]">
          <span className="font-mono">Booksmarts A.I. v3.0.0</span>
          <span className="text-emerald-400 font-mono">● Local-First Engine</span>
        </div>

      </div>
    </div>
  );
};
