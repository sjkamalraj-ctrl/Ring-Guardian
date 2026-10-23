import { Bell, Video, Lock, Shield, Wifi, Battery, RefreshCw } from 'lucide-react';
import type { RingDevice } from '../types/ring';
import { formatDistanceToNow } from '../utils/time';

interface DevicesViewProps {
  devices: RingDevice[];
  location: { name: string; address: string };
}

const DEVICE_CONFIG: Record<string, { Icon: React.ElementType; color: string; label: string }> = {
  doorbell: { Icon: Bell, color: 'var(--ring-primary)', label: 'Video Doorbell' },
  camera: { Icon: Video, color: 'var(--ring-secondary)', label: 'Security Camera' },
  lock: { Icon: Lock, color: 'var(--success)', label: 'Smart Lock' },
  base_station: { Icon: Shield, color: 'var(--warning)', label: 'Alarm Base Station' },
  chime: { Icon: Bell, color: 'var(--text-muted)', label: 'Ring Chime' },
};

export function DevicesView({ devices, location }: DevicesViewProps) {
  return (
    <div className="content-area">
      {/* Location header */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg, rgba(0,180,216,0.08), rgba(124,58,237,0.06))' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, var(--ring-primary), var(--ring-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🏠
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{location.name}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{location.address}</p>
        </div>
        <div style={{ display: 'flex', gap: 16, textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{devices.filter(d => d.status === 'online').length}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Online</p>
          </div>
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{devices.length}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total</p>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 12 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {devices.map(device => <DeviceDetailCard key={device.id} device={device} />)}
      </div>
    </div>
  );
}

function SignalBars({ level }: { level: number }) {
  return (
    <span className="signal-bars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`signal-bar${i <= level ? ' active' : ''}`} />
      ))}
    </span>
  );
}

function DeviceDetailCard({ device }: { device: RingDevice }) {
  const config = DEVICE_CONFIG[device.type] ?? { Icon: Wifi, color: 'var(--text-muted)', label: device.type };
  const { Icon } = config;

  return (
    <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${config.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={config.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{device.name}</p>
          <span className={`status-dot ${device.status}`} />
          <span style={{ fontSize: 11, color: device.status === 'online' ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
            {device.status}
          </span>
          {device.lockState && (
            <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 10, background: device.lockState === 'locked' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: device.lockState === 'locked' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
              {device.lockState}
            </span>
          )}
          {device.isRecording && (
            <span style={{ fontSize: 10, padding: '1px 8px', borderRadius: 10, background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--danger)', animation: 'blink 1s infinite' }} />
              REC
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{config.label}</p>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Firmware</p>
            <p style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'monospace' }}>v{device.firmware}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Signal</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <SignalBars level={device.signal} />
              <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{device.signal}/5</span>
            </div>
          </div>
          {device.battery !== undefined && (
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Battery</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Battery size={13} color={device.battery < 25 ? 'var(--danger)' : device.battery < 50 ? 'var(--warning)' : 'var(--success)'} />
                <span style={{ fontSize: 12, color: device.battery < 25 ? 'var(--danger)' : 'var(--text-primary)', fontWeight: device.battery < 25 ? 700 : 400 }}>
                  {device.battery}%
                </span>
                <div style={{ width: 60, height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${device.battery}%`, borderRadius: 2, background: device.battery < 25 ? 'var(--danger)' : device.battery < 50 ? 'var(--warning)' : 'var(--success)', transition: 'width 0.5s' }} />
                </div>
              </div>
            </div>
          )}
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Last Seen</p>
            <p style={{ fontSize: 12, color: 'var(--text-primary)' }}>{formatDistanceToNow(device.lastSeen)}</p>
          </div>
          {device.motionZones && (
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Motion Zones</p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {device.motionZones.map(z => (
                  <span key={z} style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(0,180,216,0.1)', color: 'var(--ring-primary)', borderRadius: 20 }}>{z}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>Settings</button>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>Test</button>
      </div>
    </div>
  );
}
