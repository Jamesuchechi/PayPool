import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { HealthBanner } from './components/HealthBanner';
import { OverviewDashboard } from './components/OverviewDashboard';
import { PoolsDirectory } from './components/PoolsDirectory';
import { PoolDetailWorkspace } from './components/PoolDetailWorkspace';
import { MyEarningsPortal } from './components/MyEarningsPortal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { NotificationsCenter } from './components/NotificationsCenter';
import { UserProfilePage } from './components/UserProfilePage';
import { PublicPayGateway } from './components/PublicPayGateway';
import { CreatePoolModal } from './components/CreatePoolModal';
import { AuthModal } from './components/AuthModal';

import { Pool, HealthStatus, AppView, AppNotification } from './types';
import { User } from './types/auth';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [view, setView] = useState<AppView>('landing');
  const [selectedPoolAddress, setSelectedPoolAddress] = useState<string | null>(null);

  // User Auth State
  const [user, setUser] = useState<User | null>(null);

  // Demo Pools Data
  const [pools] = useState<Pool[]>([
    {
      address: '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41',
      name: 'Band Royalties Splitter',
      creator: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      payees: [
        { address: '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41', shares: 4000 },
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
        { address: '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41', shares: 3334 },
        { address: '0x4444444444444444444444444444444444444444', shares: 3333 },
        { address: '0x5555555555555555555555555555555555555555', shares: 3333 }
      ],
      totalReceivedETH: '12.0',
      blockCreated: 12345100
    }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: 'Incoming Deposit Received',
      message: 'Band Royalties Splitter received 5.0 ETH deposit',
      timestamp: '10 mins ago',
      read: false,
      type: 'deposit',
      poolAddress: '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41',
      txHash: '0xabc123789fedcba0123'
    },
    {
      id: '2',
      title: 'New Revenue Pool Deployed',
      message: 'Open Source Grant Pool was initialized with 3 payees',
      timestamp: '1 hour ago',
      read: true,
      type: 'pool_created',
      poolAddress: '0x876543210fedcba9876543210fedcba987654321'
    }
  ]);

  const [healthStatus] = useState<HealthStatus>({
    lastIndexedBlock: 12345678,
    chainHeadBlock: 12345680,
    lagSeconds: 4,
    status: 'healthy'
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavigate = (targetView: AppView) => {
    if (targetView !== 'landing' && targetView !== 'public-pay' && !user) {
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

  const handleSelectPool = (poolAddress: string) => {
    setSelectedPoolAddress(poolAddress);
    setView('pool-detail');
  };

  const selectedPool = pools.find((p) => p.address.toLowerCase() === selectedPoolAddress?.toLowerCase()) || pools[0];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Persistent Top Navigation Bar */}
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
        healthStatus={healthStatus}
        unreadNotificationCount={unreadCount}
      />

      {/* Landing View vs Authenticated Layout Shell */}
      {view === 'landing' ? (
        <LandingPage
          onOpenCreateModal={handleCreatePoolClick}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onViewDashboard={() => handleNavigate('dashboard')}
        />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row pb-16 md:pb-0">
          {/* Persistent Sidebar for Desktop & Tablet */}
          <Sidebar
            currentView={view}
            onNavigate={handleNavigate}
            onOpenCreateModal={handleCreatePoolClick}
            user={user}
            unreadNotificationCount={unreadCount}
          />

          {/* Main Workspace Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <HealthBanner status={healthStatus} />

            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
              {view === 'dashboard' && (
                <OverviewDashboard
                  pools={pools}
                  onSelectPool={handleSelectPool}
                  onOpenCreateModal={handleCreatePoolClick}
                  onNavigate={handleNavigate}
                  userName={user?.name}
                />
              )}

              {view === 'pools' && (
                <PoolsDirectory
                  pools={pools}
                  onSelectPool={handleSelectPool}
                  onOpenCreateModal={handleCreatePoolClick}
                  onNavigate={handleNavigate}
                  userAddress={user?.address}
                />
              )}

              {view === 'pool-detail' && (
                <PoolDetailWorkspace
                  pool={selectedPool}
                  onBack={() => setView('pools')}
                  onOpenPublicPay={(addr) => {
                    setSelectedPoolAddress(addr);
                    setView('public-pay');
                  }}
                />
              )}

              {view === 'my-earnings' && (
                <MyEarningsPortal
                  pools={pools}
                  userAddress={user?.address}
                  onSelectPool={handleSelectPool}
                />
              )}

              {view === 'analytics' && <AnalyticsDashboard />}

              {view === 'notifications' && (
                <NotificationsCenter
                  notifications={notifications}
                  onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                  onSelectPool={handleSelectPool}
                />
              )}

              {view === 'profile' && (
                <UserProfilePage
                  user={user}
                  onSignOut={() => {
                    setUser(null);
                    setView('landing');
                  }}
                />
              )}

              {view === 'public-pay' && (
                <PublicPayGateway
                  pools={pools}
                  selectedPoolAddress={selectedPoolAddress || undefined}
                  onBack={() => setView('dashboard')}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar (< 768px) */}
      {view !== 'landing' && (
        <MobileBottomBar
          currentView={view}
          onNavigate={handleNavigate}
          onOpenCreateModal={handleCreatePoolClick}
          unreadNotificationCount={unreadCount}
        />
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
