import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { HealthBanner } from './components/HealthBanner';
import { PoolList } from './components/PoolList';
import { CreatePoolModal } from './components/CreatePoolModal';
import { AuthModal } from './components/AuthModal';
import { Pool, HealthStatus } from './types';
import { User } from './types/auth';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  // User Auth State
  const [user, setUser] = useState<User | null>(null);

  // Mock initial demo pools
  const [pools] = useState<Pool[]>([
    {
      address: '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41',
      name: 'Band Royalties Splitter',
      creator: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      payees: [
        { address: '0x4f2a1b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e9c1b', shares: 4000 },
        { address: '0x9be12c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f04d7', shares: 3000 },
        { address: '0x1d772c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7fae30', shares: 2000 },
        { address: '0xc0ff2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f82ab', shares: 1000 }
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

  const handleNavigate = (targetView: 'landing' | 'dashboard') => {
    if (targetView === 'dashboard' && !user) {
      setIsAuthModalOpen(true);
    } else {
      setView(targetView);
    }
  };

  const handleCreatePoolClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <Header
        currentView={view}
        onNavigate={handleNavigate}
        onOpenCreateModal={handleCreatePoolClick}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        user={user}
        onSignOut={() => {
          setUser(null);
          setView('landing');
        }}
      />

      {view === 'landing' ? (
        <LandingPage
          onOpenCreateModal={handleCreatePoolClick}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onViewDashboard={() => handleNavigate('dashboard')}
        />
      ) : (
        <>
          <HealthBanner status={healthStatus} />
          <main style={{ flex: 1, padding: '20px 0' }}>
            <div style={{ margin: '0 20px 16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Active Revenue Pools</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                  Authenticated as <strong>{user?.name}</strong> ({user?.role})
                </p>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{pools.length} total pools</span>
            </div>
            <PoolList pools={pools} />
          </main>
        </>
      )}

      {/* Modals */}
      <CreatePoolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setIsAuthModalOpen(false);
          setView('dashboard');
        }}
      />
    </div>
  );
};

export default App;
