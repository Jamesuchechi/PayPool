import React from 'react';
import { Wallet, PlusCircle, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal }) => {
  return (
    <header className="glass-panel" style={{ margin: '20px', padding: '16px 32px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--gradient-brand)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={24} color="white" />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              PayPool
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Trustless On-Chain Revenue Splitting
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button id="btn-create-pool" className="btn btn-primary" onClick={onOpenCreateModal}>
            <PlusCircle size={18} />
            Create Pool
          </button>
          <button id="btn-connect-wallet" className="btn btn-secondary">
            <Wallet size={18} />
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
};
