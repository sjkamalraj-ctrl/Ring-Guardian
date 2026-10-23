import { useState, useEffect } from 'react';
import { Video, Maximize2, Zap, Eye, Activity } from 'lucide-react';
import type { RingDevice } from '../types/ring';

interface LiveViewProps {
  devices: RingDevice[];
}

const SCENES: Record<string, React.FC> = {
  'dev-doorbell': DrivewayScene,
  'dev-cam-back': GardenScene,
  'dev-cam-garage': GarageScene,
};

export function LiveView({ devices }: LiveViewProps) {
  const cameras = devices.filter(d => d.hasLiveView);
  const [selected, setSelected] = useState(cameras[0]?.id ?? '');
  const [motionActive, setMotionActive] = useState<Record<string, boolean>>({});
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate random motion events
  useEffect(() => {
    const t = setInterval(() => {
      const cam = cameras[Math.floor(Math.random() * cameras.length)];
      if (!cam) return;
      setMotionActive(prev => ({ ...prev, [cam.id]: true }));
      setTimeout(() => setMotionActive(prev => ({ ...prev, [cam.id]: false })), 3000);
    }, 8000);
    return () => clearInterval(t);
  }, [cameras]);

  const selectedDevice = cameras.find(c => c.id === selected) ?? cameras[0];
  const SceneBig = selectedDevice ? (SCENES[selectedDevice.id] ?? DrivewayScene) : DrivewayScene;

  return (
    <div className="content-area">
      <div className="live-view-layout">
        {/* Main feed */}
        <div className="live-main-feed card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="camera-feed" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 16 }}>
            <div className="camera-sim" style={{ background: getCameraBackground(selected) }}>
              <div className="night-vision-overlay" />
              <SceneBig />
              {motionActive[selected] && <MotionBox />}
            </div>
            <div className="camera-overlay" />
            <div className="recording-dot"><div className="rec-dot" /> LIVE</div>
            <p className="camera-name" style={{ fontSize: 14 }}>{selectedDevice?.name}</p>
            <div style={{ position: 'absolute', top: 8, right: 10, fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
              {timestamp.toLocaleTimeString()}
            </div>
            {motionActive[selected] && (
              <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: 'rgba(239,68,68,0.8)', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Activity size={11} /> MOTION DETECTED
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-primary" style={{ fontSize: 12 }}><Maximize2 size={13} /> Full Screen</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}><Zap size={13} /> Snapshot</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}><Eye size={13} /> Night Vision</button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Motion Sensitivity</span>
              <input
                type="range"
                min={1} max={10}
                defaultValue={selectedDevice?.motionSensitivity ?? 5}
                style={{ width: 80, accentColor: 'var(--ring-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Camera list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="section-title"><Video size={16} /> All Cameras</p>
          {cameras.map(cam => {
            const Scene = SCENES[cam.id] ?? DrivewayScene;
            return (
              <div
                key={cam.id}
                className={`camera-feed${selected === cam.id ? ' selected' : ''}`}
                style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', cursor: 'pointer', flexShrink: 0 }}
                onClick={() => setSelected(cam.id)}
              >
                <div className="camera-sim" style={{ background: getCameraBackground(cam.id) }}>
                  <div className="night-vision-overlay" />
                  <Scene />
                  {motionActive[cam.id] && (
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--danger)', borderRadius: 12, pointerEvents: 'none', animation: 'alertPulse 1s ease-in-out infinite' }} />
                  )}
                </div>
                <div className="camera-overlay" />
                {cam.isRecording && <div className="recording-dot"><div className="rec-dot" /> REC</div>}
                <p className="camera-name">{cam.name}</p>
                {motionActive[cam.id] && (
                  <div style={{ position: 'absolute', top: 6, right: 8, background: 'var(--danger)', color: 'white', fontSize: 9, padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>
                    MOTION
                  </div>
                )}
              </div>
            );
          })}

          {/* Motion zones */}
          {selectedDevice?.motionZones && (
            <div className="card">
              <p className="card-title" style={{ marginBottom: 12 }}>Motion Zones</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedDevice.motionZones.map(zone => (
                  <span key={zone} style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(0,180,216,0.1)', color: 'var(--ring-primary)', borderRadius: 20, border: '1px solid rgba(0,180,216,0.2)' }}>
                    ● {zone}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MotionBox() {
  return (
    <div style={{
      position: 'absolute',
      top: '20%', left: '30%',
      width: '25%', height: '40%',
      border: '2px solid var(--warning)',
      borderRadius: 4,
      animation: 'slideIn 0.3s ease',
      pointerEvents: 'none',
    }}>
      <div style={{ position: 'absolute', top: -18, left: 0, background: 'var(--warning)', color: '#000', fontSize: 9, padding: '2px 6px', fontWeight: 700 }}>
        PERSON
      </div>
    </div>
  );
}

function getCameraBackground(id: string) {
  const map: Record<string, string> = {
    'dev-doorbell': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'dev-cam-back': 'linear-gradient(135deg, #0d1b0d 0%, #1a2e1a 50%, #0d2b0d 100%)',
    'dev-cam-garage': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
  };
  return map[id] ?? '#111';
}

function DrivewayScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.65, position: 'absolute', inset: 0 }}>
      <rect width="640" height="360" fill="#0f1729" />
      <polygon points="180,360 460,360 360,180 280,180" fill="#1a2535" />
      <rect x="0" y="280" width="640" height="80" fill="#1a2535" />
      <rect x="280" y="180" width="80" height="100" fill="#243045" />
      <rect x="295" y="200" width="50" height="60" fill="#0a1520" />
      <rect x="310" y="220" width="20" height="40" fill="#091015" />
      <circle cx="80" cy="120" r="40" fill="rgba(255,255,200,0.06)" />
      <circle cx="560" cy="120" r="40" fill="rgba(255,255,200,0.06)" />
      <rect x="100" y="310" width="8" height="50" fill="#2a3545" />
      <ellipse cx="104" cy="312" rx="30" ry="8" fill="rgba(255,255,200,0.04)" />
    </svg>
  );
}

function GardenScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.55, position: 'absolute', inset: 0 }}>
      <rect width="640" height="360" fill="#0a1a0a" />
      <rect x="0" y="240" width="640" height="120" fill="#0f2010" />
      <ellipse cx="120" cy="240" rx="100" ry="120" fill="#0f2010" />
      <ellipse cx="320" cy="200" rx="80" ry="140" fill="#0a1a0a" />
      <ellipse cx="520" cy="230" rx="120" ry="110" fill="#0f2010" />
      <rect x="300" y="220" width="40" height="80" fill="#1a2a1a" />
      <ellipse cx="320" cy="215" rx="50" ry="30" fill="#0f2010" />
      <rect x="460" y="260" width="6" height="100" fill="#1a2a1a" />
      <ellipse cx="463" cy="256" rx="22" ry="22" fill="#0f2010" />
    </svg>
  );
}

function GarageScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.65, position: 'absolute', inset: 0 }}>
      <rect width="640" height="360" fill="#111" />
      <rect x="120" y="80" width="400" height="280" fill="#1a1a1a" />
      <rect x="120" y="80" width="400" height="20" fill="#2a2a2a" />
      {[110, 150, 190, 230, 270].map(y => (
        <line key={y} x1="120" x2="520" y1={y} y2={y} stroke="#2a2a2a" strokeWidth="2" />
      ))}
      <rect x="220" y="260" width="200" height="100" fill="#0d0d0d" />
      <rect x="240" y="200" width="70" height="60" fill="#080808" />
      <rect x="330" y="200" width="70" height="60" fill="#080808" />
    </svg>
  );
}
