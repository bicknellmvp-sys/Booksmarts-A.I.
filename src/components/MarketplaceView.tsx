import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Sparkles, 
  Download, 
  Check, 
  Star, 
  Users, 
  ExternalLink, 
  Tag, 
  Plus, 
  Filter, 
  Crown, 
  Eye, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FolderTree,
  DollarSign,
  X
} from 'lucide-react';
import { MarketplacePack, Bookmark, UserProfile } from '../types';
import { INITIAL_MARKETPLACE_PACKS } from '../data/marketplaceData';

interface MarketplaceViewProps {
  currentUser: UserProfile;
  onImportPack: (pack: MarketplacePack) => void;
  onOpenVendorHub: () => void;
  onOpenVipVault: () => void;
  userBookmarks: Bookmark[];
  onPublishUserPack: (newPack: MarketplacePack) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  currentUser,
  onImportPack,
  onOpenVendorHub,
  onOpenVipVault,
  userBookmarks,
  onPublishUserPack
}) => {
  const [packs, setPacks] = useState<MarketplacePack[]>(INITIAL_MARKETPLACE_PACKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewPack, setPreviewPack] = useState<MarketplacePack | null>(null);
  const [clonedPackIds, setClonedPackIds] = useState<string[]>([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Publish Form State
  const [packTitle, setPackTitle] = useState('');
  const [packDesc, setPackDesc] = useState('');
  const [packCat, setPackCat] = useState('Development');
  const [packPrice, setPackPrice] = useState('0');
  const [packTags, setPackTags] = useState('dev, curated, tools');

  const categories = ['All', 'Artificial Intelligence', 'Development', 'Design & UI', 'Startup & VC', 'Security'];

  const filteredPacks = packs.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.author.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleClone = (pack: MarketplacePack) => {
    onImportPack(pack);
    setClonedPackIds(prev => [...prev, pack.id]);
    // update clones count
    setPacks(prev => prev.map(p => p.id === pack.id ? { ...p, clonesCount: p.clonesCount + 1 } : p));
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packTitle) return;

    const newPack: MarketplacePack = {
      id: 'pack-user-' + Date.now(),
      title: packTitle,
      description: packDesc || 'Curated bookmark vault created on NeuralMark.',
      category: packCat,
      price: parseFloat(packPrice) || 0,
      currency: 'USD',
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTier: currentUser.tier,
      rating: 5.0,
      reviewsCount: 1,
      clonesCount: 0,
      bookmarksCount: userBookmarks.slice(0, 8).length,
      bookmarks: userBookmarks.slice(0, 8),
      tags: packTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      featured: true,
      verified: currentUser.tier === 'vendor',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPacks([newPack, ...packs]);
    onPublishUserPack(newPack);
    setIsPublishModalOpen(false);
    setPackTitle('');
    setPackDesc('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Hero Banner Bento Card */}
      <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white">Bookmark Bazaar & Marketplace</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  PAID FEATURE (FREE FOR NOW PREVIEW)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                Discover, clone, trade, and publish verified expert bookmark vaults. Curated directories from top AI engineers, YC founders, principal architects, and designers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-5 py-3 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Publish / Trade a Pack</span>
            </button>
            <button
              onClick={onOpenVendorHub}
              className="px-5 py-3 rounded-2xl font-bold text-xs text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Vendor Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Bento */}
      <div className="bg-[#111114] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packs, tags, creators..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPacks.map(pack => {
          const isCloned = clonedPackIds.includes(pack.id);
          return (
            <div
              key={pack.id}
              className="bg-[#111114] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5 hover:border-indigo-500/40 transition group"
            >
              <div className="flex flex-col gap-3.5">
                
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-white/5 text-indigo-300 border border-white/10">
                    {pack.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {pack.price === 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Free
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] line-through text-slate-500">${pack.price}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Free Preview
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                    {pack.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {pack.description}
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                  {pack.authorAvatar ? (
                    <img
                      src={pack.authorAvatar}
                      alt={pack.author}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                      {pack.author[0]}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-300">{pack.author}</span>
                    {pack.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" title="Verified Creator" />
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {pack.tags.slice(0, 4).map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-lg bg-black/40 text-slate-400 text-[10px] font-mono border border-white/5"
                    >
                      #{t}
                    </span>
                  ))}
                  {pack.tags.length > 4 && (
                    <span className="text-[10px] text-slate-500 font-mono">+{pack.tags.length - 4}</span>
                  )}
                </div>

              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {pack.rating}
                  </span>
                  <span>{pack.clonesCount} Clones</span>
                  <span>{pack.bookmarksCount} Links</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewPack(pack)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
                    title="Preview Bookmarks"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleClone(pack)}
                    disabled={isCloned}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isCloned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    }`}
                  >
                    {isCloned ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Cloned</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Clone Pack</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Preview Pack Modal */}
      {previewPack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#111114]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{previewPack.title}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    BY {previewPack.author.toUpperCase()} • {previewPack.bookmarks.length} CURATED BOOKMARKS
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewPack(null)} 
                className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 border border-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of bookmarks */}
            <div className="p-6 overflow-y-auto max-h-[60vh] flex flex-col gap-3">
              <p className="text-xs text-slate-300 leading-relaxed italic bg-white/5 p-3 rounded-2xl border border-white/10">
                "{previewPack.description}"
              </p>

              <div className="flex flex-col gap-2.5 mt-2">
                {previewPack.bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white truncate">{bm.title}</h4>
                      <a
                        href={bm.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0 font-mono text-[10px]"
                      >
                        <ExternalLink className="w-3 h-3" /> Visit
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{bm.url}</p>
                    {bm.aiSummary && (
                      <p className="text-slate-300 text-[11px] mt-0.5">{bm.aiSummary}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                        {bm.folder}
                      </span>
                      {bm.tags.map(t => (
                        <span key={t} className="text-[10px] text-slate-400 font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#111114] flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-mono font-bold">
                FREE PREVIEW UNLOCKED
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewPack(null)}
                  className="px-4 py-2 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleClone(previewPack);
                    setPreviewPack(null);
                  }}
                  className="px-6 py-2.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Clone All {previewPack.bookmarks.length} Bookmarks</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#111114]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Publish / Trade Bookmark Pack</h3>
                  <p className="text-[11px] text-slate-400 font-mono">SHARE WITH NEURALMARK COMMUNITY</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPublishModalOpen(false)} 
                className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 border border-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="p-6 flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">PACK TITLE</label>
                <input
                  type="text"
                  required
                  value={packTitle}
                  onChange={(e) => setPackTitle(e.target.value)}
                  placeholder="e.g. Master React 19 Ecosystem Kit"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={packDesc}
                  onChange={(e) => setPackDesc(e.target.value)}
                  placeholder="Briefly describe what makes this curation valuable..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">CATEGORY</label>
                  <select
                    value={packCat}
                    onChange={(e) => setPackCat(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Development">Development</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Design & UI">Design & UI</option>
                    <option value="Startup & VC">Startup & VC</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">LISTING PRICE ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.99"
                    value={packPrice}
                    onChange={(e) => setPackPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={packTags}
                  onChange={(e) => setPackTags(e.target.value)}
                  placeholder="react, css, frontend, docs"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-[11px]">
                Attaching <strong className="text-white font-mono">{userBookmarks.slice(0, 8).length}</strong> bookmarks from your current library to this pack.
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Publish to Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
