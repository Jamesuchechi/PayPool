import React, { useState } from 'react';
import { Pool } from '../types';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';

interface PublicPayGatewayProps {
  pools: Pool[];
  selectedPoolAddress?: string;
  onBack: () => void;
}

export const PublicPayGateway: React.FC<PublicPayGatewayProps> = ({
  pools,
  selectedPoolAddress,
  onBack
}) => {
  const [targetAddress, setTargetAddress] = useState(selectedPoolAddress || (pools[0]?.address || '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41'));
  const [amountETH, setAmountETH] = useState('0.1');
  const [donorName, setDonorName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const selectedPool = pools.find((p) => p.address.toLowerCase() === targetAddress.toLowerCase()) || pools[0];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl mx-auto shadow-lg shadow-cyan-500/30">
            🔗
          </div>
          <h1 className="text-2xl font-bold text-slate-100">PayPool Public Deposit Gateway</h1>
          <p className="text-xs text-slate-400">
            Send ETH directly to autonomous revenue splitters with automatic basis point distribution.
          </p>
        </div>

        {sentSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">Deposit Broadcasted Successfully!</h3>
            <p className="text-xs text-slate-300">
              Sent {amountETH} ETH to {selectedPool?.name || 'Revenue Pool'}. Funds will be split automatically among payees.
            </p>
            <button
              onClick={() => setSentSuccess(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Send Another Payment
            </button>
          </div>
        ) : (
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Destination Revenue Pool
              </label>
              <select
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              >
                {pools.map((p) => (
                  <option key={p.address} value={p.address}>
                    {p.name} ({p.address.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount (ETH)
              </label>
              <div className="flex gap-2 mb-2">
                {['0.05', '0.1', '0.5', '1.0'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountETH(preset)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      amountETH === preset
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {preset} ETH
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.01"
                value={amountETH}
                onChange={(e) => setAmountETH(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sender Name / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sponsor / Client Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Send size={16} />
              <span>{isSending ? 'Broadcasting Deposit...' : `Send ${amountETH} ETH Deposit`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
