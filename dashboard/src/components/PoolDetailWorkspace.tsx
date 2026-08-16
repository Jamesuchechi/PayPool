import React, { useState } from 'react';
import { Pool } from '../types';
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, QrCode, ShieldCheck } from 'lucide-react';

interface PoolDetailWorkspaceProps {
  pool: Pool;
  onBack: () => void;
  onOpenPublicPay: (poolAddress: string) => void;
}

export const PoolDetailWorkspace: React.FC<PoolDetailWorkspaceProps> = ({
  pool,
  onBack,
  onOpenPublicPay
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposits' | 'withdrawals' | 'qr'>('overview');
  const [copied, setCopied] = useState(false);
  const [releasingPayee, setReleasingPayee] = useState<string | null>(null);
  const [releasedPayees, setReleasedPayees] = useState<Record<string, boolean>>({});

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(pool.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRelease = (payeeAddr: string) => {
    setReleasingPayee(payeeAddr);
    setTimeout(() => {
      setReleasingPayee(null);
      setReleasedPayees((prev) => ({ ...prev, [payeeAddr]: true }));
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Pools Directory</span>
      </button>

      {/* Pool Workspace Header Card */}
      <div className="bg-slate-900/70 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                EIP-1167 Minimal Proxy
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck size={12} />
                Invariant Verified
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-2">{pool.name}</h1>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-slate-400">{pool.address}</span>
              <button onClick={handleCopyAddress} className="text-slate-500 hover:text-slate-300">
                {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
              <a
                href={`https://sepolia.basescan.org/address/${pool.address}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-xs flex items-center gap-1"
              >
                <span>Basescan</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenPublicPay(pool.address)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2"
            >
              <QrCode size={16} />
              <span>Public Deposit Gateway</span>
            </button>
          </div>
        </div>

        {/* Workspace Sub-Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {(['overview', 'deposits', 'withdrawals', 'qr'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'qr' ? 'Deposit QR Code' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Payees Table */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-slate-100">Payee Basis Points & Claimable Balances</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-3">Recipient Address</th>
                    <th className="py-3 px-3">Share Ratio</th>
                    <th className="py-3 px-3">Pending Claimable</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                  {pool.payees.map((payee, idx) => {
                    const sharePct = (payee.shares / 100).toFixed(1);
                    const totalRec = parseFloat(pool.totalReceivedETH || '0');
                    const isClaimed = releasedPayees[payee.address];
                    const pendingETH = isClaimed ? 0 : (totalRec * (payee.shares / 10000)).toFixed(3);

                    return (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-sans">
                          <span className="font-mono text-cyan-400 font-bold">{payee.address}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-100 font-bold">
                          {sharePct}% ({payee.shares} BPS)
                        </td>
                        <td className="py-3 px-3 font-bold text-cyan-300">
                          {pendingETH} ETH
                        </td>
                        <td className="py-3 px-3 text-right font-sans">
                          {isClaimed || parseFloat(pendingETH.toString()) === 0 ? (
                            <span className="text-[11px] text-emerald-400 font-semibold">Claimed</span>
                          ) : (
                            <button
                              onClick={() => handleRelease(payee.address)}
                              disabled={releasingPayee === payee.address}
                              className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-colors disabled:opacity-50"
                            >
                              {releasingPayee === payee.address ? 'Releasing...' : 'Release'}
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

          {/* Right Col: Pool Statistics */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-slate-100">Pool Summary</h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
                <p className="text-slate-400 font-semibold">Total Revenue Received</p>
                <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">
                  {pool.totalReceivedETH} ETH
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
                <p className="text-slate-400 font-semibold">Total Shares Basis Points</p>
                <p className="text-base font-bold text-slate-100 font-mono mt-0.5">
                  10,000 BPS (100.0%)
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
                <p className="text-slate-400 font-semibold">Creator</p>
                <p className="text-xs font-mono text-slate-300 truncate mt-0.5">{pool.creator}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: QR Code */}
      {activeTab === 'qr' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl max-w-md mx-auto text-center space-y-4">
          <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${pool.address}`}
              alt="Deposit QR Code"
              className="w-44 h-44 mx-auto"
            />
          </div>
          <h3 className="text-base font-bold text-slate-100">Scan to Deposit ETH</h3>
          <p className="text-xs text-slate-400">
            Scan with any Web3 wallet to send funds directly into this revenue splitter pool.
          </p>
        </div>
      )}
    </div>
  );
};
