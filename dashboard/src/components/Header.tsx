import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  Layers,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Copy,
  ArrowRight,
  Bell,
  Search,
  User as UserIcon,
  BarChart3
} from 'lucide-react';

import { User, AppView, HealthStatus } from '../types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
  user?: User | null;
  onSignOut?: () => void;
  healthStatus?: HealthStatus;
  unreadNotificationCount?: number;
  onOpenSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenCreateModal,
  onOpenAuthModal,
  user,
  onSignOut,
  healthStatus,
  unreadNotificationCount = 0,
  onOpenSearch
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onOpenSearch) onOpenSearch(searchQuery);
      onNavigate('pools');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Network Status */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <Layers size={20} />
            </div>
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent font-extrabold text-xl tracking-tight">
              PayPool
            </span>
          </div>

          {currentView !== 'landing' && (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                Base Sepolia
              </span>

              {healthStatus && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Synced #{healthStatus.lastIndexedBlock}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Search input in app views OR section nav on landing */}
        {currentView === 'landing' ? (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-400">
            <button onClick={() => scrollToSection('features')} className="hover:text-cyan-300 transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-cyan-300 transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('simulator')} className="hover:text-cyan-300 transition-colors">
              Simulator
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-cyan-300 transition-colors">
              FAQ
            </button>
          </nav>
        ) : (
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search pool by name or address 0x..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </form>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {currentView !== 'landing' && (
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          )}

          {currentView === 'landing' ? (
            user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs md:text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <span>Launch App</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs md:text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <Wallet size={16} />
                <span>Sign In / Connect</span>
              </button>
            )
          ) : (
            <>
              <button
                onClick={onOpenCreateModal}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs md:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center gap-1.5"
              >
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Create Pool</span>
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors"
                  >
                    <img
                      src={user.avatarUrl || 'https://api.dicebear.com/7.x/identicon/svg?seed=user'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full border border-cyan-400"
                    />
                    <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-2 shadow-2xl z-50 text-xs space-y-1">
                      <div className="p-2 border-b border-slate-800 mb-1">
                        <p className="font-bold text-slate-100">{user.name}</p>
                        <p className="text-[11px] text-cyan-400 capitalize">{user.role} Account</p>
                      </div>

                      <button
                        onClick={() => { setShowDropdown(false); onNavigate('profile'); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors text-left"
                      >
                        <UserIcon size={14} />
                        Profile Settings
                      </button>

                      <button
                        onClick={() => { setShowDropdown(false); onNavigate('analytics'); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors text-left"
                      >
                        <BarChart3 size={14} />
                        Analytics
                      </button>

                      {user.address && (
                        <button
                          onClick={() => handleCopyAddress(user.address!)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors text-left"
                        >
                          <span>Copy Address</span>
                          {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      )}

                      {onSignOut && (
                        <button
                          onClick={() => { setShowDropdown(false); onSignOut(); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors text-left font-semibold mt-1"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 font-medium text-xs md:text-sm flex items-center gap-1.5"
                >
                  <Wallet size={16} />
                  <span>Connect</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
