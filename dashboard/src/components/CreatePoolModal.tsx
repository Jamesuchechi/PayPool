import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [payees, setPayees] = useState([
    { address: '', shares: 5000 },
    { address: '', shares: 5000 }
  ]);

  if (!isOpen) return null;

  const handleAddPayee = () => {
    if (payees.length < 20) {
      setPayees([...payees, { address: '', shares: 0 }]);
    }
  };

  const handleRemovePayee = (index: number) => {
    if (payees.length > 2) {
      setPayees(payees.filter((_, i) => i !== index));
    }
  };

  const totalShares = payees.reduce((acc, curr) => acc + (Number(curr.shares) || 0), 0);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Deploy Revenue Pool</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Pool Name
            </label>
            <input
              id="input-pool-name"
              type="text"
              placeholder="e.g. Creator Royalties Pool"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Payees & Shares (Total: {totalShares} / 10,000 basis points)
              </label>
              {payees.length < 20 && (
                <button
                  type="button"
                  onClick={handleAddPayee}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} /> Add Payee
                </button>
              )}
            </div>

            {payees.map((payee, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="0x..."
                  value={payee.address}
                  onChange={(e) => {
                    const newPayees = [...payees];
                    newPayees[idx].address = e.target.value;
                    setPayees(newPayees);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <input
                  type="number"
                  placeholder="Shares (bps)"
                  value={payee.shares}
                  onChange={(e) => {
                    const newPayees = [...payees];
                    newPayees[idx].shares = Number(e.target.value);
                    setPayees(newPayees);
                  }}
                  style={{
                    width: '120px',
                    padding: '10px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                {payees.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePayee(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 8px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button id="btn-submit-pool" type="submit" className="btn btn-primary" disabled={totalShares !== 10000}>
              Deploy Pool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
