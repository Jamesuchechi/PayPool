import React, { useState } from 'react';
import { Pool, AppView } from '../types';
import { Search, PlusCircle, ArrowUpRight } from 'lucide-react';

interface PoolsDirectoryProps {
  pools: Pool[];
  onSelectPool: (poolAddress: string) => void;
  onOpenCreateModal: () => void;
  onNavigate: (view: AppView) => void;
  userAddress?: string;
}

export const PoolsDirectory: React.FC<PoolsDirectoryProps> = ({
  pools,
  onSelectPool,
  onOpenCreateModal,
  userAddress
}) => {
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'created' | 'payee'>('all');

  const filteredPools = pools.filter((pool) => {
    const matchesSearch =
      pool.name.toLowerCase().includes(search.toLowerCase()) ||
      pool.address.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'created') return userAddress && pool.creator.toLowerCase() === userAddress.toLowerCase();
    if (filterTab === 'payee') {
      return (
        userAddress &&
        pool.payees.some((p) => p.address.toLowerCase() === userAddress.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>🏊</span>
            <span>Live Revenue Pools</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore and inspect all autonomous EIP-1167 revenue splitters deployed on Base Sepolia.
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <PlusCircle size={18} />
          <span>Deploy New Pool</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center p-1 bg-slate-900/80 border border-slate-800 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Pools ({pools.length})
          </button>
          <button
            onClick={() => setFilterTab('created')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'created'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Created By Me
          </button>
          <button
            onClick={() => setFilterTab('payee')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'payee'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Payee Pools
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Pools Grid */}
      {filteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPools.map((pool) => (
            <div
              key={pool.address}
              onClick={() => onSelectPool(pool.address)}
              className="group bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-950/40 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                      {pool.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500">
                      {pool.address.slice(0, 8)}...{pool.address.slice(-6)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 flex items-center justify-center transition-colors shrink-0">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Revenue</p>
                    <p className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                      {pool.totalReceivedETH} ETH
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Payees</p>
                    <p className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                      {pool.payees.length} Members
                    </p>
                  </div>
                </div>
              </div>

              {/* Payees avatars */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                <div className="flex -space-x-2 overflow-hidden">
                  {pool.payees.slice(0, 4).map((p, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white"
                      title={`${p.address} (${(p.shares / 100).toFixed(1)}%)`}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-cyan-400 font-medium">View Workspace →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-3xl mx-auto text-slate-500">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-200">No pools found matching your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or create a brand new revenue splitter contract.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
          >
            Deploy New Pool
          </button>
        </div>
      )}
    </div>
  );
};
