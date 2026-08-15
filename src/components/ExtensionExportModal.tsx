import React, { useState } from 'react';
import { 
  Download, 
  Chrome, 
  FileCode, 
  Check, 
  Copy, 
  ExternalLink, 
  Terminal, 
  FolderDown, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getExtensionFiles, generateExtensionZip } from '../utils/extensionGenerator';

interface ExtensionExportModalProps {
  onClose?: () => void;
}

export const ExtensionExportModal: React.FC<ExtensionExportModalProps> = ({ onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  const files = getExtensionFiles();
  const currentFile = files[selectedFileIdx];

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const zipBlob = await generateExtensionZip();
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-bookmark-organizer-chrome-extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate extension zip:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <Chrome className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white">Chrome Extension Package (Manifest V3)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Load
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
                Download the complete unpacked extension package to install directly into Google Chrome, Microsoft Edge, Brave, or any Chromium browser.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Packaging ZIP...' : 'Download Extension (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Step-by-step Installation Guide */}
      <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>HOW TO INSTALL IN GOOGLE CHROME (30 SECONDS)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-white">Download & Extract</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Click <strong>Download Extension (.ZIP)</strong> above and extract it into a folder on your computer.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-white">Open Extensions Page</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In Chrome, navigate to <code className="bg-black/60 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[10px]">chrome://extensions</code> in your address bar.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-white">Enable Developer Mode</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Turn ON the <strong>Developer mode</strong> toggle in the top-right corner of the extensions page.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              4
            </div>
            <h4 className="text-xs font-bold text-white">Load Unpacked</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Click <strong>Load unpacked</strong> in the top-left and select the extracted folder. Done!
            </p>
          </div>

        </div>
      </div>

      {/* Extension Code Inspector */}
      <div className="bg-[#111114] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* File tabs bar */}
        <div className="bg-black/40 px-5 py-3 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {files.map((f, idx) => (
              <button
                key={f.name}
                onClick={() => setSelectedFileIdx(idx)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  selectedFileIdx === idx
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{f.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 border border-white/10 text-xs font-semibold transition"
          >
            {copiedFile ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* File Description Header */}
        <div className="bg-white/2 px-5 py-2.5 border-b border-white/10 text-xs text-slate-400 flex items-center justify-between">
          <span>Path: <strong className="text-white font-mono">{currentFile.path}</strong> — {currentFile.description}</span>
          <span className="text-[11px] text-indigo-400 font-mono">{currentFile.content.split('\n').length} lines</span>
        </div>

        {/* Code Content Box */}
        <pre className="p-5 bg-black/50 text-slate-300 font-mono text-xs overflow-x-auto max-h-[400px] leading-relaxed select-all">
          <code>{currentFile.content}</code>
        </pre>

      </div>

    </div>
  );
};
