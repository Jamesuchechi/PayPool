import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { HealthStatus } from '../types';

interface HealthBannerProps {
  status: HealthStatus;
}

export const HealthBanner: React.FC<HealthBannerProps> = ({ status }) => {
  return (
    <div className="glass-panel" style={{
      margin: '0 20px 20px 20px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.85rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
        <CheckCircle2 size={16} />
        <span>Indexer Operational</span>
      </div>
      <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
        <span>Chain Head: <strong className="mono" style={{ color: 'var(--text-primary)' }}>#{status.chainHeadBlock || '---'}</strong></span>
        <span>Last Synced: <strong className="mono" style={{ color: 'var(--text-primary)' }}>#{status.lastIndexedBlock || '---'}</strong></span>
        <span>Lag: <strong className="mono" style={{ color: 'var(--text-primary)' }}>{status.lagSeconds}s</strong></span>
      </div>
    </div>
  );
};
