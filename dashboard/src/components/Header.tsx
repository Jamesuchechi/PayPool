import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  Layers,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Copy,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

import { User } from '../types/auth';

interface HeaderProps {
  currentView: 'landing' | 'dashboard';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
  user?: User | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenCreateModal,
  onOpenAuthModal,
  user,
  onSignOut
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(6, 9, 14, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 24px'
    }}>
      <div className="container-xl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            onClick={() => onNavigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              background: 'var(--gradient-brand)',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(56, 189, 248, 0.3)'
            }}>
              <Layers size={22} color="white" />
            </div>
            <div>
              <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                PayPool
              </span>
            </div>
          </div>

          {/* Network Pill in Dashboard view */}
          {currentView === 'dashboard' && (
            <span style={{
              background: 'rgba(56, 189, 248, 0.1)',
              color: 'var(--accent-primary)',
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid rgba(56, 189, 248, 0.25)',
              fontFamily: 'var(--font-mono)'
            }}>
              Base Sepolia
            </span>
          )}
        </div>

        {/* Center: LANDING PAGE MARKETING NAV LINKS vs DASHBOARD BACK BUTTON */}
        {currentView === 'landing' ? (
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <button
              onClick={() => scrollToSection('features')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('simulator')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}
            >
              Simulator
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}
            >
              FAQ
            </button>
          </nav>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onNavigate('landing')}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} />
              Back to Product Overview
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentView === 'landing' ? (
            user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => onNavigate('dashboard')}
                  style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px' }}
                >
                  My Dashboard
                  <ArrowRight size={16} />
                </button>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 10px 5px 6px',
                      borderRadius: '12px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-hover)',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <img
                      src={user.avatarUrl || 'https://api.dicebear.com/7.x/identicon/svg?seed=user'}
                      alt={user.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
                    />
                    <ChevronDown size={14} color="var(--text-muted)" />
                  </button>

                  {showDropdown && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '200px',
                      background: 'rgba(13, 19, 32, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid var(--border-hover)',
                      borderRadius: '16px',
                      padding: '12px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
                      zIndex: 100
                    }}>
                      <div style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '6px' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email || user.address}</div>
                      </div>
                      {onSignOut && (
                        <button
                          onClick={() => { setShowDropdown(false); onSignOut(); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#f87171', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={onOpenAuthModal}
                style={{ padding: '8px 20px', fontSize: '0.88rem', borderRadius: '10px' }}
              >
                <Wallet size={16} />
                Sign In / Get Started
              </button>
            )
          ) : (
            <>
              {/* Dashboard Actions: Create Pool + User Profile */}
              <button
                id="btn-create-pool"
                className="btn btn-primary"
                onClick={onOpenCreateModal}
                style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px' }}
              >
                <PlusCircle size={16} />
                Create Pool
              </button>

              {user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 12px 5px 6px',
                      borderRadius: '12px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-hover)',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <img
                      src={user.avatarUrl || 'https://api.dicebear.com/7.x/identicon/svg?seed=user'}
                      alt={user.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
                    />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2 }}>{user.name}</div>
                    </div>
                    <ChevronDown size={14} color="var(--text-muted)" />
                  </button>

                  {showDropdown && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '220px',
                      background: 'rgba(13, 19, 32, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid var(--border-hover)',
                      borderRadius: '16px',
                      padding: '12px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
                      zIndex: 100
                    }}>
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '8px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Account Role
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'capitalize' }}>
                          {user.role}
                        </div>
                      </div>

                      {user.address && (
                        <button
                          onClick={() => handleCopyAddress(user.address!)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>Copy Address</span>
                          {copied ? <CheckCircle2 size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                        </button>
                      )}

                      {onSignOut && (
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onSignOut();
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '8px'
                          }}
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="btn-connect-wallet"
                  className="btn btn-secondary"
                  onClick={onOpenAuthModal}
                  style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
                >
                  <Wallet size={16} />
                  Sign In
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
