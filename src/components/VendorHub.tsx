import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Plus, 
  ShieldCheck, 
  Star, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  BarChart3, 
  Layers, 
  Sparkles,
  Users,
  Settings,
  X
} from 'lucide-react';
import { UserProfile, MarketplacePack, Bookmark } from '../types';

interface VendorHubProps {
  currentUser: UserProfile;
  onUpgradeToVendor: () => void;
  userBookmarks: Bookmark[];
  onOpenMarketplace: () => void;
  onPublishPack: (pack: MarketplacePack) => void;
}

export const VendorHub: React.FC<VendorHubProps> = ({
  currentUser,
  onUpgradeToVendor,
  userBookmarks,
  onOpenMarketplace,
  onPublishPack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'analytics' | 'payouts'>('overview');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [vendorBio, setVendorBio] = useState('Senior Full-Stack Architect & AI Researcher creating production-grade bookmark taxonomies.');
  const [vendorSpecialty, setVendorSpecialty] = useState('AI & Web Development');
  const [isVerified, setIsVerified] = useState(currentUser.tier === 'vendor');

  const myPacks: MarketplacePack[] = [
    {
      id: 'vendor-p1',
      title: 'Full-Stack Modern Dev Stack 2026',
      description: 'The definitive development pack: React 19, Tailwind v4, Vite, Cloud Run, serverless databases.',
      category: 'Development',
      price: 4.99,
      currency: 'USD',
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTier: 'vendor',
      rating: 4.9,
      reviewsCount: 48,
      clonesCount: 1420,
      bookmarksCount: 5,
      tags: ['react', 'typescript', 'vite', 'fullstack'],
      createdAt: '2026-05-10',
      verified: true,
      bookmarks: userBookmarks.slice(0, 5)
    },
    {
      id: 'vendor-p2',
      title: 'Bento UI & High-End Design Systems',
      description: 'Typography scales, micro-interactions, dark aesthetic references, and CSS glow effects.',
      category: 'Design & UI',
      price: 0,
      currency: 'USD',
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTier: 'vendor',
      rating: 5.0,
      reviewsCount: 32,
      clonesCount: 980,
      bookmarksCount: 4,
      tags: ['bento', 'design', 'ui', 'inspiration'],
      createdAt: '2026-06-01',
      verified: true,
      bookmarks: userBookmarks.slice(5, 9)
    }
  ];

  const handleApplyVendor = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerified(true);
    onUpgradeToVendor();
    setIsApplyModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Header Bento Banner */}
      <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white">Vendor & Curator Studio</h2>
                {isVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> VERIFIED VENDOR
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    CREATOR APPLICATION OPEN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                Monetize your expertise by publishing curated bookmark packs, developer toolkits, and research collections to thousands of developers worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {!isVerified ? (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-5 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Become a Verified Vendor</span>
              </button>
            ) : (
              <button
                onClick={onOpenMarketplace}
                className="px-5 py-3 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                <Store className="w-4 h-4" />
                <span>View in Marketplace</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">TOTAL REVENUE (USD)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">$1,420.85</h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this month
            </p>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">TOTAL CLONES / SALES</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">2,400</h3>
            <p className="text-[11px] text-indigo-300 font-mono mt-1">Across 2 live vaults</p>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">AVERAGE RATING</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">4.95 / 5.0</h3>
            <p className="text-[11px] text-amber-300 font-mono mt-1">80 verified reviews</p>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">CURATOR TIER</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-300 font-mono">Tier 1 Pro</h3>
            <p className="text-[11px] text-purple-400 font-mono mt-1">85% Revenue Share Active</p>
          </div>
        </div>

      </div>

      {/* Published Listings Section */}
      <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Your Published Bookmark Vaults</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage live packs, toggle pricing, or push instant updates to subscribers.</p>
          </div>
          <button
            onClick={onOpenMarketplace}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Pack</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {myPacks.map(pack => (
            <div
              key={pack.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{pack.title}</h4>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/10 text-slate-300">
                      {pack.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pack.description}</p>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] mt-2">
                    <span className="text-emerald-400 font-bold">
                      {pack.price === 0 ? 'Free' : `$${pack.price}`}
                    </span>
                    <span>• {pack.clonesCount} Clones</span>
                    <span>• {pack.bookmarksCount} Bookmarks</span>
                    <span>• Rating {pack.rating} ★</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition">
                  Edit Details
                </button>
                <button className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition">
                  Update Links
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#111114]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Verified Vendor Application</h3>
                  <p className="text-[11px] text-slate-400 font-mono">INSTANT APPROVAL DEMO</p>
                </div>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)} 
                className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 border border-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyVendor} className="p-6 flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">CURATION DOMAIN / SPECIALTY</label>
                <input
                  type="text"
                  required
                  value={vendorSpecialty}
                  onChange={(e) => setVendorSpecialty(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">CREATOR BIO & CREDENTIALS</label>
                <textarea
                  rows={3}
                  value={vendorBio}
                  onChange={(e) => setVendorBio(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-purple-200 text-[11px] leading-relaxed">
                <span className="font-bold flex items-center gap-1 text-purple-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Vendor Terms:
                </span>
                85% of revenue deposited directly via Stripe or Crypto rails. No listing fees.
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Activate Verified Vendor Status</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
