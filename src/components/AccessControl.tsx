import { useState } from 'react';
import { Lock, Unlock, Key, Clock, Plus, Trash2, Check, AlertCircle, Shield } from 'lucide-react';
import type { RingDevice, AccessCode } from '../types/ring';
import { formatDistanceToNow } from '../utils/time';

interface AccessControlProps {
  devices: RingDevice[];
  accessCodes: AccessCode[];
  isLocked: boolean;
  onToggleLock: (id: string) => void;
  onToggleCode: (id: string) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AccessControl({ devices, accessCodes, isLocked, onToggleLock, onToggleCode }: AccessControlProps) {
  const lockDevice = devices.find(d => d.type === 'lock');
  const [showAddCode, setShowAddCode] = useState(false);
  const [newCodeName, setNewCodeName] = useState('');
  const [lockHistory] = useState([
    { action: 'locked', by: 'Margaret', time: new Date(Date.now() - 3_600_000) },
    { action: 'unlocked', by: 'Jane (Daughter)', time: new Date(Date.now() - 7_200_000) },
    { action: 'unlocked', by: 'Home Nurse (code)', time: new Date(Date.now() - 28_800_000) },
    { action: 'locked', by: 'Auto-lock (10 PM)', time: new Date(Date.now() - 32_400_000) },
    { action: 'unlocked', by: 'Margaret', time: new Date(Date.now() - 50_000_000) },
  ]);

  return (
    <div className="content-area">
      <div className="access-layout">
        {/* Left: Lock Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Smart Lock Panel */}
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <p className="card-title" style={{ marginBottom: 4 }}>Smart Lock Control</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 28 }}>
              {lockDevice?.name ?? 'Front Door Lock'} · Firmware {lockDevice?.firmware}
            </p>

            {lockDevice ? (
              <>
                <div
                  className={`lock-circle ${isLocked ? 'locked' : 'unlocked'}`}
                  style={{ margin: '0 auto', cursor: 'pointer' }}
                  onClick={() => onToggleLock(lockDevice.id)}
                  role="button"
                  aria-label={isLocked ? 'Unlock door' : 'Lock door'}
                >
                  <div className="lock-ring-outer" />
                  <div>
                    {isLocked
                      ? <Lock size={48} color="var(--success)" />
                      : <Unlock size={48} color="var(--danger)" />
                    }
                    <p style={{ fontSize: 14, fontWeight: 700, marginTop: 10, color: isLocked ? 'var(--success)' : 'var(--danger)' }}>
                      {isLocked ? 'SECURED' : 'UNLOCKED'}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
                  Tap to {isLocked ? 'unlock' : 'lock'} the door
                </p>

                <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'center' }}>
                  <button className={`btn ${isLocked ? 'btn-danger' : 'btn-primary'}`} onClick={() => onToggleLock(lockDevice.id)}>
                    {isLocked ? <><Unlock size={14} /> Unlock</> : <><Lock size={14} /> Lock</>}
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <AlertCircle size={32} />
                <p>No smart lock found</p>
              </div>
            )}
          </div>

          {/* Lock History */}
          <div className="card">
            <p className="card-title" style={{ marginBottom: 16 }}>
              <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
              Recent Access History
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lockHistory.map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < lockHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: entry.action === 'locked' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
                    {entry.action === 'locked'
                      ? <Lock size={13} color="var(--success)" />
                      : <Unlock size={13} color="var(--danger)" />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{entry.by}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{entry.action}</p>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDistanceToNow(entry.time)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Access Codes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <p className="card-title">
                <Key size={14} style={{ display: 'inline', marginRight: 6 }} />
                Access Codes
                <span className="section-badge" style={{ marginLeft: 8 }}>{accessCodes.filter(c => c.enabled).length} active</span>
              </p>
              <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setShowAddCode(!showAddCode)}>
                <Plus size={13} /> Add Code
              </button>
            </div>

            {showAddCode && (
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <input
                  type="text"
                  placeholder="Name (e.g. Dog Walker)"
                  value={newCodeName}
                  onChange={e => setNewCodeName(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, outline: 'none', marginBottom: 8 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ fontSize: 12, flex: 1 }}><Check size={13} /> Create Code</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setShowAddCode(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {accessCodes.map(code => (
                <AccessCodeCard key={code.id} code={code} onToggle={() => onToggleCode(code.id)} />
              ))}
            </div>
          </div>

          {/* Auto-lock schedule */}
          <div className="card">
            <div className="card-header">
              <p className="card-title">
                <Shield size={14} style={{ display: 'inline', marginRight: 6 }} />
                Auto-Lock Schedule
              </p>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Lock at night', time: '10:00 PM', active: true },
                { label: 'Lock after unlock', duration: '5 min', active: true },
                { label: 'Morning unlock', time: '7:30 AM', active: false },
              ].map((rule, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{rule.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rule.time ?? rule.duration}</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked={rule.active} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessCodeCard({ code, onToggle }: { code: AccessCode; onToggle: () => void }) {
  const isExpired = code.validUntil && code.validUntil < new Date();

  return (
    <div className={`code-card${!code.enabled ? ' disabled' : ''}`}>
      <div style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', flexShrink: 0 }}>
        <Key size={16} color="var(--text-secondary)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{code.name}</p>
          <span className={`code-tag ${code.type}`}>{code.type}</span>
          {isExpired && <span style={{ fontSize: 10, color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '1px 6px', borderRadius: 10 }}>Expired</span>}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Used {code.usageCount}× </span>
          {code.lastUsed && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· Last {formatDistanceToNow(code.lastUsed)}</span>}
          {code.schedule && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              · {code.schedule.days.map(d => DAY_NAMES[d]).join(', ')} {code.schedule.startTime}–{code.schedule.endTime}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <label className="toggle">
          <input type="checkbox" checked={code.enabled} onChange={onToggle} />
          <span className="toggle-slider" />
        </label>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
