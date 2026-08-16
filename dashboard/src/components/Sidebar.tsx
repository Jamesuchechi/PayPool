import React from 'react';
import { AppView, User } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCreateModal: () => void;
  user: User | null;
  unreadNotificationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenCreateModal,
  user,
  unreadNotificationCount
}) => {
  const navItems: { id: AppView; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pools', label: 'Revenue Pools', icon: '🏊' },
    { id: 'my-earnings', label: 'My Earnings', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', badge: unreadNotificationCount },
    { id: 'profile', label: 'Profile & Settings', icon: '⚙️' },
    { id: 'public-pay', label: 'Pay Gateway', icon: '🔗' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-xl shrink-0 min-h-[calc(100vh-4rem)] select-none">
      {/* User Quick Info */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 text-sm">
            {user ? user.name.charAt(0).toUpperCase() : 'W'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {user ? user.name : 'Web3 Visitor'}
            </p>
            <p className="text-xs text-cyan-400 capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              {user ? user.role : 'Guest Mode'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Protocol Navigation
        </p>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-cyan-500 text-slate-950">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Quick Action & Claim Widget */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 space-y-3">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5">
          <div className="flex justify-between items-center text-slate-400 font-medium">
            <span>Estimated Claimable</span>
            <span className="text-cyan-400 font-mono font-bold">4.2 ETH</span>
          </div>
          <p className="text-[11px] text-slate-500">Across 2 active revenue splitters</p>
          <button
            onClick={() => onNavigate('my-earnings')}
            className="w-full mt-1.5 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold transition-colors text-center block text-xs"
          >
            Claim All Earnings →
          </button>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center space-x-2"
        >
          <span>＋</span>
          <span>Deploy Revenue Pool</span>
        </button>
      </div>
    </aside>
  );
};
