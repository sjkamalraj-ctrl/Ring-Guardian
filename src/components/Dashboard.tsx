import { Activity, Bell, Lock, Shield, Wifi, Video, Battery, AlertTriangle, ChevronRight } from 'lucide-react';
import type { RingDevice, RingEvent, WellnessAlert } from '../types/ring';
import { formatDistanceToNow } from '../utils/time';

interface DashboardProps {
  devices: RingDevice[];
  events: RingEvent[];
  wellnessAlerts: WellnessAlert[];
  onlineDevices: number;
  todayEventCount: number;
  isLocked: boolean;
  activeAlerts: WellnessAlert[];
  onToggleLock: (id: string) => void;
  onNavigate: (v: string) => void;
}

const EVENT_ICON: Record<string, React.ElementType> = {
  motion: Activity,
  ding: Bell,
  lock: Lock,
  unlock: Lock,
  alarm: AlertTriangle,
  wellness_alert: AlertTriangle,
  low_battery: Battery,
};

function SignalBars({ level }: { level: number }) {
  return (
    <span className="signal-bars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`signal-bar${i <= level ? ' active' : ''}`} style={{ height: `${i * 20}%` }} />
      ))}
    </span>
  );
}

export function Dashboard({ devices, events, wellnessAlerts, onlineDevices, todayEventCount, isLocked, activeAlerts, onToggleLock, onNavigate }: DashboardProps) {
  const lockDevice = devices.find(d => d.type === 'lock');
  const cameraDevices = devices.filter(d => d.type === 'camera' || d.type === 'doorbell');
  const recentEvents = events.slice(0, 8);
  const lowBattery = devices.filter(d => (d.battery ?? 100) < 25);

  return (
    <div className="content-area bg-animated">
      {/* Alert Banner */}
      {activeAlerts.length > 0 && (
        <div className="alert-banner" style={{ marginBottom: 20 }}>
          <AlertTriangle size={18} color="var(--warning)" />
          <div style={{ flex: 1 }}>
            <strong style={{ color: 'var(--warning)', fontSize: 13 }}>
              {activeAlerts.length} wellness alert{activeAlerts.length > 1 ? 's' : ''} triggered
            </strong>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {activeAlerts.map(a => a.name).join(', ')}
            </p>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => onNavigate('caretaker')}>
            Review <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><Wifi size={20} /></div>
          <div>
            <p className="stat-label">Devices Online</p>
            <p className="stat-value">{onlineDevices}<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/{devices.length}</span></p>
            <p className="stat-sub">All systems operational</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`stat-icon ${isLocked ? 'success' : 'danger'}`}>
            <Lock size={20} />
          </div>
          <div>
            <p className="stat-label">Front Door Lock</p>
            <p className="stat-value" style={{ color: isLocked ? 'var(--success)' : 'var(--danger)', fontSize: 20 }}>
              {isLocked ? 'Secured' : 'Open'}
            </p>
            <p className="stat-sub">
              {lockDevice ? (
                <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => lockDevice && onToggleLock(lockDevice.id)}>
                  {isLocked ? 'Unlock' : 'Lock'} now
                </button>
              ) : 'No lock found'}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Bell size={20} /></div>
          <div>
            <p className="stat-label">Events Today</p>
            <p className="stat-value">{todayEventCount}</p>
            <p className="stat-sub">motion, dings & access</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`stat-icon ${activeAlerts.length > 0 ? 'warning' : 'success'}`}>
            <Shield size={20} />
          </div>
          <div>
            <p className="stat-label">Caretaker Status</p>
            <p className="stat-value" style={{ fontSize: 18, color: activeAlerts.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
              {activeAlerts.length > 0 ? 'Alert!' : 'Normal'}
            </p>
            <p className="stat-sub">{wellnessAlerts.filter(a => a.enabled).length} monitors active</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Low battery warning */}
          {lowBattery.length > 0 && (
            <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
              <div className="card-header">
                <p className="card-title" style={{ color: 'var(--warning)' }}>
                  <Battery size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Low Battery Warning
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {lowBattery.map(d => (
                  <span key={d.id} style={{ fontSize: 12, color: 'var(--warning)', background: 'rgba(245,158,11,0.1)', padding: '4px 10px', borderRadius: 20 }}>
                    {d.name} — {d.battery}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Camera Previews */}
          <div className="card">
            <div className="card-header">
              <p className="card-title"><Video size={14} style={{ display: 'inline', marginRight: 6 }} />Camera Overview</p>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => onNavigate('live')}>
                Live View <ChevronRight size={13} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {cameraDevices.map(cam => (
                <CameraThumb key={cam.id} device={cam} onClick={() => onNavigate('live')} />
              ))}
            </div>
          </div>

          {/* Devices */}
          <div className="card">
            <div className="card-header">
              <p className="card-title">All Devices</p>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => onNavigate('devices')}>
                Manage <ChevronRight size={13} />
              </button>
            </div>
            <div className="devices-grid">
              {devices.map(d => <DeviceRow key={d.id} device={d} />)}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quick Lock Control */}
          {lockDevice && (
            <div className="card" style={{ textAlign: 'center' }}>
              <p className="card-title" style={{ marginBottom: 20 }}>Front Door</p>
              <div
                className={`lock-circle ${lockDevice.lockState === 'locked' ? 'locked' : 'unlocked'}`}
                style={{ margin: '0 auto' }}
                onClick={() => onToggleLock(lockDevice.id)}
                role="button"
                aria-label={`${lockDevice.lockState === 'locked' ? 'Unlock' : 'Lock'} front door`}
              >
                <div className="lock-ring-outer" />
                <div>
                  <Lock size={40} color={lockDevice.lockState === 'locked' ? 'var(--success)' : 'var(--danger)'} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: lockDevice.lockState === 'locked' ? 'var(--success)' : 'var(--danger)', marginTop: 8 }}>
                    {lockDevice.lockState === 'locked' ? 'LOCKED' : 'UNLOCKED'}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>Tap to {lockDevice.lockState === 'locked' ? 'unlock' : 'lock'}</p>
            </div>
          )}

          {/* Live Events Feed */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <p className="card-title">Live Events</p>
              <span className="live-badge">● LIVE</span>
            </div>
            <div className="event-feed">
              {recentEvents.map(evt => {
                const Icon = EVENT_ICON[evt.type] ?? Bell;
                return (
                  <div key={evt.id} className="event-item">
                    <div className={`event-icon ${evt.type}`}>
                      <Icon size={14} />
                    </div>
                    <div className="event-text">
                      <p className="event-title">{evt.deviceName}</p>
                      <p className="event-detail">{evt.details}</p>
                    </div>
                    <p className="event-time">{formatDistanceToNow(evt.timestamp)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CameraThumb({ device, onClick }: { device: RingDevice; onClick: () => void }) {
  return (
    <div className="camera-feed" style={{ aspectRatio: '16/9', cursor: 'pointer' }} onClick={onClick}>
      <CameraSimulation deviceId={device.id} />
      <div className="camera-overlay" />
      {device.isRecording && (
        <div className="recording-dot"><div className="rec-dot" /> REC</div>
      )}
      <p className="camera-name">{device.name}</p>
    </div>
  );
}

function CameraSimulation({ deviceId }: { deviceId: string }) {
  const colors: Record<string, string> = {
    'dev-doorbell': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'dev-cam-back': 'linear-gradient(135deg, #0d1b0d 0%, #1a2e1a 50%, #0d2b0d 100%)',
    'dev-cam-garage': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
  };
  return (
    <div className="camera-sim" style={{ background: colors[deviceId] ?? '#111' }}>
      <div className="night-vision-overlay" />
      <div className="camera-scene">
        <div className="camera-timestamp" style={{ position: 'absolute', top: 6, right: 8, fontSize: 9, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
          {new Date().toLocaleTimeString()}
        </div>
        {deviceId === 'dev-doorbell' && <DrivewayScene />}
        {deviceId === 'dev-cam-back' && <GardenScene />}
        {deviceId === 'dev-cam-garage' && <GarageScene />}
      </div>
    </div>
  );
}

function DrivewayScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.6 }}>
      <rect width="320" height="180" fill="#0f1729" />
      <polygon points="100,180 220,180 180,90 140,90" fill="#1a2535" />
      <rect x="0" y="140" width="320" height="40" fill="#1a2535" />
      <rect x="140" y="90" width="40" height="50" fill="#243045" />
      <rect x="150" y="100" width="20" height="30" fill="#0a1520" />
      <circle cx="40" cy="60" r="20" fill="rgba(255,255,200,0.08)" />
      <circle cx="280" cy="60" r="20" fill="rgba(255,255,200,0.08)" />
    </svg>
  );
}

function GardenScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.5 }}>
      <rect width="320" height="180" fill="#0a1a0a" />
      <rect x="0" y="120" width="320" height="60" fill="#0f2010" />
      <ellipse cx="80" cy="120" rx="50" ry="60" fill="#0f2010" />
      <ellipse cx="160" cy="100" rx="40" ry="70" fill="#0a1a0a" />
      <ellipse cx="250" cy="115" rx="60" ry="55" fill="#0f2010" />
      <rect x="150" y="110" width="20" height="40" fill="#1a2a1a" />
    </svg>
  );
}

function GarageScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.6 }}>
      <rect width="320" height="180" fill="#111" />
      <rect x="60" y="40" width="200" height="140" fill="#1a1a1a" />
      <rect x="60" y="40" width="200" height="10" fill="#2a2a2a" />
      <line x1="60" x2="260" y1="70" y2="70" stroke="#2a2a2a" strokeWidth="2" />
      <line x1="60" x2="260" y1="100" y2="100" stroke="#2a2a2a" strokeWidth="2" />
      <line x1="60" x2="260" y1="130" y2="130" stroke="#2a2a2a" strokeWidth="2" />
    </svg>
  );
}

function DeviceRow({ device }: { device: RingDevice }) {
  const iconMap: Record<string, React.ElementType> = { doorbell: Bell, camera: Video, lock: Lock, base_station: Shield, chime: Bell };
  const Icon = iconMap[device.type] ?? Wifi;
  const colorMap: Record<string, string> = {
    doorbell: 'var(--ring-primary)', camera: 'var(--ring-secondary)',
    lock: 'var(--success)', base_station: 'var(--warning)', chime: 'var(--text-muted)',
  };

  return (
    <div className="device-card">
      <div className="device-card-header">
        <div className="device-icon-wrap" style={{ background: `${colorMap[device.type]}20` }}>
          <Icon size={18} color={colorMap[device.type]} />
        </div>
        <span className={`status-dot ${device.status}`} />
      </div>
      <p className="device-name">{device.name}</p>
      <p className="device-type-label">{device.type.replace('_', ' ')}</p>
      <div className="device-meta">
        <span className="device-meta-item"><SignalBars level={device.signal} /></span>
        {device.battery !== undefined && (
          <span className="device-meta-item">
            <Battery size={11} />
            <span style={{ color: device.battery < 25 ? 'var(--warning)' : 'var(--text-muted)' }}>{device.battery}%</span>
          </span>
        )}
        {device.lockState && (
          <span className="device-meta-item" style={{ color: device.lockState === 'locked' ? 'var(--success)' : 'var(--danger)' }}>
            <Lock size={11} /> {device.lockState}
          </span>
        )}
      </div>
      {device.battery !== undefined && (
        <div className="battery-bar" style={{ marginTop: 8 }}>
          <div className="battery-fill" style={{
            width: `${device.battery}%`,
            background: device.battery > 50 ? 'var(--success)' : device.battery > 25 ? 'var(--warning)' : 'var(--danger)',
          }} />
        </div>
      )}
    </div>
  );
}
