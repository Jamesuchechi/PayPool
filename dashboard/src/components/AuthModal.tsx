import React, { useState } from 'react';
import {
  X,
  Wallet,
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase,
  Users
} from 'lucide-react';

import { User, AuthMode, UserRole } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [authMethod, setAuthMethod] = useState<'wallet' | 'email'>('wallet');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('creator');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  // Handle Web3 Wallet Connect Simulation
  const handleConnectWallet = (walletName: string, mockAddress: string) => {
    setConnectingWallet(walletName);
    setErrorMessage('');

    setTimeout(() => {
      setConnectingWallet(null);
      const mockUser: User = {
        id: `usr_${Date.now()}`,
        name: `${walletName} User`,
        address: mockAddress,
        role: 'creator',
        authProvider: 'wallet',
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${mockAddress}`,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(mockUser);
      onClose();
    }, 1200);
  };

  // Handle Email Form Submit
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot-password' && (!password || password.length < 6)) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (mode === 'forgot-password') {
        setResetSent(true);
        return;
      }

      const mockUser: User = {
        id: `usr_${Date.now()}`,
        name: mode === 'signup' ? name : email.split('@')[0],
        email: email,
        address: '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41',
        role: role,
        authProvider: 'email',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(mockUser);
      onClose();
    }, 1000);
  };

  // Handle Quick Demo Login
  const handleDemoLogin = (demoRole: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const mockUser: User = {
        id: `usr_demo_${demoRole}`,
        name: demoRole === 'creator' ? 'Alex Rivera (Pool Admin)' : 'Sarah Chen (Lead Payee)',
        email: demoRole === 'creator' ? 'alex.rivera@paypool.io' : 'sarah.chen@paypool.io',
        address: demoRole === 'creator' ? '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0' : '0x4f2a1b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e9c1b',
        role: demoRole,
        authProvider: 'wallet',
        avatarUrl: demoRole === 'creator' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(mockUser);
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(18, 24, 38, 0.95) 0%, rgba(10, 14, 23, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          padding: '32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient decoration */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'var(--gradient-brand)',
            boxShadow: '0 8px 24px rgba(56, 189, 248, 0.35)',
            marginBottom: '16px'
          }}>
            <Shield size={26} color="white" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {mode === 'signin' && 'Welcome Back to PayPool'}
            {mode === 'signup' && 'Create Your PayPool Account'}
            {mode === 'forgot-password' && 'Reset Your Password'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {mode === 'signin' && 'Connect your wallet or sign in to manage revenue splitters'}
            {mode === 'signup' && 'Deploy autonomous pools or track incoming earnings'}
            {mode === 'forgot-password' && 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* Auth Method Selector Toggle (Wallet vs Email) */}
        {mode !== 'forgot-password' && (
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setAuthMethod('wallet')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: authMethod === 'wallet' ? 'var(--gradient-brand)' : 'transparent',
                color: authMethod === 'wallet' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Wallet size={16} />
              Web3 Wallet
            </button>
            <button
              onClick={() => setAuthMethod('email')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: authMethod === 'email' ? 'var(--gradient-brand)' : 'transparent',
                color: authMethod === 'email' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Mail size={16} />
              Email & Pass
            </button>
          </div>
        )}

        {/* Error message alert */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#f87171',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* WEB3 WALLET CONNECTION VIEW */}
        {authMethod === 'wallet' && mode !== 'forgot-password' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                id: 'metamask',
                name: 'MetaMask',
                badge: 'Popular',
                desc: 'Connect with your MetaMask browser extension',
                address: '0x7Ac9d1B48e6F02Ca7715bE39Db2c0A9E4d5c3F41'
              },
              {
                id: 'coinbase',
                name: 'Coinbase Wallet',
                badge: 'Self-Custody',
                desc: 'Use Coinbase Wallet app or extension',
                address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0'
              },
              {
                id: 'walletconnect',
                name: 'WalletConnect',
                badge: 'QR Code',
                desc: 'Scan with 100+ mobile wallets',
                address: '0x4f2a1b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e9c1b'
              }
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => handleConnectWallet(w.name, w.address)}
                disabled={!!connectingWallet}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: connectingWallet === w.name ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: connectingWallet ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)'
                  }}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {w.name}
                      <span style={{
                        fontSize: '0.7rem',
                        background: 'rgba(56, 189, 248, 0.2)',
                        color: 'var(--accent-primary)',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontWeight: 600
                      }}>
                        {w.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {w.desc}
                    </div>
                  </div>
                </div>

                {connectingWallet === w.name ? (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid var(--accent-primary)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : (
                  <ArrowRight size={16} color="var(--text-muted)" />
                )}
              </button>
            ))}

            {/* Quick Demo Accounts */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
                Instant Demo Access (No Extension Needed)
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleDemoLogin('creator')}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: 'var(--accent-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Briefcase size={14} />
                  Demo Admin
                </button>
                <button
                  onClick={() => handleDemoLogin('payee')}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Users size={14} />
                  Demo Payee
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EMAIL & PASSWORD VIEW */}
        {(authMethod === 'email' || mode === 'forgot-password') && (
          <form onSubmit={handleSubmitEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resetSent ? (
              <div style={{
                textAlign: 'center',
                padding: '24px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px'
              }}>
                <CheckCircle2 size={40} color="var(--accent-emerald)" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Reset Link Sent!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  We sent password reset instructions to <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => { setResetSent(false); setMode('signin'); }}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <>
                {/* Full Name for Sign Up */}
                {mode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <UserIcon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Alex Rivera"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 40px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                {mode !== 'forgot-password' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Password
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot-password')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 40px 12px 40px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Role Selector for Sign Up */}
                {mode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Primary Account Purpose
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setRole('creator')}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          border: role === 'creator' ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: role === 'creator' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          color: role === 'creator' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Pool Creator / Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('payee')}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          border: role === 'payee' ? '1px solid var(--accent-emerald)' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: role === 'payee' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          color: role === 'payee' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Payee / Recipient
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    marginTop: '8px'
                  }}
                >
                  {isSubmitting ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Processing...
                    </div>
                  ) : (
                    <>
                      {mode === 'signin' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot-password' && 'Send Password Reset'}
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {/* Switch Mode Footer Toggle */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          {mode === 'signin' && (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign Up Free
              </button>
            </span>
          )}

          {mode === 'signup' && (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
            </span>
          )}

          {mode === 'forgot-password' && (
            <button
              onClick={() => setMode('signin')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
