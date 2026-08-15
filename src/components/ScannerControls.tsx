import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckSquare, 
  HelpCircle, 
  SlidersHorizontal, 
  ArrowRight, 
  Loader2,
  FolderTree,
  ListFilter,
  Wand2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ScanScope, Bookmark, DashboardDisplayMode } from '../types';

interface ScannerControlsProps {
  bookmarks: Bookmark[];
  selectedBookmarks: Bookmark[];
  selectedFolder: string | null;
  scanScope: ScanScope;
  setScanScope: (scope: ScanScope) => void;
  customInstructions: string;
  setCustomInstructions: (inst: string) => void;
  depth: 'nested' | 'flat';
  setDepth: (depth: 'nested' | 'flat') => void;
  isScanning: boolean;
  scanProgress: { step: string; progress: number } | null;
  onStartScan: () => void;
  displayMode?: DashboardDisplayMode;
  setDisplayMode?: (mode: DashboardDisplayMode) => void;
}

const PRESET_PROMPTS = [
  {
    label: 'Work vs Personal',
    prompt: 'Separate coding, dev tools, and work projects from recipes, travel, finance, and leisure.'
  },
  {
    label: 'Deep Tech Stacks',
    prompt: 'Create nested subfolders by tech category: Frontend, Backend, AI/LLMs, DevOps, and UI Design.'
  },
  {
    label: 'Minimalist (5 Folders)',
    prompt: 'Organize all bookmarks into exactly 5 broad, tidy categories with descriptive tags.'
  },
  {
    label: 'Action-Oriented',
    prompt: 'Group into "To Read / Learn", "Daily Tools", "Documentation & Reference", and "Inspiration".'
  }
];

export const ScannerControls: React.FC<ScannerControlsProps> = ({
  bookmarks,
  selectedBookmarks,
  selectedFolder,
  scanScope,
  setScanScope,
  customInstructions,
  setCustomInstructions,
  depth,
  setDepth,
  isScanning,
  scanProgress,
  onStartScan,
  displayMode,
  setDisplayMode
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const unsortedCount = bookmarks.filter(b => 
    b.folder.toLowerCase().includes('unsorted') || 
    b.folder === 'Bookmarks Bar' || 
    b.folder.toLowerCase().includes('other')
  ).length;

  const targetCount = 
    scanScope === 'all' ? bookmarks.length :
    scanScope === 'selected' ? selectedBookmarks.length :
    scanScope === 'unorganized' ? unsortedCount :
    selectedFolder ? bookmarks.filter(b => b.folder === selectedFolder).length : bookmarks.length;

  return (
    <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Decorative radial glows */}
      <div className="absolute right-[-40px] top-[-40px] w-72 h-72 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute left-[-40px] bottom-[-40px] w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-5">
        
        {/* Header & Sub-Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold">
                  INTELLIGENT SCANNER & TAXONOMY ENGINE
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ADVANCED METRICS
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Automated ML Bookmark Organizer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {setDisplayMode && (
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl">
                <button
                  onClick={() => setDisplayMode('simple')}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Simple
                </button>
                <button
                  onClick={() => setDisplayMode('advanced')}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-sm transition"
                >
                  Advanced
                </button>
              </div>
            )}

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showAdvanced ? 'Hide Depth' : 'Depth Options'}</span>
            </button>
          </div>
        </div>

        {/* Scope Selector in Bento Grid Cards */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Targeting Scope:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              id="scope-all-btn"
              onClick={() => setScanScope('all')}
              className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
                scanScope === 'all'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-600/10'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold">All Bookmarks</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-black/40 text-slate-200 border border-white/10">
                  {bookmarks.length}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight">Reorganize complete tree</span>
            </button>

            <button
              id="scope-selected-btn"
              onClick={() => setScanScope('selected')}
              disabled={selectedBookmarks.length === 0}
              className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
                scanScope === 'selected'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-600/10'
                  : selectedBookmarks.length === 0
                  ? 'bg-white/2 border-white/5 text-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold">Selected Only</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-black/40 text-slate-200 border border-white/10">
                  {selectedBookmarks.length}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight">
                {selectedBookmarks.length > 0 ? 'Target checked items' : 'Check items in list'}
              </span>
            </button>

            <button
              id="scope-unorganized-btn"
              onClick={() => setScanScope('unorganized')}
              className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
                scanScope === 'unorganized'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-600/10'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold">Unsorted / Loose</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-black/40 text-slate-200 border border-white/10">
                  {unsortedCount}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight">Clean unorganized links</span>
            </button>

            <button
              id="scope-folder-btn"
              onClick={() => setScanScope('folder')}
              disabled={!selectedFolder}
              className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
                scanScope === 'folder'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-600/10'
                  : !selectedFolder
                  ? 'bg-white/2 border-white/5 text-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold truncate">Current Folder</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-black/40 text-slate-200 border border-white/10">
                  {selectedFolder ? bookmarks.filter(b => b.folder === selectedFolder).length : 0}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 truncate leading-tight">
                {selectedFolder ? selectedFolder.split('/').pop() : 'Select a folder'}
              </span>
            </button>
          </div>
        </div>

        {/* Custom Instructions Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Custom Organization Directive:</span>
              <span className="text-slate-500 font-normal lowercase">(optional ML prompt guidance)</span>
            </label>
            {customInstructions && (
              <button 
                onClick={() => setCustomInstructions('')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Clear directive
              </button>
            )}
          </div>
          
          <div className="relative">
            <textarea
              id="custom-instructions-input"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., 'Categorize by programming language and cloud tools, keep recipes under Personal/Cooking, max 6 top folders'..."
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition resize-none leading-relaxed"
            />
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium mr-1">
              <Wand2 className="w-3 h-3 text-indigo-400" /> Presets:
            </span>
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCustomInstructions(preset.prompt)}
                className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                  customInstructions === preset.prompt
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Depth Settings Bar */}
        {showAdvanced && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-5">
              <span className="font-bold text-slate-300">Hierarchy Depth:</span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="depth"
                  checked={depth === 'nested'}
                  onChange={() => setDepth('nested')}
                  className="accent-indigo-500 w-4 h-4"
                />
                <span>Nested Subfolders (e.g. Development/Frontend)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="depth"
                  checked={depth === 'flat'}
                  onChange={() => setDepth('flat')}
                  className="accent-indigo-500 w-4 h-4"
                />
                <span>Flat Folders Only</span>
              </label>
            </div>
          </div>
        )}

        {/* Action Button & Telemetry */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {targetCount > 0 ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Targeting <strong className="text-white font-mono">{targetCount}</strong> bookmark{targetCount !== 1 ? 's' : ''} for categorization
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                No bookmarks in selected scope
              </span>
            )}
          </div>

          <button
            id="run-ai-scan-btn"
            onClick={onStartScan}
            disabled={isScanning || targetCount === 0}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing Taxonomy with Gemini 3.7...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Intelligent Sweep ({targetCount})</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </button>
        </div>

        {/* Live Progress Bar when Scanning */}
        {isScanning && scanProgress && (
          <div className="bg-white/5 rounded-2xl p-4 border border-indigo-500/40 flex flex-col gap-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> {scanProgress.step}
              </span>
              <span className="font-mono text-slate-300 font-bold">{scanProgress.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress.progress}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
