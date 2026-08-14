import React from 'react';
import { PoolCard } from './PoolCard';
import { Pool } from '../types';

interface PoolListProps {
  pools: Pool[];
}

export const PoolList: React.FC<PoolListProps> = ({ pools }) => {
  if (pools.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', margin: '20px' }}>
        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No revenue pools found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Create your first PayPool instance to start splitting revenue on-chain.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px',
      padding: '0 20px 20px 20px'
    }}>
      {pools.map((pool) => (
        <PoolCard key={pool.address} pool={pool} />
      ))}
    </div>
  );
};
