import { Heart, AlertTriangle, Phone, CheckCircle, Activity, Clock, Sun, Moon, Zap } from 'lucide-react';
import type { WellnessAlert, ActivityEntry, Location } from '../types/ring';
import { formatDistanceToNow } from '../utils/time';

interface CaretakerModeProps {
  wellnessAlerts: WellnessAlert[];
  activityData: ActivityEntry[];
  location: Location;
  activeAlerts: WellnessAlert[];
  onToggleAlert: (id: string) => void;
  onDismissAlert: (id: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getHeatColor(count: number, max: number): string {
  if (count === 0) return 'rgba(255,255,255,0.04)';
  const ratio = count / max;
  if (ratio < 0.33) return `rgba(0,180,216,${0.2 + ratio * 0.4})`;
  if (ratio < 0.66) return `rgba(0,180,216,${0.4 + ratio * 0.4})`;
  return `rgba(0,180,216,${0.7 + ratio * 0.3})`;
}

export function CaretakerMode({ wellnessAlerts, activityData, location, activeAlerts, onToggleAlert, onDismissAlert }: CaretakerModeProps) {
  const maxActivity = Math.max(...activityData.map(d => d.count), 1);
  const todayActivity = activityData.filter(d => d.day === new Date().getDay());
  const totalToday = todayActivity.reduce((s, d) => s + d.count, 0);

  const lastMotionEntry = activityData
    .filter(d => d.count > 0)
    .sort((a, b) => b.hour - a.hour)[0];

  return (
    <div className="content-area">
      {/* Triggered alerts */}
      {activeAlerts.length > 0 && (
        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activeAlerts.map(alert => (
            <div key={alert.id} className="alert-banner">
              <AlertTriangle size={20} color="var(--warning)" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: 'var(--warning)', fontSize: 14 }}>⚠ {alert.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Triggered {alert.lastTriggered ? formatDistanceToNow(alert.lastTriggered) : 'recently'} ·
                  Contacts notified: {alert.contacts.join(', ')}
                </p>
              </div>
              <button className="btn btn-ghost" style={{ fontSize: 12, flexShrink: 0 }} onClick={() => onDismissAlert(alert.id)}>
                <CheckCircle size={13} /> Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="caretaker-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Occupant Status */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,180,216,0.08), rgba(124,58,237,0.08))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ring-primary), var(--ring-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                👩‍🦳
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{location.occupantName}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{location.address}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                  <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Active — last seen today</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { Icon: Activity, label: 'Events Today', value: totalToday, color: 'var(--ring-primary)' },
                { Icon: Sun, label: 'Morning Activity', value: lastMotionEntry?.hour ? `${lastMotionEntry.hour}:00` : '—', color: 'var(--warning)' },
                { Icon: Heart, label: 'Wellness Score', value: activeAlerts.length === 0 ? 'Good' : 'Check', color: activeAlerts.length === 0 ? 'var(--success)' : 'var(--warning)' },
              ].map(({ Icon, label, value, color }) => (
                <div key={label} style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
                  <Icon size={18} color={color} style={{ marginBottom: 6 }} />
                  <p style={{ fontSize: 18, fontWeight: 700, color }}>{value}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="card">
            <div className="card-header">
              <p className="card-title"><Activity size={14} style={{ display: 'inline', marginRight: 6 }} />7-Day Activity Heatmap</p>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ring motion events by hour</span>
            </div>
            <HeatmapGrid data={activityData} maxCount={maxActivity} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Less</span>
              {[0, 0.2, 0.4, 0.7, 1].map(v => (
                <div key={v} style={{ width: 14, height: 14, borderRadius: 3, background: getHeatColor(v * maxActivity, maxActivity) }} />
              ))}
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>More</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Wellness Alerts */}
          <div className="card">
            <p className="card-title" style={{ marginBottom: 16 }}>
              <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6 }} />
              Wellness Monitors
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {wellnessAlerts.map(alert => (
                <WellnessAlertCard key={alert.id} alert={alert} onToggle={() => onToggleAlert(alert.id)} onDismiss={() => onDismissAlert(alert.id)} />
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="card">
            <p className="card-title" style={{ marginBottom: 16 }}>
              <Phone size={14} style={{ display: 'inline', marginRight: 6 }} />
              Emergency Contacts
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {location.emergencyContacts.map((contact, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ring-primary), var(--ring-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    {i === 0 ? '👩' : '👨‍⚕️'}
                  </div>
                  <p style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{contact}</p>
                  <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>
                    <Phone size={11} /> Call
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Unlock */}
          <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' }}>
            <p className="card-title" style={{ marginBottom: 8, color: 'var(--danger)' }}>
              <Zap size={14} style={{ display: 'inline', marginRight: 6 }} />
              Emergency Actions
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
              Use only in emergencies. All actions are logged.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-danger" style={{ justifyContent: 'center' }}>
                🔓 Emergency Unlock (All Doors)
              </button>
              <button className="btn btn-ghost" style={{ justifyContent: 'center', borderColor: 'rgba(239,68,68,0.2)' }}>
                📞 Call Emergency Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatmapGrid({ data, maxCount }: { data: ActivityEntry[]; maxCount: number }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(24, 1fr)', gap: 3, minWidth: 500 }}>
        {/* Hour labels */}
        <div />
        {hours.map(h => (
          <div key={h} style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 4 }}>
            {h % 6 === 0 ? `${h}h` : ''}
          </div>
        ))}
        {/* Day rows */}
        {DAYS.map((day, d) => (
          <div key={day} style={{ display: 'contents' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
              {day}
            </div>
            {hours.map(h => {
              const entry = data.find(e => e.day === d && e.hour === h);
              const count = entry?.count ?? 0;
              return (
                <div
                  key={`${d}-${h}`}
                  title={`${day} ${h}:00 — ${count} events`}
                  style={{
                    height: 22,
                    borderRadius: 4,
                    background: getHeatColor(count, maxCount),
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.3)'; (e.target as HTMLElement).style.zIndex = '10'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; (e.target as HTMLElement).style.zIndex = '1'; }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function WellnessAlertCard({ alert, onToggle, onDismiss }: { alert: WellnessAlert; onToggle: () => void; onDismiss: () => void }) {
  const icons: Record<string, React.ElementType> = {
    no_motion: Moon,
    unusual_activity: Activity,
    door_open: Clock,
  };
  const Icon = icons[alert.type] ?? AlertTriangle;

  return (
    <div className={`wellness-card${alert.triggered && alert.enabled ? ' triggered' : ''}`}>
      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: alert.triggered ? 'rgba(245,158,11,0.2)' : 'var(--bg-elevated)', flexShrink: 0 }}>
        <Icon size={17} color={alert.triggered ? 'var(--warning)' : 'var(--text-muted)'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{alert.name}</p>
          {alert.triggered && alert.enabled && (
            <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.2)', color: 'var(--warning)', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>TRIGGERED</span>
          )}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          After {alert.threshold} {alert.unit} · {alert.contacts.length} contact{alert.contacts.length > 1 ? 's' : ''}
        </p>
        {alert.triggered && alert.lastTriggered && (
          <button style={{ fontSize: 11, color: 'var(--warning)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 3 }} onClick={onDismiss}>
            <CheckCircle size={11} style={{ display: 'inline', marginRight: 3 }} />
            Dismiss alert
          </button>
        )}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={alert.enabled} onChange={onToggle} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}
