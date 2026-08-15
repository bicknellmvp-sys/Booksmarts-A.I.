import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Download, 
  Globe, 
  FileCode, 
  Sparkles, 
  ExternalLink,
  Code
} from 'lucide-react';
import { Bookmark } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  activeFolder?: string;
  selectedCount?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  activeFolder,
  selectedCount = 0
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [shareScope, setShareScope] = useState<'all' | 'folder' | 'selected'>(
    selectedCount > 0 ? 'selected' : activeFolder ? 'folder' : 'all'
  );

  if (!isOpen) return null;

  const targetBookmarks = shareScope === 'selected'
    ? bookmarks.filter(b => b.selected)
    : shareScope === 'folder' && activeFolder
    ? bookmarks.filter(b => b.folder === activeFolder || b.folder.startsWith(activeFolder + '/'))
    : bookmarks;

  const bundleId = 'nm-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const shareUrl = `${window.location.origin}/#vault=${bundleId}`;

  const shareCodeJson = JSON.stringify({
    vaultId: bundleId,
    version: '3.7',
    exportedAt: new Date().toISOString(),
    totalBookmarks: targetBookmarks.length,
    bookmarks: targetBookmarks.map(b => ({
      title: b.title,
      url: b.url,
      folder: b.folder,
      tags: b.tags,
      aiSummary: b.aiSummary
    }))
  }, null, 2);

  const markdownList = `# 🔖 NeuralMark Curated Bookmark Bundle (${targetBookmarks.length} links)
*Exported on ${new Date().toLocaleDateString()} via NeuralMark.ai*

${targetBookmarks.map(b => `- [**${b.title}**](${b.url}) — *${b.folder}*\n  ${b.aiSummary ? `> ${b.aiSummary}\n  ` : ''}${b.tags.length ? `Tags: ${b.tags.map(t => `#${t}`).join(' ')}` : ''}`).join('\n\n')}`;

  const handleCopy = (text: string, type: 'link' | 'code' | 'md') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (type === 'md') {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    }
  };

  const handleDownloadBundle = () => {
    const blob = new Blob([shareCodeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuralmark-bundle-${bundleId.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111114] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#111114]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Share Bookmark Vault</h3>
              <p className="text-[11px] text-slate-400 font-mono">1-CLICK BUNDLE & SHARE LINK</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 border border-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 text-xs">
          
          {/* Scope Selector */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setShareScope('all')}
              className={`flex-1 py-2 px-3 rounded-xl font-medium transition ${
                shareScope === 'all' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Library ({bookmarks.length})
            </button>
            {activeFolder && (
              <button
                onClick={() => setShareScope('folder')}
                className={`flex-1 py-2 px-3 rounded-xl font-medium transition truncate ${
                  shareScope === 'folder' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Folder: {activeFolder.split('/').pop()}
              </button>
            )}
            {selectedCount > 0 && (
              <button
                onClick={() => setShareScope('selected')}
                className={`flex-1 py-2 px-3 rounded-xl font-medium transition ${
                  shareScope === 'selected' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Selected ({selectedCount})
              </button>
            )}
          </div>

          {/* Quick Share Link Banner */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Public Shareable Link
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-black/50 border border-white/10 p-2 rounded-xl">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-slate-300 font-mono text-[11px] w-full focus:outline-none"
              />
              <button
                onClick={() => handleCopy(shareUrl, 'link')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Share Code & Bundle Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Code className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-white text-xs">Share Bundle Token</h4>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">CODE: {bundleId}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(bundleId, 'code')}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Code Copied' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownloadBundle}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1 transition"
                  title="Download JSON Bundle"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <FileCode className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-white text-xs">Markdown Snippet</h4>
                </div>
                <p className="text-[11px] text-slate-400">For Obsidian, Notion, or GitHub Readme</p>
              </div>

              <button
                onClick={() => handleCopy(markdownList, 'md')}
                className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 font-medium text-xs flex items-center justify-center gap-1.5 transition"
              >
                {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMarkdown ? 'Markdown Copied' : 'Copy Markdown'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#111114] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
