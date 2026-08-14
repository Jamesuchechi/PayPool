import React, { useState } from 'react';
import { Header } from './components/Header';
import { HealthBanner } from './components/HealthBanner';
import { PoolList } from './components/PoolList';
import { CreatePoolModal } from './components/CreatePoolModal';
import { Pool, HealthStatus } from './types';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock initial demo pools matching design documentation
  const [pools] = useState<Pool[]>([
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'Band Royalties Splitter',
      creator: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      payees: [
        { address: '0x1111111111111111111111111111111111111111', shares: 5000 },
        { address: '0x2222222222222222222222222222222222222222', shares: 5000 }
      ],
      totalReceivedETH: '4.5',
      blockCreated: 12345000
    },
    {
      address: '0x876543210fedcba9876543210fedcba987654321',
      name: 'Open Source Grant Pool',
      creator: '0xf0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1',
      payees: [
        { address: '0x3333333333333333333333333333333333333333', shares: 3334 },
        { address: '0x4444444444444444444444444444444444444444', shares: 3333 },
        { address: '0x5555555555555555555555555555555555555555', shares: 3333 }
      ],
      totalReceivedETH: '12.0',
      blockCreated: 12345100
    }
  ]);

  const [healthStatus] = useState<HealthStatus>({
    lastIndexedBlock: 12345678,
    chainHeadBlock: 12345680,
    lagSeconds: 4,
    status: 'healthy'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onOpenCreateModal={() => setIsModalOpen(true)} />
      <HealthBanner status={healthStatus} />

      <main style={{ flex: 1 }}>
        <div style={{ margin: '0 20px 16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Revenue Pools</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{pools.length} total pools</span>
        </div>

        <PoolList pools={pools} />
      </main>

      <CreatePoolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;
