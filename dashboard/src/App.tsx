import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { HealthBanner } from './components/HealthBanner';
import { PoolList } from './components/PoolList';
import { CreatePoolModal } from './components/CreatePoolModal';
import { Pool, HealthStatus } from './types';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  // Mock initial demo pools matching design documentation
  const [pools] = useState<Pool[]>([
    {
      address: '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41',
      name: 'Band Royalties Splitter',
      creator: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      payees: [
        { address: '0x4f2a1b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e9c1b', shares: 4000 },
        { address: '0x9be12c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f04d7', shares: 2500 },
        { address: '0x1d772c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7fae30', shares: 2000 },
        { address: '0xc0ff2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f82ab', shares: 1500 }
      ],
      totalReceivedETH: '5.0',
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
      {/* Sleek Glass Top Navigation Bar */}
      <div style={{
        background: 'rgba(15, 20, 32, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '10px 24px',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '-0.3px'
          }}>
            PayPool Protocol
          </span>
          <span style={{
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--accent-primary)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            border: '1px solid rgba(99, 102, 241, 0.25)'
          }}>
            Base Sepolia
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-tertiary)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setView('landing')}
            style={{
              background: view === 'landing' ? 'var(--gradient-brand)' : 'transparent',
              color: view === 'landing' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '5px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            Landing Page
          </button>
          <button
            onClick={() => setView('dashboard')}
            style={{
              background: view === 'dashboard' ? 'var(--gradient-brand)' : 'transparent',
              color: view === 'dashboard' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '5px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            Live Pools ({pools.length})
          </button>
        </div>
      </div>

      {view === 'landing' ? (
        <LandingPage onOpenCreateModal={() => setIsModalOpen(true)} />
      ) : (
        <>
          <Header onOpenCreateModal={() => setIsModalOpen(true)} />
          <HealthBanner status={healthStatus} />

          <main style={{ flex: 1, padding: '20px 0' }}>
            <div style={{ margin: '0 20px 16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Revenue Pools</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{pools.length} total pools</span>
            </div>

            <PoolList pools={pools} />
          </main>
        </>
      )}

      <CreatePoolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;

