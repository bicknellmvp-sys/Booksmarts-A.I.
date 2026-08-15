import React, { useState } from 'react';
import { X, Plus, Link, Folder, Tag, Sparkles } from 'lucide-react';
import { Bookmark } from '../types';
import { getFaviconUrl } from '../utils/bookmarkParser';

interface AddBookmarkModalProps {
  allFolders: string[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bookmark: Bookmark) => void;
  onAddBatch: (bookmarks: Bookmark[]) => void;
}

export const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
  allFolders,
  isOpen,
  onClose,
  onAdd,
  onAddBatch
}) => {
  const [tab, setTab] = useState<'single' | 'batch'>('single');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [folder, setFolder] = useState('Unsorted Bookmarks');
  const [tagsInput, setTagsInput] = useState('');
  const [batchText, setBatchText] = useState('');

  if (!isOpen) return null;

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const newBookmark: Bookmark = {
      id: 'bm-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: title.trim() || formattedUrl,
      url: formattedUrl,
      folder: folder || 'Unsorted Bookmarks',
      tags,
      dateAdded: Date.now(),
      favicon: getFaviconUrl(formattedUrl),
      status: 'synced'
    };

    onAdd(newBookmark);
    onClose();
    setTitle('');
    setUrl('');
    setTagsInput('');
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchText.trim()) return;

    const lines = batchText.split('\n').filter(l => l.trim().length > 0);
    const newItems: Bookmark[] = [];

    lines.forEach(line => {
      let u = line.trim();
      let t = u;
      if (line.includes('|')) {
        const parts = line.split('|');
        t = parts[0].trim();
        u = parts[1].trim();
      }

      if (!u.startsWith('http://') && !u.startsWith('https://')) {
        u = 'https://' + u;
      }

      newItems.push({
        id: 'bm-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        title: t,
        url: u,
        folder: folder || 'Unsorted Bookmarks',
        tags: [],
        dateAdded: Date.now(),
        favicon: getFaviconUrl(u),
        status: 'synced'
      });
    });

    onAddBatch(newItems);
    onClose();
    setBatchText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111114] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Bookmarks</h3>
              <p className="text-[11px] text-slate-400 font-mono">MANUAL URL ENTRY</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 border border-white/10 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-white/10 bg-black/40 text-xs">
          <button
            onClick={() => setTab('single')}
            className={`flex-1 py-3 font-semibold text-center transition ${
              tab === 'single'
                ? 'border-b-2 border-indigo-500 text-indigo-300 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Single Bookmark
          </button>
          <button
            onClick={() => setTab('batch')}
            className={`flex-1 py-3 font-semibold text-center transition ${
              tab === 'batch'
                ? 'border-b-2 border-indigo-500 text-indigo-300 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Batch Paste URLs
          </button>
        </div>

        {/* Form Body */}
        {tab === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="p-6 flex flex-col gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 text-[11px] font-mono uppercase tracking-wider">Target URL *</label>
              <div className="relative">
                <Link className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="https://example.com/guide..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 text-[11px] font-mono uppercase tracking-wider">Title (Optional)</label>
              <input
                type="text"
                placeholder="Leave blank to auto-detect title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5 text-[11px] font-mono uppercase tracking-wider">Folder Destination</label>
                <select
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                >
                  <option value="Unsorted Bookmarks" className="bg-[#111114]">Unsorted Bookmarks</option>
                  <option value="Bookmarks Bar" className="bg-[#111114]">Bookmarks Bar</option>
                  {allFolders.map(f => (
                    <option key={f} value={f} className="bg-[#111114]">{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5 text-[11px] font-mono uppercase tracking-wider">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="react, docs, css"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition"
              >
                Add Bookmark
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleBatchSubmit} className="p-6 flex flex-col gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 text-[11px] font-mono uppercase tracking-wider">
                Paste URLs (One per line or "Title | URL"):
              </label>
              <textarea
                rows={5}
                required
                placeholder={`https://github.com/facebook/react\nTailwind CSS Docs | https://tailwindcss.com/docs\nhttps://openai.com`}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 text-[11px] font-mono uppercase tracking-wider">Assign Initial Folder</label>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="Unsorted Bookmarks" className="bg-[#111114]">Unsorted Bookmarks</option>
                <option value="Bookmarks Bar" className="bg-[#111114]">Bookmarks Bar</option>
                {allFolders.map(f => (
                  <option key={f} value={f} className="bg-[#111114]">{f}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition"
              >
                Add All URLs
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
