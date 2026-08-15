import React, { useState } from 'react';
import { 
  Search, 
  Tag as TagIcon, 
  ExternalLink, 
  Copy, 
  Trash2, 
  Folder, 
  Check, 
  Sparkles, 
  Filter, 
  CheckSquare, 
  Square, 
  ArrowUpDown, 
  FolderInput, 
  AlertTriangle, 
  Globe, 
  Plus, 
  X, 
  SlidersHorizontal, 
  Share2, 
  CheckCircle2, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Bookmark, SearchFilterState } from '../types';
import { getDomain } from '../utils/bookmarkParser';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  allFolders: string[];
  selectedBookmarkIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMoveBookmarks: (bookmarkIds: string[], targetFolder: string) => void;
  onDeleteBookmarks: (bookmarkIds: string[]) => void;
  onUpdateBookmarkTags: (bookmarkId: string, tags: string[]) => void;
  onSingleAiAutoTag: (bookmark: Bookmark) => Promise<void>;
  onBatchTagModalOpen: () => void;
  onBatchAiAutoTag: (bookmarkIds: string[]) => void;
  onShareSelected: () => void;
  currentFolderFilter: string | null;
  onSelectFolderFilter: (folder: string | null) => void;
  isAiTagging?: boolean;
  onOpenBrokenLinksModal?: () => void;
  onCheckLinkHealth?: (ids?: string[]) => void;
  isCheckingHealth?: boolean;
}

export const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  allFolders,
  selectedBookmarkIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onMoveBookmarks,
  onDeleteBookmarks,
  onUpdateBookmarkTags,
  onSingleAiAutoTag,
  onBatchTagModalOpen,
  onBatchAiAutoTag,
  onShareSelected,
  currentFolderFilter,
  onSelectFolderFilter,
  isAiTagging = false,
  onOpenBrokenLinksModal,
  onCheckLinkHealth,
  isCheckingHealth = false
}) => {
  // Search & Advanced Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [titleKeyword, setTitleKeyword] = useState('');
  const [urlKeyword, setUrlKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagMatchMode, setTagMatchMode] = useState<'any' | 'all'>('any');
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);
  const [onlyUnsorted, setOnlyUnsorted] = useState(false);
  const [onlyWithSummary, setOnlyWithSummary] = useState(false);
  const [onlyBrokenLinks, setOnlyBrokenLinks] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'folder' | 'tags-count' | 'health'>('date');

  // Inline tag editing state per bookmark
  const [editingTagBmId, setEditingTagBmId] = useState<string | null>(null);
  const [inlineTagInput, setInlineTagInput] = useState('');
  const [taggingId, setTaggingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bulkMoveTarget, setBulkMoveTarget] = useState<string>('');

  // Extract all unique tags across all bookmarks
  const allTags: string[] = Array.from(
    new Set<string>(bookmarks.flatMap(b => b.tags || []))
  ).filter(Boolean).sort();

  const brokenLinksCount = bookmarks.filter(b => b.linkHealth === 'broken' || b.linkHealth === 'unreachable').length;

  // Active filter count for badge
  const activeFiltersCount = 
    (titleKeyword ? 1 : 0) +
    (urlKeyword ? 1 : 0) +
    (selectedTags.length > 0 ? 1 : 0) +
    (onlyDuplicates ? 1 : 0) +
    (onlyUnsorted ? 1 : 0) +
    (onlyWithSummary ? 1 : 0) +
    (onlyBrokenLinks ? 1 : 0) +
    (currentFolderFilter ? 1 : 0);

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setTitleKeyword('');
    setUrlKeyword('');
    setSelectedTags([]);
    setOnlyDuplicates(false);
    setOnlyUnsorted(false);
    setOnlyWithSummary(false);
    setOnlyBrokenLinks(false);
    onSelectFolderFilter(null);
  };

  // Filter Bookmarks Engine
  const filtered = bookmarks.filter(b => {
    // 1. Folder filter
    if (currentFolderFilter === '__duplicates__') {
      if (!b.isDuplicate) return false;
    } else if (currentFolderFilter !== null) {
      if (b.folder !== currentFolderFilter && !b.folder.startsWith(currentFolderFilter + '/')) {
        return false;
      }
    }

    // 2. Global search query across title, URL, tags, summary, folder
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchUrl = b.url.toLowerCase().includes(q);
      const matchSummary = b.aiSummary?.toLowerCase().includes(q);
      const matchFolder = b.folder.toLowerCase().includes(q);
      const matchTag = b.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchUrl && !matchSummary && !matchFolder && !matchTag) {
        return false;
      }
    }

    // 3. Keyword in Title filter
    if (titleKeyword.trim()) {
      if (!b.title.toLowerCase().includes(titleKeyword.toLowerCase().trim())) {
        return false;
      }
    }

    // 4. Keyword in URL filter
    if (urlKeyword.trim()) {
      if (!b.url.toLowerCase().includes(urlKeyword.toLowerCase().trim())) {
        return false;
      }
    }

    // 5. Tags filter (ANY or ALL)
    if (selectedTags.length > 0) {
      if (tagMatchMode === 'all') {
        const hasAll = selectedTags.every(t => b.tags.includes(t));
        if (!hasAll) return false;
      } else {
        const hasAny = selectedTags.some(t => b.tags.includes(t));
        if (!hasAny) return false;
      }
    }

    // 6. Only duplicates
    if (onlyDuplicates && !b.isDuplicate) return false;

    // 7. Only unsorted
    if (onlyUnsorted) {
      const isUnsorted = b.folder.toLowerCase().includes('unsorted') || b.folder === 'Bookmarks Bar';
      if (!isUnsorted) return false;
    }

    // 8. Only with AI Summary
    if (onlyWithSummary && !b.aiSummary) return false;

    // 9. Only broken or unreachable links
    if (onlyBrokenLinks && !(b.linkHealth === 'broken' || b.linkHealth === 'unreachable')) return false;

    return true;
  });

  // Sort bookmarks
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'folder') {
      return a.folder.localeCompare(b.folder);
    }
    if (sortBy === 'tags-count') {
      return (b.tags.length || 0) - (a.tags.length || 0);
    }
    if (sortBy === 'health') {
      const getHealthScore = (item: Bookmark) => {
        if (item.linkHealth === 'broken') return 0;
        if (item.linkHealth === 'unreachable') return 1;
        if (item.linkHealth === 'checking') return 2;
        if (item.linkHealth === 'untested' || !item.linkHealth) return 3;
        return 4; // healthy
      };
      return getHealthScore(a) - getHealthScore(b);
    }
    return (b.dateAdded || 0) - (a.dateAdded || 0);
  });

  const handleCopyUrl = (bm: Bookmark) => {
    navigator.clipboard.writeText(bm.url);
    setCopiedId(bm.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBulkMove = () => {
    if (bulkMoveTarget && selectedBookmarkIds.size > 0) {
      onMoveBookmarks(Array.from(selectedBookmarkIds), bulkMoveTarget);
      setBulkMoveTarget('');
    }
  };

  const handleBulkDelete = () => {
    if (selectedBookmarkIds.size > 0) {
      if (confirm(`Delete ${selectedBookmarkIds.size} selected bookmark(s)?`)) {
        onDeleteBookmarks(Array.from(selectedBookmarkIds));
      }
    }
  };

  const handleAddInlineTag = (bookmark: Bookmark) => {
    const clean = inlineTagInput.trim().toLowerCase().replace(/^#/, '');
    if (clean && !bookmark.tags.includes(clean)) {
      const updated = [...bookmark.tags, clean];
      onUpdateBookmarkTags(bookmark.id, updated);
      setInlineTagInput('');
      setEditingTagBmId(null);
    }
  };

  const handleRemoveInlineTag = (bookmark: Bookmark, tagToRemove: string) => {
    const updated = bookmark.tags.filter(t => t !== tagToRemove);
    onUpdateBookmarkTags(bookmark.id, updated);
  };

  const handleSingleAiTag = async (bookmark: Bookmark) => {
    setTaggingId(bookmark.id);
    await onSingleAiAutoTag(bookmark);
    setTaggingId(null);
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl">
      
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Main search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="bookmark-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across title, URL, tags, summary, or folders..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-16 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/80 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Advanced Filter Toggle & Sort */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
              {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-2 rounded-2xl text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400 text-[11px] font-mono">SORT:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
              >
                <option value="date" className="bg-[#111114]">Date Added</option>
                <option value="title" className="bg-[#111114]">Title (A-Z)</option>
                <option value="folder" className="bg-[#111114]">Folder</option>
                <option value="tags-count" className="bg-[#111114]">Most Tags</option>
                <option value="health" className="bg-[#111114]">Broken / Dead First</option>
              </select>
            </div>
          </div>

        </div>

        {/* Advanced Filter Drawer / Section */}
        {showAdvancedFilters && (
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-4 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-bold text-white font-mono flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                ADVANCED SEARCH & FILTER CRITERIA
              </span>
              <button
                onClick={handleClearAllFilters}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Reset All Filters
              </button>
            </div>

            {/* Keyword filters grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">KEYWORDS IN TITLE</label>
                <input
                  type="text"
                  value={titleKeyword}
                  onChange={(e) => setTitleKeyword(e.target.value)}
                  placeholder="e.g. React, Tutorial, Dashboard"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">KEYWORDS IN URL / DOMAIN</label>
                <input
                  type="text"
                  value={urlKeyword}
                  onChange={(e) => setUrlKeyword(e.target.value)}
                  placeholder="e.g. github.com, .org, /docs"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setOnlyDuplicates(!onlyDuplicates)}
                className={`px-3 py-1.5 rounded-xl border font-medium text-xs transition ${
                  onlyDuplicates
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                ⚠ Only Duplicates
              </button>
              <button
                onClick={() => setOnlyUnsorted(!onlyUnsorted)}
                className={`px-3 py-1.5 rounded-xl border font-medium text-xs transition ${
                  onlyUnsorted
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                📁 Only Unsorted / Loose
              </button>
              <button
                onClick={() => setOnlyWithSummary(!onlyWithSummary)}
                className={`px-3 py-1.5 rounded-xl border font-medium text-xs transition ${
                  onlyWithSummary
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                ✨ Has AI Summary
              </button>
              <button
                onClick={() => setOnlyBrokenLinks(!onlyBrokenLinks)}
                className={`px-3 py-1.5 rounded-xl border font-medium text-xs transition ${
                  onlyBrokenLinks
                    ? 'bg-rose-600/30 text-rose-200 border-rose-500/60 font-bold shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-300'
                }`}
              >
                🛡️ Only Broken Links ({brokenLinksCount})
              </button>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">TAG MATCH:</span>
                <button
                  onClick={() => setTagMatchMode('any')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    tagMatchMode === 'any' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  ANY
                </button>
                <button
                  onClick={() => setTagMatchMode('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    tagMatchMode === 'all' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  ALL
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Tag filter pills bar */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 flex-shrink-0 text-[11px] font-mono">
            <TagIcon className="w-3.5 h-3.5 text-indigo-400" /> TAGS:
          </span>
          <button
            onClick={() => setSelectedTags([])}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              selectedTags.length === 0
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10 hover:bg-white/10'
            }`}
          >
            All Tags
          </button>
          {allTags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTagFilter(tag)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-500 text-white border border-indigo-400 font-bold shadow-sm shadow-indigo-500/30'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Filter Chips & Clear summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs bg-indigo-950/20 border border-indigo-500/20 p-2.5 rounded-2xl">
          <span className="text-[10px] font-mono text-indigo-300 font-bold">ACTIVE FILTERS:</span>
          {currentFolderFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-indigo-500/20 text-indigo-200 text-[11px]">
              Folder: {currentFolderFilter}
              <button onClick={() => onSelectFolderFilter(null)} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
          {titleKeyword && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-indigo-500/20 text-indigo-200 text-[11px]">
              Title: "{titleKeyword}"
              <button onClick={() => setTitleKeyword('')} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
          {urlKeyword && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-indigo-500/20 text-indigo-200 text-[11px]">
              URL: "{urlKeyword}"
              <button onClick={() => setUrlKeyword('')} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedTags.map(t => (
            <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-indigo-500/30 text-white font-mono text-[11px]">
              #{t}
              <button onClick={() => toggleTagFilter(t)} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {onlyDuplicates && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-rose-500/20 text-rose-300 text-[11px]">
              Duplicates Only
              <button onClick={() => setOnlyDuplicates(false)} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
          {onlyUnsorted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-amber-500/20 text-amber-300 text-[11px]">
              Unsorted Only
              <button onClick={() => setOnlyUnsorted(false)} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={handleClearAllFilters}
            className="text-[11px] text-slate-400 hover:text-white underline ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Bulk selection actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (selectedBookmarkIds.size === filtered.length && filtered.length > 0) {
                onDeselectAll();
              } else {
                onSelectAll();
              }
            }}
            className="flex items-center gap-2 text-slate-200 hover:text-white font-semibold"
          >
            {selectedBookmarkIds.size > 0 && selectedBookmarkIds.size === filtered.length ? (
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            ) : selectedBookmarkIds.size > 0 ? (
              <div className="w-4 h-4 rounded bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                -
              </div>
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>
              {selectedBookmarkIds.size > 0
                ? `${selectedBookmarkIds.size} Selected`
                : `Select All (${filtered.length})`}
            </span>
          </button>

          {selectedBookmarkIds.size > 0 && (
            <button
              onClick={onDeselectAll}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {selectedBookmarkIds.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Batch AI Auto-Tag */}
            <button
              onClick={() => onBatchAiAutoTag(Array.from(selectedBookmarkIds))}
              disabled={isAiTagging}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiTagging ? 'Tagging...' : 'AI Auto-Tag'}</span>
            </button>

            {/* Batch Tag Edit */}
            <button
              onClick={onBatchTagModalOpen}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition"
            >
              <TagIcon className="w-3.5 h-3.5 text-indigo-300" />
              <span>Manage Tags</span>
            </button>

            {/* Share Selected */}
            <button
              onClick={onShareSelected}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share</span>
            </button>

            {/* Move to folder dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                value={bulkMoveTarget}
                onChange={(e) => setBulkMoveTarget(e.target.value)}
                className="bg-black/60 border border-white/15 rounded-xl px-2.5 py-1 text-xs text-slate-200 outline-none max-w-[150px]"
              >
                <option value="">Move to Folder...</option>
                {allFolders.map(f => (
                  <option key={f} value={f} className="bg-[#111114]">{f}</option>
                ))}
              </select>
              <button
                onClick={handleBulkMove}
                disabled={!bulkMoveTarget}
                className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold text-xs disabled:opacity-40 hover:bg-indigo-500 transition"
              >
                Move
              </button>
            </div>

            {/* Delete button */}
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Bookmarks List Container */}
      <div className="flex flex-col gap-3.5 max-h-[620px] overflow-y-auto pr-1">
        {sorted.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400 gap-2.5 bg-white/2 rounded-2xl border border-dashed border-white/10">
            <Globe className="w-9 h-9 text-slate-600" />
            <p className="text-sm font-bold text-slate-200">No bookmarks matched the filters</p>
            <p className="text-xs text-slate-500 max-w-sm">
              {searchQuery || activeFiltersCount > 0
                ? 'Try clearing active tags or adjusting keywords.'
                : 'No bookmarks currently in library. Click "Import" or "Add URL" to get started.'}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="mt-2 px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          sorted.map((bm) => {
            const isSelected = selectedBookmarkIds.has(bm.id);
            const domain = getDomain(bm.url);
            const isTaggingThis = taggingId === bm.id;

            return (
              <div
                key={bm.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', bm.id);
                }}
                className={`group p-4 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-900/20'
                    : bm.isDuplicate
                    ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {/* Header row: Checkbox, Favicon, Title, Domain, Folder Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleSelect(bm.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-400 shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>

                    {/* Favicon */}
                    <div className="w-6 h-6 rounded-lg mt-0.5 bg-black/40 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {bm.favicon ? (
                        <img
                          src={bm.favicon}
                          alt=""
                          className="w-4 h-4 object-contain"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>

                    {/* Title & URL */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={bm.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-bold text-white hover:text-indigo-400 transition truncate max-w-lg"
                        >
                          {bm.title}
                        </a>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/40 text-slate-400 border border-white/10">
                          {domain}
                        </span>
                        {bm.isDuplicate && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3" /> Duplicate
                          </span>
                        )}
                        {/* Link Health Badge */}
                        {bm.linkHealth === 'broken' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>{bm.linkHealthError || (bm.httpStatusCode ? `HTTP ${bm.httpStatusCode}` : 'Dead Link')}</span>
                          </span>
                        )}
                        {bm.linkHealth === 'unreachable' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            <AlertTriangle className="w-3 h-3 text-purple-400" />
                            <span>{bm.linkHealthError || 'Unreachable Host'}</span>
                          </span>
                        )}
                        {bm.linkHealth === 'healthy' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Online</span>
                          </span>
                        )}
                        {bm.linkHealth === 'checking' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-300 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                            <span>Checking...</span>
                          </span>
                        )}
                      </div>

                      {/* Folder destination badge with quick move dropdown */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => onSelectFolderFilter(bm.folder)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold transition"
                          title="Click to filter by this folder"
                        >
                          <Folder className="w-3 h-3 text-indigo-400" />
                          <span>{bm.folder}</span>
                        </button>

                        {/* Quick move selector */}
                        <select
                          value={bm.folder}
                          onChange={(e) => onMoveBookmarks([bm.id], e.target.value)}
                          className="opacity-0 group-hover:opacity-100 transition bg-black/60 border border-white/15 rounded-lg px-2 py-0.5 text-[10px] text-slate-300 outline-none"
                        >
                          <option disabled value={bm.folder}>Move to...</option>
                          {allFolders.map(f => (
                            <option key={f} value={f} className="bg-[#111114]">{f}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    
                    {/* Single AI Auto Tag Button */}
                    <button
                      type="button"
                      title="Auto-tag with Gemini AI"
                      disabled={isTaggingThis}
                      onClick={() => handleSingleAiTag(bm)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/20 border border-transparent hover:border-indigo-500/30 transition flex items-center gap-1 text-[10px]"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isTaggingThis ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline font-mono">AI Tag</span>
                    </button>

                    <button
                      type="button"
                      title="Copy URL"
                      onClick={() => handleCopyUrl(bm)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                    >
                      {copiedId === bm.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    
                    <a
                      href={bm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in new tab"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      title="Delete bookmark"
                      onClick={() => onDeleteBookmarks([bm.id])}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* AI Summary and Interactive Tags Row */}
                <div className="pl-9 pt-2 flex flex-col gap-2 border-t border-white/10">
                  
                  {bm.aiSummary && (
                    <p className="text-xs text-slate-300 italic flex items-center gap-1.5 line-clamp-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{bm.aiSummary}</span>
                    </p>
                  )}

                  {/* Interactive Custom Tags & Tag Adder */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {bm.tags.map((t) => (
                      <span
                        key={t}
                        className="group/tag inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-black/40 text-slate-300 border border-white/10 hover:border-indigo-500/40"
                      >
                        <button
                          onClick={() => toggleTagFilter(t)}
                          className="hover:text-indigo-300"
                          title={`Filter by #${t}`}
                        >
                          #{t}
                        </button>
                        <button
                          onClick={() => handleRemoveInlineTag(bm, t)}
                          className="opacity-0 group-hover/tag:opacity-100 hover:text-rose-400 transition"
                          title="Remove tag"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}

                    {/* Inline Tag Adder */}
                    {editingTagBmId === bm.id ? (
                      <div className="inline-flex items-center gap-1 bg-black/60 border border-indigo-500/50 rounded-lg px-2 py-0.5">
                        <input
                          type="text"
                          autoFocus
                          value={inlineTagInput}
                          onChange={(e) => setInlineTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddInlineTag(bm);
                            } else if (e.key === 'Escape') {
                              setEditingTagBmId(null);
                            }
                          }}
                          placeholder="tag name..."
                          className="bg-transparent text-white font-mono text-[10px] outline-none w-20"
                        />
                        <button
                          onClick={() => handleAddInlineTag(bm)}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingTagBmId(null)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTagBmId(bm.id);
                          setInlineTagInput('');
                        }}
                        className="opacity-60 group-hover:opacity-100 inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-dashed border-white/15 transition"
                      >
                        <Plus className="w-2.5 h-2.5" /> Tag
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Footer count info */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10 font-mono">
        <span>SHOWING {sorted.length} OF {bookmarks.length} BOOKMARKS</span>
        {currentFolderFilter && (
          <span className="font-sans">
            Folder: <strong className="text-indigo-300">{currentFolderFilter}</strong>
          </span>
        )}
      </div>

    </div>
  );
};
