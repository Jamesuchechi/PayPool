import React from 'react';
import { TrendingUp, Cpu, Zap } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>📈</span>
            <span>Protocol Analytics & Insights</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time protocol metrics, EIP-1167 minimal proxy gas savings benchmarks, and revenue flows.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Zap size={14} />
          <span>EIP-1167 Active</span>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold">Total Volume Split</p>
          <p className="text-2xl font-bold text-cyan-400 font-mono">154.8 ETH</p>
          <p className="text-[11px] text-slate-500">$418,200 USD equivalent</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold">Active Splitter Contracts</p>
          <p className="text-2xl font-bold text-slate-100 font-mono">14 Pools</p>
          <p className="text-[11px] text-slate-500">Across 42 payees</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold">Gas Saved vs Standard</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono">63.1% Saved</p>
          <p className="text-[11px] text-emerald-500/80">394k gas vs 1.06M gas</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-semibold">Avg Claim Latency</p>
          <p className="text-2xl font-bold text-blue-400 font-mono">&lt; 2.4s</p>
          <p className="text-[11px] text-slate-500">Base Sepolia block time</p>
        </div>
      </div>

      {/* Analytics Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gas Savings Benchmark Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Cpu size={18} className="text-cyan-400" />
              EIP-1167 Minimal Proxy Gas Benchmark
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
              63% Savings
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Foundry benchmark measuring deployment gas cost of full contract code vs lightweight EIP-1167 clone proxies.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Full Contract Deployment</span>
                <span className="font-mono text-slate-400">1,067,166 gas</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span className="text-cyan-300 font-bold">EIP-1167 Clone Deployment (PayPool)</span>
                <span className="font-mono text-cyan-400 font-bold">394,232 gas</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-[37%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Distribution */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-400" />
              Volume Asset Distribution
            </h2>
            <span className="text-xs text-slate-400 font-mono">Total: 154.8 ETH</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  ETH
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Native Ethereum</p>
                  <p className="text-[10px] text-slate-500">72.4% protocol share</p>
                </div>
              </div>
              <p className="text-sm font-bold text-cyan-400 font-mono">112.07 ETH</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  USDC
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">USD Coin (ERC-20)</p>
                  <p className="text-[10px] text-slate-500">21.6% protocol share</p>
                </div>
              </div>
              <p className="text-sm font-bold text-blue-400 font-mono">$90,300</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
