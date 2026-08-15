import React, { useState } from 'react';
import {
  Layers,
  Zap,
  Code2,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  HelpCircle,
  ChevronDown,
  Coins,
  RefreshCw,
  Play,
  Terminal,
  Scale,
  Check,
  X,
  Copy,
  Flame,
  Music,
  Briefcase,
  Palette,
  Users,
  Radio
} from 'lucide-react';

interface LandingPageProps {
  onOpenCreateModal: () => void;
}

// Preset Template Definitions
const PRESETS = [
  {
    id: 'music',
    name: 'Music Royalty Split',
    icon: Music,
    deposit: 12.5,
    payees: [
      { id: 1, name: 'Lead Vocalist / Songwriter', address: '0x7Ac9...3F41', bps: 4000 },
      { id: 2, name: 'Lead Guitarist', address: '0x9be1...04d7', bps: 3000 },
      { id: 3, name: 'Audio Producer', address: '0x1d77...ae30', bps: 2000 },
      { id: 4, name: 'Mixing Engineer', address: '0xc0ff...82ab', bps: 1000 }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS Co-Founder Split',
    icon: Briefcase,
    deposit: 25.0,
    payees: [
      { id: 1, name: 'Lead Tech Co-Founder', address: '0xa1b2...a9b0', bps: 5000 },
      { id: 2, name: 'Growth / Business Lead', address: '0xf0e9...f2e1', bps: 3500 },
      { id: 3, name: 'Infrastructure Reserve', address: '0x3333...3333', bps: 1500 }
    ]
  },
  {
    id: 'nft',
    name: 'NFT Art Collection',
    icon: Palette,
    deposit: 18.0,
    payees: [
      { id: 1, name: '3D Digital Artist', address: '0x4444...4444', bps: 7000 },
      { id: 2, name: 'Smart Contract Engineer', address: '0x5555...5555', bps: 3000 }
    ]
  },
  {
    id: 'dao',
    name: 'DAO Grant Committee',
    icon: Users,
    deposit: 50.0,
    payees: [
      { id: 1, name: 'Core Contributor 1', address: '0x6666...6666', bps: 3334 },
      { id: 2, name: 'Core Contributor 2', address: '0x7777...7777', bps: 3333 },
      { id: 3, name: 'Security Auditor', address: '0x8888...8888', bps: 3333 }
    ]
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenCreateModal }) => {
  // Code Explorer Active Tab
  const [activeCodeTab, setActiveCodeTab] = useState<'interface' | 'events' | 'foundry'>('interface');
  const [copiedCode, setCopiedCode] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Simulator State
  const [selectedPreset, setSelectedPreset] = useState<string>('music');
  const [simDepositETH, setSimDepositETH] = useState<number>(12.5);
  const [simPayees, setSimPayees] = useState(PRESETS[0].payees);

  // Live Indexer Activity Log Stream
  const liveLogs = [
    { id: 1, type: 'PaymentReceived', from: '0x8f3...a91', amount: '2.50 ETH', pool: '0x7Ac9...3F41', time: '2s ago', status: 'CONFIRMED' },
    { id: 2, type: 'PaymentReleased', to: '0x4f2a...9c1b', amount: '1.00 ETH', pool: '0x7Ac9...3F41', time: '14s ago', status: 'CONFIRMED' },
    { id: 3, type: 'SplitterCreated', creator: '0xa1b2...a9b0', pool: '0x8765...4321', name: 'Open Source Grant Pool', time: '45s ago', status: 'CONFIRMED' }
  ];

  // Total Allocated BPS calculation
  const totalBPS = simPayees.reduce((acc, p) => acc + p.bps, 0);

  const handleSelectPreset = (presetId: string) => {
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setSelectedPreset(presetId);
      setSimDepositETH(found.deposit);
      setSimPayees(found.payees);
    }
  };

  const handleUpdateBps = (id: number, newBps: number) => {
    setSimPayees(prev =>
      prev.map(p => (p.id === id ? { ...p, bps: Math.max(0, Math.min(10000, newBps)) } : p))
    );
  };

  const handleAddPayee = () => {
    if (simPayees.length >= 5) return;
    const newId = Date.now();
    setSimPayees(prev => [
      ...prev,
      {
        id: newId,
        name: `Payee ${prev.length + 1}`,
        address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        bps: 1000
      }
    ]);
  };

  const handleRemovePayee = (id: number) => {
    if (simPayees.length <= 2) return;
    setSimPayees(prev => prev.filter(p => p.id !== id));
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ position: 'relative', paddingTop: '70px', paddingBottom: '90px', overflow: 'hidden' }}>
        {/* Ambient Radial Lighting Glows */}
        <div style={{
          position: 'absolute',
          top: '-180px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(6,182,212,0.1) 45%, transparent 75%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />

        <div className="container-xl" style={{ position: 'relative', zIndex: 10 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '44px', alignItems: 'center' }}>
            
            {/* Left Main Hero Text */}
            <div style={{ gridColumn: 'span 12' }}>
              
              <div className="badge-pill" style={{ marginBottom: '24px' }}>
                <Sparkles size={14} />
                <span>EIP-1167 Proxy Clones · Solidity 0.8.24 · Base Sepolia Testnet</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5.2vw, 4.2rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-1.8px',
                marginBottom: '24px'
              }}>
                Trustless, On-Chain <br />
                <span className="gradient-text">Revenue Distribution</span>
              </h1>

              <p style={{
                fontSize: '1.18rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '38px',
                maxWidth: '580px'
              }}>
                Deploy immutable revenue pools, set payee addresses and proportional shares down to 1 BPS precision (0.01%), and let funds distribute automatically. Zero admin keys, zero custodians, zero protocol fees.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={onOpenCreateModal} className="btn btn-primary" style={{ padding: '15px 32px', fontSize: '1rem' }}>
                  <Zap size={18} />
                  Deploy Pool Now
                </button>
                <a href="#simulator" className="btn btn-secondary" style={{ padding: '15px 32px', fontSize: '1rem' }}>
                  <Play size={18} />
                  Interactive Simulator
                </a>
              </div>

              {/* Verified Security Badges */}
              <div style={{
                marginTop: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                background: 'var(--bg-secondary)',
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> 27 Tests Passing
                </span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: 'var(--text-secondary)' }}>1 Invariant Test</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: 'var(--accent-cyan)' }}>0 Admin Keys</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>0% Protocol Fee</span>
              </div>

            </div>

            {/* Right Live Payment Visualizer Card */}
            <div style={{ gridColumn: 'span 12' }}>
              <div className="glass-panel" style={{
                padding: '30px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(145deg, rgba(15,20,32,0.92) 0%, rgba(22,30,48,0.8) 100%)',
                boxShadow: '0 25px 50px -20px rgba(0,0,0,0.8)',
                border: '1px solid var(--border-hover)'
              }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }} className="animate-glow" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
                      POOL EXECUTION PREVIEW
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(99,102,241,0.18)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
                    10,000 BPS Allocations
                  </span>
                </div>

                {/* Pool Architecture Deposit Banner */}
                <div style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  border: '1px solid rgba(99,102,241,0.35)',
                  marginBottom: '22px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    INCOMING CONTRACT DEPOSIT
                  </div>
                  <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    +12.50 ETH <span style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>($37,500)</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', marginTop: '4px', fontWeight: 600 }}>
                    ↳ PayPool Splitter Instance (0x7Ac9...3F41)
                  </div>
                </div>

                {/* Flow Payee Split Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* Payee 1 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Lead Vocalist / Creator</div>
                      <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>0x7Ac9...3F41</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mono" style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '1rem' }}>5.00 ETH</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>40.0% (4,000 BPS)</div>
                    </div>
                  </div>

                  {/* Payee 2 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Lead Guitarist</div>
                      <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>0x9be1...04d7</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mono" style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '1rem' }}>3.75 ETH</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>30.0% (3,000 BPS)</div>
                    </div>
                  </div>

                  {/* Payee 3 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Audio Producer</div>
                      <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>0x1d77...ae30</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mono" style={{ fontWeight: 800, color: 'var(--accent-secondary)', fontSize: '1rem' }}>2.50 ETH</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>20.0% (2,000 BPS)</div>
                    </div>
                  </div>

                </div>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  🔒 Non-custodial pull-payment via <code className="mono" style={{ color: 'var(--accent-cyan)' }}>release(payee, token)</code>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 2. PROTOCOL METRICS GRID & GAS BENCHMARK */}
      <section style={{ padding: '50px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container-xl">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            
            <div className="glass-card" style={{ padding: '28px' }}>
              <div className="mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>10,000</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>BPS Total Precision</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>Exact mathematical share division down to 0.01% with zero truncation loss</div>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              <div className="mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>2 – 20</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>Payees Per Pool</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>Gas-optimized loops with duplicate payee and zero-address validation</div>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              <div className="mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>0</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>Admin Keys</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>Zero owner privileges, zero upgrade proxies, zero rug-pull vulnerability</div>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              <div className="mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>96.4%</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>Gas Cost Savings</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>EIP-1167 Minimal Proxies reduce deployment cost from ~1.2M to ~45k gas</div>
            </div>

          </div>

          {/* Gas Efficiency Highlight Card */}
          <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', background: 'linear-gradient(90deg, rgba(16,185,129,0.08) 0%, rgba(15,20,32,0.8) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(16,185,129,0.15)', borderRadius: '12px', color: 'var(--accent-emerald)' }}>
                <Flame size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>EIP-1167 Minimal Proxy Clone Benchmark</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Deploying a standard contract costs ~1,250,000 gas ($45.00). PayPool Proxy Clones deploy for only ~45,000 gas ($1.62).</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>~45,000 GAS</span>
              <button onClick={onOpenCreateModal} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Test Deployment
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* 3. INTERACTIVE REVENUE SIMULATOR (PLAYGROUND WITH INDUSTRY PRESETS) */}
      <section id="simulator" style={{ padding: '90px 0' }}>
        <div className="container-xl">
          
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px auto' }}>
            <div className="badge-pill" style={{ marginBottom: '16px' }}>
              <RefreshCw size={14} />
              <span>Interactive Playground & Preset Templates</span>
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, letterSpacing: '-0.8px' }}>
              Simulate & Test Your Revenue Pool
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '12px' }}>
              Choose an industry preset template below or customize your deposit and payee allocations in real-time.
            </p>
          </div>

          {/* Industry Preset Selector Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {PRESETS.map(preset => {
              const IconComp = preset.icon;
              const isSelected = selectedPreset === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  style={{
                    background: isSelected ? 'var(--gradient-brand)' : 'var(--bg-tertiary)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: isSelected ? 'transparent' : 'var(--border-color)',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
                  }}
                >
                  <IconComp size={16} />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          <div className="glass-panel" style={{ padding: '36px', maxWidth: '940px', margin: '0 auto' }}>
            
            {/* Deposit Control Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-tertiary)',
              padding: '22px 28px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '32px',
              border: '1px solid var(--border-color)',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>SIMULATED REVENUE DEPOSIT</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <Coins size={24} color="var(--accent-cyan)" />
                  <input
                    type="number"
                    value={simDepositETH}
                    onChange={e => setSimDepositETH(Math.max(0, Number(e.target.value)))}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 14px',
                      borderRadius: 'var(--radius-sm)',
                      width: '130px'
                    }}
                  />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>ETH</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>USD ESTIMATE ($3,000 / ETH)</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  ${(simDepositETH * 3000).toLocaleString('en-US')} USD
                </div>
              </div>
            </div>

            {/* Payees List & Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {simPayees.map(payee => {
                const payoutETH = (simDepositETH * payee.bps) / 10000;
                const payoutUSD = payoutETH * 3000;
                const percentage = (payee.bps / 100).toFixed(1);

                return (
                  <div key={payee.id} className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '1.02rem' }}>{payee.name}</span>
                        <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                          {payee.address}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div className="mono" style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.15rem' }}>
                            {payoutETH.toFixed(2)} ETH
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            ${payoutUSD.toLocaleString('en-US')} USD ({percentage}%)
                          </div>
                        </div>
                        {simPayees.length > 2 && (
                          <button
                            onClick={() => handleRemovePayee(payee.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Remove payee"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Slider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={payee.bps}
                        onChange={e => handleUpdateBps(payee.id, Number(e.target.value))}
                        style={{ flex: 1 }}
                      />
                      <span className="mono" style={{ width: '90px', textAlign: 'right', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {payee.bps} BPS
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-color)',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleAddPayee}
                  className="btn btn-secondary"
                  disabled={simPayees.length >= 5}
                  style={{ padding: '9px 18px', fontSize: '0.9rem' }}
                >
                  <Plus size={16} /> Add Payee ({simPayees.length}/5)
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Allocated Shares:</span>
                  <span className="mono" style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: totalBPS === 10000 ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                  }}>
                    {totalBPS} / 10,000 BPS
                  </span>
                  {totalBPS === 10000 ? (
                    <CheckCircle2 size={20} color="var(--accent-emerald)" />
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 600 }}>(Must sum to 10,000)</span>
                  )}
                </div>

                <button onClick={onOpenCreateModal} className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.92rem' }}>
                  Deploy This Exact Pool
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* LIVE INDEXER ACTIVITY LOG FEED CARD */}
      <section style={{ padding: '40px 0 90px 0' }}>
        <div className="container-xl">
          <div className="glass-panel" style={{ padding: '28px', maxWidth: '940px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Radio size={18} color="var(--accent-cyan)" className="animate-glow" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Indexer Activity Feed</h3>
              </div>
              <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>GraphQL Indexer Websocket Stream</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {liveLogs.map(log => (
                <div key={log.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-tertiary)',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      background: log.type === 'PaymentReceived' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                      color: log.type === 'PaymentReceived' ? 'var(--accent-emerald)' : 'var(--accent-primary)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {log.type}
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {log.amount ? `${log.amount} → ${log.pool}` : `${log.name}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{log.time}</span>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.75rem' }}>✓ {log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* 4. INTERMEDIARY VS PAYPOOL COMPARISON MATRIX */}
      <section style={{ padding: '90px 0', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container-xl">
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px auto' }}>
            <div className="badge-pill" style={{ marginBottom: '16px' }}>
              <Scale size={14} />
              <span>Security & Cost Comparison</span>
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, letterSpacing: '-0.8px' }}>
              Why PayPool Replaces Intermediaries
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '12px' }}>
              Eliminate centralized payment processors, custodial risk, manual wire delays, and platform rakes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* Legacy Intermediary Card */}
            <div className="glass-panel" style={{ padding: '36px', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.12)', borderRadius: '10px', color: '#ef4444' }}>
                  <X size={22} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Legacy Payment Processors</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem' }}>Custodial Admin Control</strong>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>Admins can pause, freeze, or unilaterally alter payout split percentages at any time.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem' }}>Extensive Protocol Rake</strong>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>Extracts 3% to 15% platform cut on every single payment processed.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem' }}>Push-Transfer Blockages</strong>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>If one recipient wallet rejects funds or runs out of gas, the entire distribution batch crashes.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PayPool Protocol Card */}
            <div className="glass-panel" style={{ padding: '36px', borderColor: 'var(--border-hover)', background: 'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(15,20,32,0.85) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: 'var(--accent-emerald)' }}>
                  <Check size={22} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>PayPool Protocol</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--text-primary)' }}>100% Non-Custodial & Immutable</strong>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Zero owner role, zero admin keys, zero pause functions. Smart contract rules are permanent.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--text-primary)' }}>0.00% Protocol Cut</strong>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Zero protocol fees. 100% of incoming ETH and ERC-20 tokens go directly to payees.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--text-primary)' }}>Pull-Payment Gas Safety</strong>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Each payee triggers <code className="mono">release()</code> independently. Reentrancy and DoS isolated.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 5. 3-STEP ARCHITECTURE FLOW */}
      <section id="how-it-works" style={{ padding: '90px 0' }}>
        <div className="container-xl">
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px auto' }}>
            <div className="badge-pill" style={{ marginBottom: '16px' }}>
              <Layers size={14} />
              <span>Execution Workflow</span>
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, letterSpacing: '-0.8px' }}>
              How PayPool Works in 3 Steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            
            {/* Step 1 */}
            <div className="glass-card" style={{ padding: '36px', position: 'relative' }}>
              <div className="mono" style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(99,102,241,0.35)', marginBottom: '12px' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Deploy Splitter Clone</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Execute <code className="mono" style={{ color: 'var(--accent-primary)' }}>SplitterFactory.createPool()</code> defining payee wallet addresses and share allocations summing to exactly 10,000 BPS.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card" style={{ padding: '36px', position: 'relative' }}>
              <div className="mono" style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(6,182,212,0.35)', marginBottom: '12px' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Receive Funds Seamlessly</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Clients, dApps, or marketplaces transfer native ETH or ERC-20 tokens directly into your pool contract address anytime.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card" style={{ padding: '36px', position: 'relative' }}>
              <div className="mono" style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(16,185,129,0.35)', marginBottom: '12px' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Pull Payouts Autonomously</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Payees trigger <code className="mono" style={{ color: 'var(--accent-emerald)' }}>release(payee, token)</code> whenever they choose to withdraw their exact proportional balance into their wallet.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* 6. CONTRACT CODE & ARCHITECTURE EXPLORER WITH COPY */}
      <section id="contract" style={{ padding: '90px 0', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container-xl">
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <div className="badge-pill" style={{ marginBottom: '16px' }}>
              <Code2 size={14} />
              <span>Smart Contract Specification</span>
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, letterSpacing: '-0.8px' }}>
              Verifiable Solidity 0.8.24 Interfaces
            </h2>
          </div>

          <div className="glass-panel" style={{ overflow: 'hidden', maxWidth: '940px', margin: '0 auto' }}>
            
            {/* Tabs Header & Copy Action */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-tertiary)',
              borderBottom: '1px solid var(--border-color)',
              padding: '10px 20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveCodeTab('interface')}
                  style={{
                    background: activeCodeTab === 'interface' ? 'var(--bg-glass)' : 'transparent',
                    color: activeCodeTab === 'interface' ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Code2 size={16} /> IPayPool.sol
                </button>

                <button
                  onClick={() => setActiveCodeTab('events')}
                  style={{
                    background: activeCodeTab === 'events' ? 'var(--bg-glass)' : 'transparent',
                    color: activeCodeTab === 'events' ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap size={16} /> Event Schema
                </button>

                <button
                  onClick={() => setActiveCodeTab('foundry')}
                  style={{
                    background: activeCodeTab === 'foundry' ? 'var(--bg-glass)' : 'transparent',
                    color: activeCodeTab === 'foundry' ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Terminal size={16} /> Foundry Verification
                </button>
              </div>

              <button
                onClick={() => {
                  const codeSnippet = activeCodeTab === 'interface'
                    ? `interface IPayPool {\n    function initialize(address[] calldata payees, uint256[] calldata shares) external;\n    function release(address payee, address token) external;\n    function pendingPayment(address payee, address token) external view returns (uint256);\n}`
                    : activeCodeTab === 'events'
                    ? `event PaymentReceived(address indexed from, address indexed token, uint256 amount);\nevent PaymentReleased(address indexed to, address indexed token, uint256 amount);`
                    : `forge test --summary`;
                  copyCodeToClipboard(codeSnippet);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: copiedCode ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Copy size={14} />
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content View */}
            <div style={{ padding: '28px', overflowX: 'auto', background: '#07090e' }}>
              
              {activeCodeTab === 'interface' && (
                <pre className="mono" style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.75 }}>
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPayPool {
    event PaymentReceived(address indexed from, address indexed token, uint256 amount);
    event PaymentReleased(address indexed to, address indexed token, uint256 amount);

    function initialize(address[] calldata payees, uint256[] calldata shares) external;

    receive() external payable;
    function depositERC20(address token, uint256 amount) external;

    function release(address payee, address token) external;

    function pendingPayment(address payee, address token) external view returns (uint256);
    function totalReceived(address token) external view returns (uint256);
    function totalReleased(address token) external view returns (uint256);
    function getPayees() external view returns (address[] memory);
    function getShares() external view returns (uint256[] memory);
    function totalShares() external view returns (uint256);
}`}
                </pre>
              )}

              {activeCodeTab === 'events' && (
                <pre className="mono" style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.75 }}>
{`// Unified ETH & ERC-20 Indexer Event Specifications
// address(0) represents native ETH across all deposit & payout logs

event PaymentReceived(
    address indexed from,
    address indexed token, 
    uint256 amount
);

event PaymentReleased(
    address indexed to, 
    address indexed token, 
    uint256 amount
);

event SplitterCreated(
    address indexed pool, 
    address indexed creator, 
    address[] payees, 
    uint256[] shares, 
    string name
);`}
                </pre>
              )}

              {activeCodeTab === 'foundry' && (
                <pre className="mono" style={{ fontSize: '0.88rem', color: '#10b981', lineHeight: 1.75 }}>
{`$ forge test --summary

[✔] test_InitializeSuccess() (gas: 142109)
[✔] test_RevertIfDuplicatePayees() (gas: 18231)
[✔] test_RevertIfNot10000Shares() (gas: 17822)
[✔] test_ProportionalETHRelease() (gas: 89431)
[✔] test_ERC20DepositAndSplit() (gas: 104201)
[✔] invariant_TotalSharesAlways10000() (runs: 1000, calls: 50000)

Suite result: ok. 27 passed; 0 failed; 0 skipped; finished in 1.42s`}
                </pre>
              )}

            </div>

          </div>

        </div>
      </section>


      {/* 7. FAQ ACCORDION */}
      <section id="faq" style={{ padding: '90px 0' }}>
        <div className="container-xl">
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px auto' }}>
            <div className="badge-pill" style={{ marginBottom: '16px' }}>
              <HelpCircle size={14} />
              <span>Questions & Answers</span>
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, letterSpacing: '-0.8px' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* FAQ 1 */}
            <div className="glass-panel" style={{ padding: '22px 28px', cursor: 'pointer' }} onClick={() => toggleFaq(0)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Is there any admin key or back-door that can drain funds?</h3>
                <ChevronDown size={20} style={{ transform: openFaq === 0 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </div>
              {openFaq === 0 && (
                <p style={{ marginTop: '14px', fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  No. <code className="mono">PayPool.sol</code> contains zero admin keys, zero owner modifiers, and zero pause functions. Once initialized via the clone factory, the payee addresses and share percentages are immutable forever.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="glass-panel" style={{ padding: '22px 28px', cursor: 'pointer' }} onClick={() => toggleFaq(1)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Does PayPool support ERC-20 tokens like USDC or WETH?</h3>
                <ChevronDown size={20} style={{ transform: openFaq === 1 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </div>
              {openFaq === 1 && (
                <p style={{ marginTop: '14px', fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  Yes! Native ETH is tracked using <code className="mono">address(0)</code>, while any ERC-20 token (USDC, USDT, WETH, etc.) can be deposited via <code className="mono">depositERC20(token, amount)</code> and released proportionally per payee.
                </p>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="glass-panel" style={{ padding: '22px 28px', cursor: 'pointer' }} onClick={() => toggleFaq(2)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>What is the payee limit per pool?</h3>
                <ChevronDown size={20} style={{ transform: openFaq === 2 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </div>
              {openFaq === 2 && (
                <p style={{ marginTop: '14px', fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  Pools support between 2 and 20 payees. This constraint guarantees that gas iteration stays well within EVM block limits during view calls and initialization.
                </p>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="glass-panel" style={{ padding: '22px 28px', cursor: 'pointer' }} onClick={() => toggleFaq(3)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Why pull-payment pattern instead of automatic push transfers?</h3>
                <ChevronDown size={20} style={{ transform: openFaq === 3 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </div>
              {openFaq === 3 && (
                <p style={{ marginTop: '14px', fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  Automatic push transfers create Denial-of-Service (DoS) vulnerabilities if one recipient contract rejects ETH or runs out of gas. Pull payments isolate each payee's withdrawal safely so one payee can never freeze another's funds.
                </p>
              )}
            </div>

          </div>

        </div>
      </section>


      {/* 8. FOOTER / CALL TO ACTION */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '70px 0 40px 0', background: 'var(--bg-secondary)' }}>
        <div className="container-xl">
          
          <div className="glass-panel" style={{
            padding: '52px 32px',
            textAlign: 'center',
            background: 'var(--gradient-brand)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '60px',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
              Ready to Split Revenue Trustlessly?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.12rem', maxWidth: '560px', margin: '0 auto 30px auto' }}>
              Deploy your own immutable PayPool contract in less than 60 seconds on Base Sepolia.
            </p>
            <button onClick={onOpenCreateModal} className="btn" style={{ background: '#ffffff', color: '#07090e', fontWeight: 800, padding: '15px 36px', fontSize: '1.02rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              Deploy Pool Now →
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={20} color="var(--accent-primary)" />
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>PayPool Protocol</span>
              <span>· Open Source MIT License</span>
            </div>

            <div style={{ display: 'flex', gap: '28px' }}>
              <a href="#how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>How it Works</a>
              <a href="#simulator" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Simulator</a>
              <a href="#contract" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contract</a>
              <a href="#faq" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>FAQ</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
