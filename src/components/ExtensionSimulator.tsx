import React, { useState } from 'react';
import { 
  Sparkles, 
  Chrome, 
  Layers, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  X, 
  Minus, 
  Square, 
  Globe, 
  CheckCircle2, 
  Loader2,
  Folder,
  Tag,
  AlertTriangle,
  FolderTree,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Bookmark, ScanScope } from '../types';

interface ExtensionSimulatorProps {
  bookmarks: Bookmark[];
  isScanning: boolean;
  onRunScan: (scope: ScanScope, prompt: string) => void;
  onOpenFullDashboard: () => void;
  lastResults?: { folders: string[]; count: number; explanation: string } | null;
  mode?: 'popup' | 'sidepanel';
}

export const ExtensionSimulator: React.FC<ExtensionSimulatorProps> = ({
  bookmarks,
  isScanning,
  onRunScan,
  onOpenFullDashboard,
  lastResults,
  mode = 'popup'
}) => {
  const [scope, setScope] = useState<ScanScope>('all');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'scan' | 'tree' | 'settings'>('scan');

  const totalBookmarks = bookmarks.length;
  const unsortedCount = bookmarks.filter(b => 
    b.folder.toLowerCase().includes('unsorted') || 
    b.folder === 'Bookmarks Bar' || 
    b.folder.toLowerCase().includes('other')
  ).length;

  const handleScanSubmit = () => {
    onRunScan(scope, customPrompt);
  };

  // Group folders for small tree preview
  const foldersMap: Record<string, number> = {};
  bookmarks.forEach(b => {
    foldersMap[b.folder] = (foldersMap[b.folder] || 0) + 1;
  });

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-6">
      
      {/* Mock Browser Container */}
      <div className="w-full max-w-4xl bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Browser Top Window Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          {/* Browser Tabs */}
          <div className="flex items-center gap-1 max-w-md mx-auto flex-1 justify-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-t-lg text-xs text-slate-200 border-t border-x border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium truncate">AI Bookmark Organizer (Extension)</span>
              <X className="w-3 h-3 text-slate-400 hover:text-white cursor-pointer ml-1" />
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 text-xs text-slate-400 hover:bg-slate-800/50 rounded-t-lg transition cursor-pointer">
              <Globe className="w-3 h-3" />
              <span className="truncate">GitHub</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 text-xs text-slate-400 hover:bg-slate-800/50 rounded-t-lg transition cursor-pointer">
              <Globe className="w-3 h-3" />
              <span className="truncate">React Documentation</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Minus className="w-3.5 h-3.5" />
            <Square className="w-3.5 h-3.5" />
            <X className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Browser URL bar & Extensions Toolbar */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <ArrowLeft className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
            <ArrowRight className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
            <RotateCw className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
          </div>

          <div className="flex-1 max-w-xl bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="text-indigo-400">chrome-extension://</span>
              <span className="text-slate-400">ai-bookmark-organizer/popup.html</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">🔒 Secure</span>
          </div>

          {/* Chrome Extensions Toolbar Icons */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/50 flex items-center justify-center cursor-pointer" title="AI Bookmark Organizer Active">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer" title="Extensions Menu">
              <Chrome className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Browser Viewport with Extension Interface */}
        <div className="bg-slate-950 min-h-[560px] p-4 sm:p-8 flex items-center justify-center relative">
          
          {/* Background web page mock */}
          <div className="absolute inset-0 p-8 opacity-20 pointer-events-none flex flex-col gap-4">
            <div className="h-8 bg-slate-700/40 rounded w-1/3" />
            <div className="h-4 bg-slate-700/30 rounded w-full" />
            <div className="h-4 bg-slate-700/30 rounded w-4/5" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="h-32 bg-slate-700/30 rounded" />
              <div className="h-32 bg-slate-700/30 rounded" />
              <div className="h-32 bg-slate-700/30 rounded" />
            </div>
          </div>

          {/* Chrome Extension Popup Window (380px standard extension dimensions) */}
          <div className="relative z-10 w-full max-w-[390px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Extension Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">AI Bookmark Organizer</h3>
                  <p className="text-[10px] text-slate-400">Gemini Manifest V3</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready
              </span>
            </div>

            {/* Extension Navigation Tabs */}
            <div className="flex items-center bg-slate-950/60 p-1 border-b border-slate-800/80 text-xs">
              <button
                onClick={() => setActiveTab('scan')}
                className={`flex-1 py-1 text-center rounded-md font-medium transition ${
                  activeTab === 'scan' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Scan & Organize
              </button>
              <button
                onClick={() => setActiveTab('tree')}
                className={`flex-1 py-1 text-center rounded-md font-medium transition ${
                  activeTab === 'tree' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Smart Folders ({Object.keys(foldersMap).length})
              </button>
            </div>

            {/* Extension Content */}
            <div className="p-4 flex flex-col gap-3.5 max-h-[440px] overflow-y-auto">
              
              {activeTab === 'scan' ? (
                <>
                  {/* Stats card */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-indigo-400">{totalBookmarks}</span>
                      <span className="text-[10px] text-slate-400">Total Bookmarks</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-amber-400">{unsortedCount}</span>
                      <span className="text-[10px] text-slate-400">Unsorted / Loose</span>
                    </div>
                  </div>

                  {/* Scope Selector */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 mb-1 block uppercase tracking-wide">
                      Scan Scope:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setScope('all')}
                        className={`p-2 rounded-lg border text-left text-xs transition ${
                          scope === 'all'
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>Scan All ({totalBookmarks})</div>
                        <div className="text-[10px] text-slate-400 font-normal">Entire library</div>
                      </button>

                      <button
                        onClick={() => setScope('unorganized')}
                        className={`p-2 rounded-lg border text-left text-xs transition ${
                          scope === 'unorganized'
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>Scan Unsorted ({unsortedCount})</div>
                        <div className="text-[10px] text-slate-400 font-normal">Clean loose links</div>
                      </button>
                    </div>
                  </div>

                  {/* Custom Prompt */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 mb-1 block uppercase tracking-wide">
                      Instructions for AI:
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g. Separate work projects from cooking recipes, create max 6 tidy folders..."
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleScanSubmit}
                    disabled={isScanning}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Gemini Categorizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run AI Categorization</span>
                      </>
                    )}
                  </button>

                  {/* Results notice */}
                  {lastResults && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
                      <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Organized {lastResults.count} Bookmarks!
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        {lastResults.explanation}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Smart Folders Tree view */
                <div className="flex flex-col gap-1.5">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                    Current Categorized Folders:
                  </div>
                  {Object.entries(foldersMap).map(([folderName, count]) => (
                    <div
                      key={folderName}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Folder className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span className="truncate font-medium">{folderName}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-bold">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Extension Footer */}
            <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <button
                onClick={onOpenFullDashboard}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Full Manager View</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <span>v1.0.0 (V3)</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
