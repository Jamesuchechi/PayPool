import React from 'react';
import { AppNotification } from '../types';
import { Bell, ArrowDownRight, ArrowUpRight, Layers } from 'lucide-react';

interface NotificationsCenterProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onSelectPool?: (poolAddress: string) => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  notifications,
  onMarkAllRead,
  onSelectPool
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Notifications & Activity Feed</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time alerts for incoming deposits, payout releases, and contract deployments.
            </p>
          </div>
        </div>

        <button
          onClick={onMarkAllRead}
          className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/50 transition-colors"
        >
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => n.poolAddress && onSelectPool && onSelectPool(n.poolAddress)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                !n.read
                  ? 'bg-slate-800/60 border-cyan-500/30 shadow-md shadow-cyan-950/20'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-80'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'deposit'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : n.type === 'withdrawal'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {n.type === 'deposit' ? (
                  <ArrowDownRight size={18} />
                ) : n.type === 'withdrawal' ? (
                  <ArrowUpRight size={18} />
                ) : (
                  <Layers size={18} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-100 text-sm">{n.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                {n.txHash && (
                  <p className="text-[10px] font-mono text-cyan-400 mt-1">
                    Tx: {n.txHash.slice(0, 12)}...
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 space-y-2">
            <p className="text-slate-400 text-sm">No notifications available</p>
          </div>
        )}
      </div>
    </div>
  );
};
