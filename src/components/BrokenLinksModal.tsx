import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
  Globe, 
  Folder, 
  Filter,
  Check,
  Info,
  Archive
} from 'lucide-react';
import { Bookmark } from '../types';

interface BrokenLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onDeleteBookmarks: (ids: string[]) => void;
  onRecheckLinks: (ids?: string[]) => void;
  isChecking?: boolean;
  checkingProgress?: { current: number; total: number };
}

export const BrokenLinksModal: React.FC<BrokenLinksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onDeleteBookmarks,
  onRecheckLinks,
  isChecking = false,
  checkingProgress
}) => {
  // Collect all broken or unreachable links
  const brokenBookmarks = bookmarks.filter(
    b => b.linkHealth === 'broken' || b.linkHealth === 'unreachable'
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Auto select all broken links on modal open
  React.useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(brokenBookmarks.map(b => b.id)));
    }
  }, [isOpen, bookmarks]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(brokenBookmarks.map(b => b.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    onDeleteBookmarks(Array.from(selectedIds));
    setSelectedIds(new Set());
    if (count >= brokenBookmarks.length) {
      onClose();
    }
  };

  const count404 = brokenBookmarks.filter(b => b.httpStatusCode === 404).length;
  const count500 = brokenBookmarks.filter(b => (b.httpStatusCode || 0) >= 500).length;
  const countTimeout = brokenBookmarks.filter(b => !b.httpStatusCode || b.linkHealth === 'unreachable').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#0f0f14] border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#13131a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Broken & Unreachable Link Manager
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {brokenBookmarks.length} Issues Detected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically audit dead URLs, HTTP 404s, expired hosts, and server errors to maintain a healthy library.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Health Stats & Progress Bar */}
        <div className="px-6 py-4 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
              <span className="font-bold">{count404}</span>
              <span className="text-slate-400 text-[11px]">404 Not Found</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300">
              <span className="font-bold">{count500}</span>
              <span className="text-slate-400 text-[11px]">500+ Server Errors</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">
              <span className="font-bold">{countTimeout}</span>
              <span className="text-slate-400 text-[11px]">Timeouts / Dead DNS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRecheckLinks()}
              disabled={isChecking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking Library...' : 'Re-verify All Links'}</span>
            </button>
          </div>
        </div>

        {/* In-Progress Scan Bar */}
        {isChecking && checkingProgress && (
          <div className="px-6 py-2.5 bg-indigo-950/30 border-b border-indigo-500/20 text-xs">
            <div className="flex items-center justify-between text-indigo-200 mb-1 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                Auditing URLs in background...
              </span>
              <span>{checkingProgress.current} / {checkingProgress.total} bookmarks verified</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-indigo-950 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-300"
                style={{ width: `${Math.round((checkingProgress.current / Math.max(1, checkingProgress.total)) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between text-xs bg-[#111116]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium"
            >
              Select All ({brokenBookmarks.length})
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 font-medium"
            >
              Deselect All
            </button>
          </div>

          <div className="text-slate-400 text-xs font-mono">
            {selectedIds.size} of {brokenBookmarks.length} selected for deletion
          </div>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-3 flex-1">
          {brokenBookmarks.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Clean & Healthy Library!</h4>
              <p className="text-xs text-slate-400 max-w-md">
                No dead links or unreachable URLs detected in your bookmarks. The background health utility continuously monitors URL reachability.
              </p>
              <button
                onClick={() => onRecheckLinks()}
                disabled={isChecking}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Run Full Health Audit</span>
              </button>
            </div>
          ) : (
            brokenBookmarks.map((bookmark) => {
              const isSelected = selectedIds.has(bookmark.id);
              const statusCode = bookmark.httpStatusCode;
              const errorText = bookmark.linkHealthError || (statusCode ? `HTTP ${statusCode}` : 'Unreachable Host');

              return (
                <div
                  key={bookmark.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-sm'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggle(bookmark.id)}
                      className="mt-0.5 text-slate-400 hover:text-white transition shrink-0"
                    >
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-lg border border-slate-600 bg-black/40 hover:border-slate-400" />
                      )}
                    </button>

                    {/* Bookmark Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white truncate">
                          {bookmark.title}
                        </h4>
                        
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {errorText}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-slate-400 font-mono hover:text-indigo-300 truncate flex items-center gap-1 max-w-lg"
                        >
                          <span>{bookmark.url}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                        </a>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Folder className="w-3 h-3 text-slate-600" />
                          <span>{bookmark.folder}</span>
                        </span>
                        {bookmark.lastHealthCheckedAt && (
                          <span>
                            • Verified {new Date(bookmark.lastHealthCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions on single item */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onRecheckLinks([bookmark.id])}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                      title="Re-verify single link"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteBookmarks([bookmark.id])}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition"
                      title="Delete this broken bookmark immediately"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#13131a] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Deleting removed bookmarks purges dead records permanently from your library.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs font-semibold transition"
            >
              Close
            </button>
            <button
              id="btn-delete-selected-broken-links"
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0}
              className="px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete {selectedIds.size} Broken Bookmarks</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
