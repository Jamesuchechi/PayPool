import React from 'react';
import { Pool, AppView } from '../types';
import { PlusCircle, Coins, ArrowRight, Layers } from 'lucide-react';

interface OverviewDashboardProps {
  pools: Pool[];
  onSelectPool: (poolAddress: string) => void;
  onOpenCreateModal: () => void;
  onNavigate: (view: AppView) => void;
  userName?: string;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  pools,
  onSelectPool,
  onOpenCreateModal,
  onNavigate,
  userName = 'Creator'
}) => {
  const totalVolumeETH = pools.reduce((acc, p) => acc + parseFloat(p.totalReceivedETH || '0'), 0);

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Protocol Workspace
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-2">
            Welcome back, <span className="gradient-text">{userName}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Manage your autonomous EIP-1167 revenue splitters, track incoming ETH/ERC20 flows, and release earnings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('my-earnings')}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Coins size={16} className="text-cyan-400" />
            <span>My Earnings</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Deploy Pool</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold">Total Revenue Split</p>
          <p className="text-2xl font-bold text-cyan-400 font-mono">{totalVolumeETH.toFixed(1)} ETH</p>
          <p className="text-[11px] text-slate-500">Across all deployed pools</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold">Active Splitter Contracts</p>
          <p className="text-2xl font-bold text-slate-100 font-mono">{pools.length} Pools</p>
          <p className="text-[11px] text-slate-500">EIP-1167 Minimal Proxies</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold">Deployment Gas Savings</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono">63.1% Saved</p>
          <p className="text-[11px] text-emerald-500/80">394k vs 1.06M gas benchmark</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold">Estimated Claimable</p>
          <p className="text-2xl font-bold text-cyan-300 font-mono">4.2 ETH</p>
          <p className="text-[11px] text-cyan-400/80">Ready for 1-click batch release</p>
        </div>
      </div>

      {/* Pools Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers size={18} className="text-cyan-400" />
            <span>Active Revenue Splitters</span>
          </h2>
          <button
            onClick={() => onNavigate('pools')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Pools</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pools.map((pool) => (
            <div
              key={pool.address}
              onClick={() => onSelectPool(pool.address)}
              className="group bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-3xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-950/40 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg group-hover:text-cyan-300 transition-colors">
                      {pool.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{pool.address}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono">
                    {pool.totalReceivedETH} ETH
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Payees</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{pool.payees.length} Members</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Basis Points</p>
                    <p className="text-xs font-bold text-cyan-400 mt-0.5">10,000 BPS (100%)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                <span className="text-[11px] text-slate-500">Created on Base Sepolia</span>
                <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Open Workspace →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
