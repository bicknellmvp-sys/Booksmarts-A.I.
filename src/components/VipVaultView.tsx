import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Lock, 
  Unlock, 
  Download, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  Star, 
  Zap, 
  RefreshCw, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { MarketplacePack, Bookmark, UserProfile } from '../types';
import { VIP_EXCLUSIVE_VAULTS } from '../data/marketplaceData';

interface VipVaultViewProps {
  currentUser: UserProfile;
  onUpgradeToVip: () => void;
  onImportPack: (pack: MarketplacePack) => void;
}

export const VipVaultView: React.FC<VipVaultViewProps> = ({
  currentUser,
  onUpgradeToVip,
  onImportPack
}) => {
  const isVip = currentUser.tier === 'vip' || currentUser.tier === 'vendor';
  const [clonedVaultIds, setClonedVaultIds] = useState<string[]>([]);
  const [activeSync, setActiveSync] = useState(true);

  const handleCloneVault = (pack: MarketplacePack) => {
    onImportPack(pack);
    setClonedVaultIds(prev => [...prev, pack.id]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Hero Banner Bento Card */}
      <div className="bg-[#111114] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white">Private VIP Subscriber Vault</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> RESTRICTED SUBSCRIBER AREA
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                Exclusive high-signal bookmark archives curated directly by senior staff architects, VC partners, and AI researchers. Auto-syncs weekly with fresh links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {!isVip ? (
              <button
                onClick={onUpgradeToVip}
                className="px-6 py-3 rounded-2xl font-bold text-xs text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/30 flex items-center gap-2 transition"
              >
                <Crown className="w-4 h-4" />
                <span>Unlock VIP Vaults (Instant Demo)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-2xl text-amber-200 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>PRO SUBSCRIBER ACTIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIP Perks Bar Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-5 shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Live Link Intelligence</h4>
            <p className="text-[11px] text-slate-400">Weekly automated link additions and AI summary refresh.</p>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/10 rounded-3xl p-5 shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Broken Link Auto-Healer</h4>
            <p className="text-[11px] text-slate-400">Gemini 3.7 automatically detects 404s and updates redirects.</p>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/10 rounded-3xl p-5 shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Unlimited Vault Exports</h4>
            <p className="text-[11px] text-slate-400">Export Netscape HTML, JSON, Markdown, and custom feeds.</p>
          </div>
        </div>
      </div>

      {/* VIP Vaults List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {VIP_EXCLUSIVE_VAULTS.map(vault => {
          const isCloned = clonedVaultIds.includes(vault.id);
          return (
            <div
              key={vault.id}
              className={`bg-[#111114] border rounded-3xl p-6 shadow-2xl flex flex-col justify-between gap-6 transition ${
                isVip ? 'border-amber-500/30' : 'border-white/10 opacity-90'
              }`}
            >
              <div className="flex flex-col gap-4">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Crown className="w-3 h-3" /> VIP EXCLUSIVE
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/5 text-slate-400 border border-white/5">
                      {vault.bookmarks.length} Curated Links
                    </span>
                  </div>

                  {isVip ? (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" /> UNLOCKED
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> SUBSCRIBER ONLY
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{vault.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{vault.description}</p>
                </div>

                {/* Bookmarks Preview */}
                <div className="flex flex-col gap-2 bg-black/40 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Included VIP Bookmarks
                  </span>
                  {vault.bookmarks.slice(0, 3).map(bm => (
                    <div key={bm.id} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                      <span className="text-slate-200 truncate font-medium">{bm.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                        {isVip ? bm.folder.split('/').pop() : '•••••••'}
                      </span>
                    </div>
                  ))}
                  {vault.bookmarks.length > 3 && (
                    <span className="text-[10px] text-amber-400 font-mono">
                      +{vault.bookmarks.length - 3} more confidential resources inside
                    </span>
                  )}
                </div>

              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-amber-300 font-bold">5.0</span>
                  <span>({vault.reviewsCount} reviews)</span>
                </div>

                {isVip ? (
                  <button
                    onClick={() => handleCloneVault(vault)}
                    disabled={isCloned}
                    className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition ${
                      isCloned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20'
                    }`}
                  >
                    {isCloned ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Cloned to My Bookmarks</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Clone VIP Vault (1-Click)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={onUpgradeToVip}
                    className="px-5 py-2.5 rounded-2xl font-bold text-xs text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 flex items-center gap-2 transition"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Subscribe to Unlock</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
