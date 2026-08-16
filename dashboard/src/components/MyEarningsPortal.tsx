import React, { useState } from 'react';
import { Pool } from '../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface MyEarningsPortalProps {
  pools: Pool[];
  userAddress?: string;
  onSelectPool: (poolAddress: string) => void;
}

export const MyEarningsPortal: React.FC<MyEarningsPortalProps> = ({
  pools,
  userAddress = '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41',
  onSelectPool
}) => {
  const [claimedPools, setClaimedPools] = useState<Record<string, boolean>>({});
  const [claimingAll, setClaimingAll] = useState(false);

  // Compute payee earnings across all pools
  const payeePools = pools.filter((pool) =>
    pool.payees.some((p) => p.address.toLowerCase() === userAddress.toLowerCase())
  );

  let totalPendingETH = 0;
  let totalReleasedETH = 0;

  payeePools.forEach((pool) => {
    const p = pool.payees.find((payee) => payee.address.toLowerCase() === userAddress.toLowerCase());
    if (p) {
      const shareRatio = p.shares / 10000;
      const totalRec = parseFloat(pool.totalReceivedETH || '0');
      const earned = totalRec * shareRatio;
      if (claimedPools[pool.address]) {
        totalReleasedETH += earned;
      } else {
        totalPendingETH += earned * 0.8;
        totalReleasedETH += earned * 0.2;
      }
    }
  });

  const handleClaimSingle = (poolAddr: string) => {
    setClaimedPools((prev) => ({ ...prev, [poolAddr]: true }));
  };

  const handleClaimAll = () => {
    setClaimingAll(true);
    setTimeout(() => {
      const updated: Record<string, boolean> = {};
      payeePools.forEach((p) => { updated[p.address] = true; });
      setClaimedPools(updated);
      setClaimingAll(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/20 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Aggregated Claim Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-2 flex items-center gap-2">
            <span>💰</span>
            <span>My Claimable Revenue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Aggregated earnings across all revenue splitters where your wallet is a registered payee.
          </p>
        </div>

        {/* Claim All CTA */}
        <div className="bg-slate-950/60 border border-cyan-500/30 p-4 rounded-2xl shrink-0 flex flex-col sm:flex-row items-center gap-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Claimable</p>
            <p className="text-xl font-bold text-cyan-400 font-mono">
              {claimingAll ? '0.00 ETH' : `${totalPendingETH.toFixed(3)} ETH`}
            </p>
          </div>
          <button
            onClick={handleClaimAll}
            disabled={claimingAll || totalPendingETH === 0}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            <span>{claimingAll ? 'Claiming All...' : '1-Click Batch Claim'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total Revenue Earned</p>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {(totalPendingETH + totalReleasedETH).toFixed(3)} ETH
          </p>
          <p className="text-[11px] text-slate-500">Across {payeePools.length} revenue pools</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total Already Claimed</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            {totalReleasedETH.toFixed(3)} ETH
          </p>
          <p className="text-[11px] text-emerald-500/80 flex items-center gap-1">
            <ShieldCheck size={12} />
            Successfully transferred to wallet
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Connected Wallet</p>
          <p className="text-xs font-mono font-bold text-cyan-300 truncate mt-1">
            {userAddress}
          </p>
          <p className="text-[11px] text-slate-500">Base Sepolia Testnet</p>
        </div>
      </div>

      {/* Payee Pools Breakdown Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-lg font-bold text-slate-100">Per-Pool Earnings Breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Pool Name</th>
                <th className="py-3 px-4">Your Share</th>
                <th className="py-3 px-4">Total Pool Volume</th>
                <th className="py-3 px-4">Claimable Pending</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
              {payeePools.map((pool) => {
                const payee = pool.payees.find((p) => p.address.toLowerCase() === userAddress.toLowerCase());
                const shareBps = payee ? payee.shares : 0;
                const sharePct = (shareBps / 100).toFixed(1);
                const totalRec = parseFloat(pool.totalReceivedETH || '0');
                const isClaimed = claimedPools[pool.address];
                const pending = isClaimed ? 0 : totalRec * (shareBps / 10000) * 0.8;

                return (
                  <tr key={pool.address} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-sans font-bold">
                      <div
                        onClick={() => onSelectPool(pool.address)}
                        className="hover:text-cyan-300 cursor-pointer flex items-center gap-2"
                      >
                        <span>{pool.name}</span>
                        <ArrowRight size={12} className="text-slate-500" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block font-normal">
                        {pool.address.slice(0, 8)}...{pool.address.slice(-6)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-cyan-400 font-bold">
                      {sharePct}% ({shareBps} BPS)
                    </td>
                    <td className="py-4 px-4">{pool.totalReceivedETH} ETH</td>
                    <td className="py-4 px-4 font-bold text-cyan-300">
                      {pending.toFixed(3)} ETH
                    </td>
                    <td className="py-4 px-4 text-right font-sans">
                      {isClaimed || pending === 0 ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 size={12} /> Claimed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClaimSingle(pool.address)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
                        >
                          Release ({pending.toFixed(2)} ETH)
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
