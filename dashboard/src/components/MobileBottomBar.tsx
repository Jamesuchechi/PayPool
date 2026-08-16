import React from 'react';
import { AppView } from '../types';

interface MobileBottomBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCreateModal: () => void;
  unreadNotificationCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentView,
  onNavigate,
  onOpenCreateModal,
  unreadNotificationCount
}) => {
  const items = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: '📊' },
    { id: 'pools' as AppView, label: 'Pools', icon: '🏊' },
    { id: 'create' as const, label: 'Deploy', icon: '➕', isCreate: true },
    { id: 'my-earnings' as AppView, label: 'Earnings', icon: '💰' },
    { id: 'profile' as AppView, label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        if ('isCreate' in item && item.isCreate) {
          return (
            <button
              key="create-btn"
              onClick={onOpenCreateModal}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-cyan-500/40 border-2 border-slate-900 active:scale-95 transition-transform">
                ＋
              </div>
              <span className="text-[10px] font-medium text-cyan-400 mt-1">Deploy</span>
            </button>
          );
        }

        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as AppView)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-lg relative">
              {item.icon}
              {item.id === 'notifications' && unreadNotificationCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              ) : null}
            </span>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
