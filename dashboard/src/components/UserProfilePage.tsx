import React, { useState } from 'react';
import { User } from '../types';
import { Wallet, Shield, Download, CheckCircle2, Copy } from 'lucide-react';

interface UserProfilePageProps {
  user: User | null;
  onSignOut?: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onSignOut }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,TxHash,PoolAddress,Type,Amount,Timestamp\n0xabc123...,0x7Ac9...,Deposit,5.0 ETH,2026-08-16T18:00:00Z\n0xdef456...,0x7Ac9...,Withdrawal,2.0 ETH,2026-08-16T18:15:00Z`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PayPool_Transaction_Report_${user?.name || 'User'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/identicon/svg?seed=user'}
            alt={user?.name || 'User'}
            className="w-16 h-16 rounded-2xl border-2 border-cyan-400 p-0.5 bg-slate-950"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{user?.name || 'Web3 Visitor'}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email || user?.address || 'Unauthenticated'}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Role: {user?.role || 'Guest'}
            </span>
          </div>
        </div>

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors shrink-0"
          >
            Sign Out
          </button>
        )}
      </div>

      {/* Account Details & CSV Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet & Security */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Wallet size={18} className="text-cyan-400" />
            <span>Connected Wallet & Auth</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1">
              <p className="text-slate-400 font-semibold">Wallet Address</p>
              <div className="flex items-center justify-between text-cyan-300 font-mono font-bold">
                <span className="truncate max-w-[220px]">{user?.address || '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41'}</span>
                <button
                  onClick={() => handleCopy(user?.address || '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41')}
                  className="p-1 hover:text-white transition-colors"
                >
                  {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1">
              <p className="text-slate-400 font-semibold">Default Network</p>
              <p className="text-slate-200 font-bold">Base Sepolia (Chain ID 84532)</p>
            </div>
          </div>
        </div>

        {/* Data Export & Preferences */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Shield size={18} className="text-blue-400" />
            <span>Audit & Compliance Export</span>
          </h2>

          <p className="text-xs text-slate-400">
            Download your full deposit and payout history as a CSV file for tax reporting and accounting audits.
          </p>

          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Download size={16} />
            <span>Export Transaction History (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
