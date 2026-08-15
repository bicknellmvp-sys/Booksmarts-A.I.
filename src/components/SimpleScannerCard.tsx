import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  Plus, 
  ArrowRight, 
  SlidersHorizontal, 
  Loader2,
  FolderCheck,
  RotateCcw
} from 'lucide-react';
import { Bookmark, DashboardDisplayMode } from '../types';

interface SimpleScannerCardProps {
  bookmarks: Bookmark[];
  isScanning: boolean;
  scanProgress: { step: string; progress: number } | null;
  onStartAutoOrganize: () => void;
  onCleanUnsorted: () => void;
  onAddBookmarkClick: () => void;
  onImportClick: () => void;
  onOpenBrokenLinksModal?: () => void;
  displayMode: DashboardDisplayMode;
  setDisplayMode: (mode: DashboardDisplayMode) => void;
}

export const SimpleScannerCard: React.FC<SimpleScannerCardProps> = ({
  bookmarks,
  isScanning,
  scanProgress,
  onStartAutoOrganize,
  onCleanUnsorted,
  onAddBookmarkClick,
  onImportClick,
  onOpenBrokenLinksModal,
  displayMode,
  setDisplayMode
}) => {
  const unsortedCount = bookmarks.filter(b => 
    b.folder.toLowerCase().includes('unsorted') || 
    b.folder === 'Bookmarks Bar' || 
    b.folder.toLowerCase().includes('other')
  ).length;

  const brokenCount = bookmarks.filter(b => b.linkHealth === 'broken' || b.linkHealth === 'unreachable').length;

  const totalBookmarks = bookmarks.length;
  const organizedCount = Math.max(0, totalBookmarks - unsortedCount);
  const organizedPercentage = totalBookmarks > 0 
    ? Math.round((organizedCount / totalBookmarks) * 100) 
    : 100;

  return (
    <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-5 relative overflow-hidden">
      
      {/* Top row: Simple mode indicator & Advanced Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Bookmark Organizer
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                SIMPLE MODE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clean and sort your links into tidy folders with one click.
            </p>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-2xl">
          <button
            onClick={() => setDisplayMode('simple')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              displayMode === 'simple'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setDisplayMode('advanced')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              displayMode === 'advanced'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Advanced Metrics</span>
          </button>
        </div>
      </div>

      {/* Main Progress Bar Section */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
        
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white">
              {organizedPercentage}% of Bookmarks Organized
            </span>
          </div>
          <span className="text-slate-400 font-mono text-xs">
            {organizedCount} / {totalBookmarks} in folders
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-3.5 p-0.5 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 shadow-sm"
            style={{ width: `${Math.max(6, organizedPercentage)}%` }}
          />
        </div>

        {/* Status text */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          {unsortedCount > 0 ? (
            <span>
              You have <strong className="text-amber-300 font-bold">{unsortedCount} unsorted</strong> links waiting to be filed.
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> All bookmarks are organized into clean categories!
            </span>
          )}

          {unsortedCount > 0 && (
            <button
              onClick={onCleanUnsorted}
              disabled={isScanning}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline text-xs transition"
            >
              Organize only unsorted ({unsortedCount})
            </button>
          )}
        </div>

        {/* Broken Link Health Alert Banner */}
        {brokenCount > 0 && onOpenBrokenLinksModal && (
          <div className="mt-1 px-4 py-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>
                Background health monitor detected <strong className="font-bold underline">{brokenCount} broken/unreachable</strong> bookmarks.
              </span>
            </div>
            <button
              onClick={onOpenBrokenLinksModal}
              className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-[11px] font-bold transition whitespace-nowrap"
            >
              Clean Dead Links
            </button>
          </div>
        )}
      </div>

      {/* Scanning active progress bar if currently running */}
      {isScanning && scanProgress && (
        <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-2xl p-4 flex flex-col gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-indigo-200 font-medium">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>{scanProgress.step}</span>
            </div>
            <span className="font-mono font-bold">{scanProgress.progress}%</span>
          </div>
          <div className="w-full bg-indigo-950 rounded-full h-2 overflow-hidden border border-indigo-500/30">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        <div className="flex items-center gap-2">
          <button
            id="btn-simple-auto-organize"
            onClick={onStartAutoOrganize}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.01]"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Organizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Auto-Organize All Bookmarks</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddBookmarkClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add Link</span>
          </button>
          
          <button
            onClick={onImportClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import</span>
          </button>
        </div>

      </div>

    </div>
  );
};
