import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  ExternalLink, 
  Plus, 
  Check, 
  Sparkles, 
  Shield, 
  Terminal, 
  Globe, 
  BookOpen, 
  Download, 
  Zap, 
  Palette, 
  TrendingUp, 
  Radio, 
  Layers,
  ArrowRight,
  FolderPlus,
  Info
} from 'lucide-react';
import { TOP_SITES_DIRECTORY, TOP_SITES_CATEGORIES, TopSite } from '../data/topSitesData';
import { Bookmark } from '../types';

interface TopSitesDirectoryProps {
  onAddBookmark: (bookmark: Omit<Bookmark, 'id' | 'dateAdded'>) => void;
  existingBookmarks: Bookmark[];
  onOpenNewTab?: () => void;
}

export const TopSitesDirectory: React.FC<TopSitesDirectoryProps> = ({
  onAddBookmark,
  existingBookmarks,
  onOpenNewTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Existing URLs map for instant duplicate / already saved detection
  const existingUrls = useMemo(() => {
    return new Set(existingBookmarks.map(b => b.url.toLowerCase().replace(/\/$/, '')));
  }, [existingBookmarks]);

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'A.I. & LLMs':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'Hacking & Security':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'OSINT & Intelligence':
        return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'GitHub Top Repos':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'Message Boards':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'Q&A & Knowledge':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'Downloads & FOSS':
        return <Download className="w-4 h-4 text-rose-400" />;
      case 'Productivity':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Design & UX':
        return <Palette className="w-4 h-4 text-pink-400" />;
      case 'Crypto & Finance':
        return <TrendingUp className="w-4 h-4 text-emerald-300" />;
      case 'Media & Audio':
        return <Radio className="w-4 h-4 text-orange-400" />;
      default:
        return <Compass className="w-4 h-4 text-slate-400" />;
    }
  };

  // Filtered sites
  const filteredSites = useMemo(() => {
    return TOP_SITES_DIRECTORY.filter(site => {
      const matchesCategory = selectedCategory === 'All Categories' || site.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inName = site.name.toLowerCase().includes(q);
      const inDesc = site.description.toLowerCase().includes(q);
      const inUrl = site.url.toLowerCase().includes(q);
      const inTags = site.tags.some(t => t.toLowerCase().includes(q));
      const inSimilar = site.similarSites.some(s => s.toLowerCase().includes(q));

      return inName || inDesc || inUrl || inTags || inSimilar;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddSite = (site: TopSite) => {
    onAddBookmark({
      title: site.name,
      url: site.url,
      folder: site.suggestedFolder,
      tags: site.tags,
      aiSummary: site.description,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`,
      status: 'synced',
      linkHealth: 'healthy'
    });

    setAddedIds(prev => new Set(prev).add(site.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(site.id);
        return next;
      });
    }, 2500);
  };

  const handleAddAllInCategory = () => {
    const unadded = filteredSites.filter(site => {
      const cleanUrl = site.url.toLowerCase().replace(/\/$/, '');
      return !existingUrls.has(cleanUrl);
    });

    if (unadded.length === 0) return;

    unadded.forEach(site => {
      onAddBookmark({
        title: site.name,
        url: site.url,
        folder: site.suggestedFolder,
        tags: site.tags,
        aiSummary: site.description,
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`,
        status: 'synced',
        linkHealth: 'healthy'
      });
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-600/10 via-purple-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Top 100+ Curated Web Hub
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {TOP_SITES_DIRECTORY.length} Hand-Picked Sites
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Discover the best tools across <strong>A.I., Hacking, OSINT, GitHub Repos, Message Boards, Q&A, and FOSS</strong>. One-click save to your AI folders with pre-populated tags.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenNewTab && (
              <button
                onClick={onOpenNewTab}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 flex items-center gap-2 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Home Screen</span>
              </button>
            )}
            <button
              onClick={handleAddAllInCategory}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Import Category ({filteredSites.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col gap-4 bg-[#101014] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl">
        
        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search top sites by name, category, tags, or technology (e.g. 'osint', 'chatgpt', 'cve', 'react', 'crypto')..."
            className="w-full bg-[#16161c] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {TOP_SITES_CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;
            const count = category === 'All Categories' 
              ? TOP_SITES_DIRECTORY.length 
              : TOP_SITES_DIRECTORY.filter(s => s.category === category).length;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-black/30 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Top Sites */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map(site => {
          const cleanUrl = site.url.toLowerCase().replace(/\/$/, '');
          const isAlreadySaved = existingUrls.has(cleanUrl);
          const wasJustAdded = addedIds.has(site.id);

          return (
            <div
              key={site.id}
              className="p-5 rounded-3xl bg-[#101014] border border-white/10 hover:border-indigo-500/40 hover:bg-[#14141a] transition-all flex flex-col justify-between gap-4 group shadow-lg"
            >
              <div className="flex flex-col gap-3">
                
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition overflow-hidden">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`}
                        alt={site.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition">
                          {site.name}
                        </h4>
                        {site.badge && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {site.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        {getCategoryIcon(site.category)}
                        <span>{site.category}</span>
                      </span>
                    </div>
                  </div>

                  <a
                    href={site.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0"
                    title="Launch website in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {site.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {site.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-indigo-300 text-[10px] font-mono transition"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Similar sites */}
                {site.similarSites.length > 0 && (
                  <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Similar:</span>
                    {site.similarSites.map(similar => (
                      <button
                        key={similar}
                        onClick={() => setSearchQuery(similar)}
                        className="text-indigo-400 hover:underline hover:text-indigo-300 font-medium text-[11px]"
                      >
                        {similar}
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* Card Footer: Folder destination + Quick Add Button */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px] sm:max-w-[180px]">
                  📁 {site.suggestedFolder}
                </div>

                <button
                  onClick={() => handleAddSite(site)}
                  disabled={wasJustAdded}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                    wasJustAdded
                      ? 'bg-emerald-600 text-white'
                      : isAlreadySaved
                        ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  }`}
                >
                  {wasJustAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Added!</span>
                    </>
                  ) : isAlreadySaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Bookmark</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredSites.length === 0 && (
        <div className="py-16 text-center bg-[#101014] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
          <Search className="w-10 h-10 text-slate-600" />
          <h4 className="text-base font-bold text-white">No Sites Matched "{searchQuery}"</h4>
          <p className="text-xs text-slate-400">
            Try adjusting your search keywords or select "All Categories".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
