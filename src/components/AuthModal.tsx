import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Crown, 
  Store, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserTier } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState(currentUser.email !== 'guest@neuralmark.ai' ? currentUser.email : 'bicknellmvp@gmail.com');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(currentUser.name !== 'Guest User' ? currentUser.name : 'Alex Vance');
  const [selectedTier, setSelectedTier] = useState<UserTier>('vip');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'user-google-' + Date.now(),
        email: email || 'bicknellmvp@gmail.com',
        name: name || 'Google User',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        tier: selectedTier,
        credits: selectedTier === 'vip' ? 250 : selectedTier === 'vendor' ? 500 : 50,
        authProvider: 'google',
        isVerifiedVendor: selectedTier === 'vendor',
        publishedPacksCount: selectedTier === 'vendor' ? 3 : 0,
        totalSales: selectedTier === 'vendor' ? 1420 : 0
      });
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'user-email-' + Date.now(),
        email,
        name: name || email.split('@')[0],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        tier: selectedTier,
        credits: selectedTier === 'vip' ? 250 : selectedTier === 'vendor' ? 500 : 50,
        authProvider: 'email',
        isVerifiedVendor: selectedTier === 'vendor',
        publishedPacksCount: selectedTier === 'vendor' ? 2 : 0,
        totalSales: selectedTier === 'vendor' ? 840 : 0
      });
      setIsLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111114] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#111114]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">NeuralMark Account</h3>
              <p className="text-[11px] text-slate-400 font-mono">SIGN IN & ROLES</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 border border-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/40 text-xs">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-3 font-semibold text-center transition ${
              tab === 'signin'
                ? 'border-b-2 border-indigo-500 text-indigo-300 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-3 font-semibold text-center transition ${
              tab === 'signup'
                ? 'border-b-2 border-indigo-500 text-indigo-300 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 text-xs">
          
          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-3 shadow-lg transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-[11px] text-slate-500 font-mono">OR WITH EMAIL</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3.5">
            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">YOUR NAME</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bicknellmvp@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">PASSWORD / MAGIC TOKEN</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Select Tier for Instant Testing */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                <span>MEMBERSHIP / ACCESS TIER</span>
                <span className="text-emerald-400 font-mono text-[10px]">ALL TIERS UNLOCKED</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTier('free')}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    selectedTier === 'free'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs">Free Tier</span>
                  <span className="text-[10px] text-slate-400">Core Sync</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTier('vip')}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    selectedTier === 'vip'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> VIP Club
                  </span>
                  <span className="text-[10px] text-amber-400/80">Private Vaults</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTier('vendor')}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    selectedTier === 'vendor'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs flex items-center gap-1">
                    <Store className="w-3 h-3 text-purple-400" /> Vendor
                  </span>
                  <span className="text-[10px] text-purple-400/80">Sell & Trade</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
            >
              <span>{isLoading ? 'Authenticating...' : tab === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Google OAuth & Cloud Sync Active
          </span>
          <span className="font-mono text-slate-500">v3.7-AI</span>
        </div>

      </div>
    </div>
  );
};
