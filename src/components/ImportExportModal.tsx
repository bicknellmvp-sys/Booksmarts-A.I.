import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  FileText, 
  FileCode, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  Chrome
} from 'lucide-react';
import { Bookmark } from '../types';
import { 
  parseNetscapeBookmarks, 
  exportToNetscapeHtml, 
  exportToJson, 
  exportToMarkdown 
} from '../utils/bookmarkParser';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onImportBookmarks: (newBookmarks: Bookmark[], replace: boolean) => void;
  defaultTab?: 'import' | 'export';
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onImportBookmarks,
  defaultTab = 'import'
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>(defaultTab);
  const [pasteContent, setPasteContent] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processImportContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const processImportContent = (content: string, sourceName = 'file') => {
    try {
      let parsed: Bookmark[] = [];
      if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        const rawJson = JSON.parse(content);
        parsed = Array.isArray(rawJson) ? rawJson : [rawJson];
      } else {
        parsed = parseNetscapeBookmarks(content);
      }

      if (parsed.length > 0) {
        onImportBookmarks(parsed, replaceExisting);
        setImportStatus(`Successfully imported ${parsed.length} bookmarks from ${sourceName}!`);
        setTimeout(() => {
          onClose();
          setImportStatus(null);
        }, 1500);
      } else {
        setImportStatus('No valid bookmarks detected in file.');
      }
    } catch (err: any) {
      setImportStatus('Error parsing bookmarks: ' + err.message);
    }
  };

  const handleDownloadFile = (type: 'html' | 'json' | 'md') => {
    let content = '';
    let filename = '';
    let mime = 'text/plain';

    if (type === 'html') {
      content = exportToNetscapeHtml(bookmarks);
      filename = `bookmarks_organized_${new Date().toISOString().slice(0, 10)}.html`;
      mime = 'text/html';
    } else if (type === 'json') {
      content = exportToJson(bookmarks);
      filename = `bookmarks_ai_${new Date().toISOString().slice(0, 10)}.json`;
      mime = 'application/json';
    } else if (type === 'md') {
      content = exportToMarkdown(bookmarks);
      filename = `bookmarks_ai_${new Date().toISOString().slice(0, 10)}.md`;
      mime = 'text/markdown';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111114] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Chrome className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Import & Export Bookmarks</h3>
              <p className="text-[11px] text-slate-400 font-mono">CHROME / NETSCAPE HTML & JSON</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 border border-white/10 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-white/10 bg-black/40 text-xs">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 font-semibold text-center transition flex items-center justify-center gap-2 ${
              activeTab === 'import'
                ? 'border-b-2 border-indigo-500 text-indigo-300 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import Bookmarks</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 font-semibold text-center transition flex items-center justify-center gap-2 ${
              activeTab === 'export'
                ? 'border-b-2 border-indigo-500 text-indigo-300 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Bookmarks</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs">
          {activeTab === 'import' ? (
            <div className="flex flex-col gap-4">
              
              {/* Chrome Export Info helper */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 flex items-start gap-3">
                <Chrome className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed text-[11px]">
                  <strong>How to export from Google Chrome:</strong> Press <code className="bg-indigo-900/50 px-1.5 py-0.5 rounded text-white font-mono">Ctrl+Shift+O</code> (or Cmd+Shift+O), click the three dots in top-right, and select <strong>"Export bookmarks"</strong> to get a <code className="text-white">.html</code> file.
                </p>
              </div>

              {/* Upload Drop Area */}
              <label className="border-2 border-dashed border-white/15 hover:border-indigo-500/60 rounded-3xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition bg-white/5 hover:bg-white/10">
                <Upload className="w-9 h-9 text-indigo-400 mb-2" />
                <span className="font-bold text-white text-xs">Click to upload Chrome Bookmarks HTML or JSON</span>
                <span className="text-[11px] text-slate-400 mt-1 font-mono">Accepts standard bookmarks.html or .json files</span>
                <input
                  type="file"
                  accept=".html,.htm,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="replace-chk"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <label htmlFor="replace-chk" className="text-slate-300 cursor-pointer font-medium">
                  Replace existing library (unchecked merges with current bookmarks)
                </label>
              </div>

              {importStatus && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-xs">
                  {importStatus}
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-slate-300">
                Export your <strong className="text-white font-mono">{bookmarks.length}</strong> AI-organized bookmarks back to standard browser formats:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* HTML Export */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-3">
                      <Chrome className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-xs">Chrome HTML Format</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Standard Netscape format for 1-click import into Chrome, Edge, Safari, Firefox.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile('html')}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition"
                  >
                    Download HTML
                  </button>
                </div>

                {/* JSON Export */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-xs">JSON Backup</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Full structured data including AI tags, summaries, and folder trees.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile('json')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition"
                  >
                    Download JSON
                  </button>
                </div>

                {/* Markdown Export */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mb-3">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-xs">Markdown Document</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Formatted markdown list with summaries for Obsidian, Notion, or GitHub.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile('md')}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition"
                  >
                    Download Markdown
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#111114] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
