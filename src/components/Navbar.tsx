import React, { useState } from 'react';
import { 
  Layers, 
  Chrome, 
  Plus, 
  User, 
  ShieldCheck, 
  Compass, 
  Zap,
  Menu,
  Sliders
} from 'lucide-react';
import { AppViewMode, Bookmark, UserProfile } from '../types';
import { PowerUserMenu } from './PowerUserMenu';

interface NavbarProps {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  bookmarks: Bookmark[];
  onImportClick: () => void;
  onExportClick: () => void;
  onShareClick: () => void;
  onDownloadExtensionClick: () => void;
  onResetDemoClick: () => void;
  onAddBookmarkClick: () => void;
  currentUser: UserProfile;
  onAuthClick: () => void;
  onOpenBrokenLinksModal?: () => void;
  isCheckingHealth?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  bookmarks,
  onImportClick,
  onExportClick,
  onShareClick,
  onDownloadExtensionClick,
  onResetDemoClick,
  onAddBookmarkClick,
  currentUser,
  onAuthClick,
  onOpenBrokenLinksModal,
  isCheckingHealth = false
}) => {
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);

  const brokenCount = bookmarks.filter(b => b.linkHealth === 'broken' || b.linkHealth === 'unreachable').length;

  const isPowerView = [
    'messageboard',
    'marketplace',
    'vendor-hub',
    'vip-vault',
    'extension-popup',
    'sidepanel',
    'extension-code',
    'help-compliance'
  ].includes(viewMode);

  return (
    <header className="border-b border-white/10 bg-[#0c0c0e] sticky top-0 z-30 shrink-0">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setViewMode('dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white shrink-0 group-hover:scale-105 transition">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-xs rotate-45 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  Booksmarts<span className="text-indigo-400 font-bold ml-1">A.I.</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Chrome className="w-3 h-3" /> V3 EXT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">AI Bookmark & New Tab Station</p>
            </div>
          </div>

          {/* Simple, Non-Confusing Main Navigation Tabs for Everyday Users */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl">
            
            {/* Tab 1: Bookmarks Dashboard */}
            <button
              id="view-dashboard-btn"
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>My Bookmarks</span>
            </button>

            {/* Tab 2: Home Screen / New Tab */}
            <button
              id="view-newtab-btn"
              onClick={() => setViewMode('newtab')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'newtab'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>New Tab</span>
            </button>

            {/* Tab 3: Top 100 Curated Directory */}
            <button
              id="view-directory-btn"
              onClick={() => setViewMode('directory')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'directory'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Top 100 Web</span>
            </button>

          </nav>

          {/* Right Action buttons: Quick Add, Account, and Hamburger Power Menu */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Add bookmark quick button */}
            <button
              id="btn-add-bookmark"
              onClick={onAddBookmarkClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition"
              title="Add Bookmark URL"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Add URL</span>
            </button>

            {/* User Account / Sign In Pill */}
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 p-1 pl-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
              title="Account Settings"
            >
              <div className="flex flex-col text-right hidden lg:flex">
                <span className="text-[11px] font-bold leading-tight">{currentUser.name}</span>
                <span className={`text-[9px] font-mono uppercase ${
                  currentUser.tier === 'vip' ? 'text-amber-400' : currentUser.tier === 'vendor' ? 'text-purple-400' : 'text-slate-400'
                }`}>
                  {currentUser.tier === 'vip' ? '👑 VIP' : currentUser.tier === 'vendor' ? '🛡️ VENDOR' : 'FREE'}
                </span>
              </div>
              
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-xl object-cover border border-indigo-500/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </button>

            {/* HAMBURGER MENU BUTTON (Houses all Power Tools, Marketplace, Extension simulators, Broken Link Health, etc.) */}
            <button
              id="btn-hamburger-power-menu"
              onClick={() => setIsPowerMenuOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition shadow-lg ${
                isPowerView || brokenCount > 0
                  ? 'bg-indigo-600 text-white border-indigo-500/50 shadow-indigo-600/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
              }`}
              title="More & Power Tools"
            >
              <Menu className="w-4 h-4 text-indigo-300" />
              <span className="hidden sm:inline">More</span>
              
              {/* Badges if active */}
              {brokenCount > 0 ? (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              ) : isPowerView ? (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              ) : null}
            </button>

          </div>

        </div>

        {/* Mobile Minimal Navigation Bar */}
        <div className="flex md:hidden items-center justify-between pb-1 pt-2 border-t border-white/10 gap-1 mt-2">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`flex-1 py-1 rounded-lg text-xs font-medium text-center ${
              viewMode === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Bookmarks
          </button>
          <button
            onClick={() => setViewMode('newtab')}
            className={`flex-1 py-1 rounded-lg text-xs font-medium text-center ${
              viewMode === 'newtab' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            ⚡ New Tab
          </button>
          <button
            onClick={() => setViewMode('directory')}
            className={`flex-1 py-1 rounded-lg text-xs font-medium text-center ${
              viewMode === 'directory' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Top 100
          </button>
          <button
            onClick={() => setIsPowerMenuOpen(true)}
            className="flex-1 py-1 rounded-lg text-xs font-bold text-center text-indigo-400 bg-white/5 flex items-center justify-center gap-1"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>

      </div>

      {/* Hamburger Slide-Over Power Menu Drawer */}
      <PowerUserMenu
        isOpen={isPowerMenuOpen}
        onClose={() => setIsPowerMenuOpen(false)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        bookmarks={bookmarks}
        currentUser={currentUser}
        onImportClick={onImportClick}
        onExportClick={onExportClick}
        onShareClick={onShareClick}
        onDownloadExtensionClick={onDownloadExtensionClick}
        onResetDemoClick={onResetDemoClick}
        onAddBookmarkClick={onAddBookmarkClick}
        onOpenBrokenLinksModal={onOpenBrokenLinksModal || (() => {})}
        brokenCount={brokenCount}
      />
    </header>
  );
};
