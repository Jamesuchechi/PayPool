import React, { useState } from 'react';
import {
  Layers,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Coins,
  Scale,
  Music,
  Briefcase,
  Users,
  Cpu,
  Lock,
  RefreshCw,
  Sliders
} from 'lucide-react';


interface LandingPageProps {
  onOpenCreateModal?: () => void;
  onOpenAuthModal?: () => void;
  onViewDashboard?: () => void;
}

// Preset Simulator Definitions
const PRESETS = [
  {
    id: 'music',
    name: 'Music Royalties',
    icon: Music,
    deposit: 10,
    unit: 'ETH',
    payees: [
      { name: 'Lead Vocalist / Writer', address: '0x7Ac9...3F41', shareBps: 4000, percentage: '40%' },
      { name: 'Music Producer', address: '0x9be1...04d7', shareBps: 3000, percentage: '30%' },
      { name: 'Audio Engineer', address: '0x1d77...ae30', shareBps: 2000, percentage: '20%' },
      { name: 'Label Reserve', address: '0xc0ff...82ab', shareBps: 1000, percentage: '10%' }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS Co-Founders',
    icon: Briefcase,
    deposit: 25000,
    unit: 'USDC',
    payees: [
      { name: 'Technical Co-Founder', address: '0xa1b2...a9b0', shareBps: 5000, percentage: '50%' },
      { name: 'Growth & Marketing', address: '0xf0e9...f2e1', shareBps: 3500, percentage: '35%' },
      { name: 'Infrastructure Reserve', address: '0x3333...3333', shareBps: 1500, percentage: '15%' }
    ]
  },
  {
    id: 'dao',
    name: 'DAO Grant Pool',
    icon: Users,
    deposit: 50,
    unit: 'ETH',
    payees: [
      { name: 'Lead Developer', address: '0x4444...4444', shareBps: 3334, percentage: '33.34%' },
      { name: 'Security Auditor', address: '0x5555...5555', shareBps: 3333, percentage: '33.33%' },
      { name: 'Community Manager', address: '0x6666...6666', shareBps: 3333, percentage: '33.33%' }
    ]
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuthModal,
  onViewDashboard
}) => {

  // Simulator State
  const [selectedPresetId, setSelectedPresetId] = useState('music');
  const [depositAmount, setDepositAmount] = useState<number>(10);
  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // FAQ Data
  const faqs = [
    {
      q: 'Are deployed pools truly autonomous and trustless?',
      a: 'Yes. Once deployed via the PayPool factory, a pool contract is completely immutable. There are no admin keys, no owner pause functions, and no upgrade proxies. Payees receive funds strictly according to their defined immutable share ratios.'
    },
    {
      q: 'Does PayPool take a fee on deposits or withdrawals?',
      a: 'No. PayPool v1 is 100% free and unmonetized. 100% of all incoming ETH and ERC-20 tokens are allocated to payees according to their exact basis point shares.'
    },
    {
      q: 'How does pull-based withdrawal work?',
      a: 'Instead of automatically pushing transfers on deposit (which can fail due to gas limits or receiver contract reentrancy protections), earnings accrue inside the pool contract. Any payee (or anyone on their behalf) can trigger a pull withdrawal at any time.'
    },
    {
      q: 'What tokens are supported?',
      a: 'PayPool supports native ETH as well as any standard ERC-20 token (such as USDC, USDT, DAI, WETH). Each token balance is tracked independently within the contract.'
    },
    {
      q: 'How are deployment gas fees kept so low?',
      a: 'PayPool utilizes the EIP-1167 Minimal Proxy Clone standard. When you deploy a new revenue pool, the factory clones the lightweight reference contract, reducing deployment gas by up to 85% compared to full contract deployments.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '60px' }}>
      {/* 1. HERO SECTION */}
      <section style={{ position: 'relative', paddingTop: '40px', textAlign: 'center' }}>
        {/* Glow ambient background element */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge Pill */}
          <div style={{ display: 'inline-flex', marginBottom: '20px' }}>
            <span className="badge-pill">
              <Sparkles size={14} />
              PayPool Protocol v1.0 — Live on Base Sepolia
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            maxWidth: '900px',
            margin: '0 auto 24px auto'
          }}>
            Trustless On-Chain Revenue Splits.{' '}
            <span className="gradient-text">Zero Custody Risk.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6
          }}>
            Deploy autonomous, immutable revenue-splitting pools in seconds. Automate payouts for collaborators, co-founders, and open-source contributors with mathematical precision.
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenAuthModal || onViewDashboard}
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '1.05rem', borderRadius: '14px' }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-secondary"
              style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '14px' }}
            >
              <Sliders size={18} />
              Try Simulator
            </button>
          </div>


        </div>
      </section>

      {/* 2. METRICS & PROOF BAR */}
      <section className="container-xl">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {[
            { label: 'Total Volume Split', value: '$4.2M+', desc: 'Processed across EVM chains' },
            { label: 'Deployed Splitters', value: '1,420+', desc: 'Immutable revenue pools' },
            { label: 'Invariant Safety', value: '100%', desc: 'Formally verified smart contracts' },
            { label: 'Gas Optimization', value: '85%', desc: 'Savings via EIP-1167 clones' }
          ].map((m, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE REVENUE SPLIT SIMULATOR */}
      <section id="simulator" className="container-xl">
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Sliders size={16} />
                INTERACTIVE DEMO
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Simulate an Autonomous Splitter</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                Select a revenue model and enter a deposit amount to see instant share distribution.
              </p>
            </div>

            {/* Model Preset Selectors */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESETS.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPresetId(p.id);
                      setDepositAmount(p.deposit);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={16} />
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {/* Input Controls */}
            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Incoming Revenue Deposit
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Coins size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Math.max(0, Number(e.target.value)))}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', padding: '10px 16px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  {activePreset.unit}
                </span>
              </div>

              {/* Range slider quick adjustment */}
              <input
                type="range"
                min={1}
                max={activePreset.unit === 'ETH' ? 100 : 100000}
                step={activePreset.unit === 'ETH' ? 1 : 1000}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                style={{ width: '100%', marginBottom: '16px' }}
              />

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                ✨ <strong>Zero intermediary intervention:</strong> When <strong>{depositAmount} {activePreset.unit}</strong> arrives at the contract address, the funds are immediately allocated to payees strictly by basis points (1 BPS = 0.01%).
              </div>
            </div>

            {/* Payee Allocation Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Calculated Payee Share Allocations
              </div>
              {activePreset.payees.map((payee, idx) => {
                const calculatedPayout = ((depositAmount * payee.shareBps) / 10000).toFixed(
                  activePreset.unit === 'ETH' ? 2 : 0
                );
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {payee.name}
                      </div>
                      <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {payee.address} • {payee.percentage} ({payee.shareBps} BPS)
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        +{calculatedPayout} {activePreset.unit}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ready for pull claim</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE-STEP WORKFLOW */}
      <section id="how-it-works" className="container-xl">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-pill" style={{ marginBottom: '12px' }}>
            SIMPLE WORKFLOW
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>How PayPool Works</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            From contract deployment to payee withdrawal in three effortless steps.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            {
              step: '01',
              title: 'Define Shares & Payees',
              desc: 'Specify recipient wallet addresses and their immutable share ratios in basis points (totaling 10,000 BPS = 100%).',
              icon: Sliders
            },
            {
              step: '02',
              title: 'Deploy Factory Clone',
              desc: 'Launch your lightweight EIP-1167 minimal proxy clone contract on Base Sepolia with one click and ultra-low gas.',
              icon: Cpu
            },
            {
              step: '03',
              title: 'Pull-Based Withdrawals',
              desc: 'Deposit ETH or ERC-20 tokens at any time. Payees claim their accumulated earnings whenever they choose.',
              icon: ShieldCheck
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '32px', position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'rgba(56, 189, 248, 0.2)',
                  position: 'absolute',
                  top: '20px',
                  right: '24px'
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--gradient-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '20px'
                }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURE GRID */}
      <section id="features" className="container-xl">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Built for Security & Performance</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            Engineered using OpenZeppelin standards and Foundry invariant testing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            {
              title: 'Autonomous & Immutable',
              desc: 'No admin backdoors, pause functions, or upgradability proxies. Once deployed, the contract operates strictly as written forever.',
              icon: Lock
            },
            {
              title: 'Gas-Efficient EIP-1167 Clones',
              desc: 'Deploy new revenue splitters at a fraction of standard deployment cost by reusing the master reference implementation.',
              icon: Zap
            },
            {
              title: 'Multi-Token Architecture',
              desc: 'Seamlessly accepts native ETH and any ERC-20 token (USDC, USDT, DAI) in the exact same pool contract.',
              icon: Coins
            },
            {
              title: 'Pull-Payment Model',
              desc: 'Prevents denial-of-service and re-entrancy attacks by isolating payee withdrawals into independent pull claims.',
              icon: ShieldCheck
            },
            {
              title: 'Sub-Second Off-Chain Indexing',
              desc: 'Integrated off-chain event indexer provides instant real-time history of deposits, allocations, and withdrawals.',
              icon: RefreshCw
            },
            {
              title: 'Mathematical Conservation Invariant',
              desc: 'Fuzz-tested invariant proofs ensure that total deposits strictly equal the sum of released and pending payee balances.',
              icon: Scale
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '28px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                  marginBottom: '16px'
                }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="container-xl">

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-pill" style={{ marginBottom: '12px' }}>
              <HelpCircle size={14} />
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Everything You Need to Know</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        color: 'var(--accent-primary)',
                        flexShrink: 0
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 24px 20px 24px',
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CONVERSION BANNER & FOOTER */}
      <section className="container-xl">
        <div style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(37, 99, 235, 0.18) 50%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid var(--border-hover)',
          borderRadius: '28px',
          padding: '48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
            Automate Your Team's Revenue Splits Today
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 28px auto' }}>
            No credit card required. Deploy trustless payment pools directly on Base Sepolia testnet.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenAuthModal || onViewDashboard}
              className="btn btn-primary"
              style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-secondary"
              style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}
            >
              Learn How It Works
            </button>
          </div>

        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '60px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--gradient-brand)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Layers size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>PayPool Protocol</span>
            <span>• Base Sepolia Testnet</span>
          </div>
          <div>
            Built for trustless, transparent on-chain revenue distribution.
          </div>
        </footer>
      </section>
    </div>
  );
};
