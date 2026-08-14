import React from 'react';
import { ArrowUpRight, Users, Coins } from 'lucide-react';
import { Pool } from '../types';

interface PoolCardProps {
  pool: Pool;
}

export const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{pool.name}</h3>
          <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {pool.address.slice(0, 6)}...{pool.address.slice(-4)}
          </p>
        </div>
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          color: 'var(--accent-primary)',
          padding: '6px',
          borderRadius: '8px'
        }}>
          <ArrowUpRight size={18} />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        background: 'var(--bg-tertiary)',
        padding: '12px',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Coins size={16} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Received</div>
            <div className="mono" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {pool.totalReceivedETH} ETH
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} color="var(--accent-secondary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payees</div>
            <div className="mono" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {pool.payees.length} members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
