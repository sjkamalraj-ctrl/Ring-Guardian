import { useRingSimulator } from './hooks/useRingSimulator';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LiveView } from './components/LiveView';
import { AccessControl } from './components/AccessControl';
import { CaretakerMode } from './components/CaretakerMode';
import { EventLog } from './components/EventLog';
import { DevicesView } from './components/DevicesView';
import { useState } from 'react';
import type { View } from './types/ring';
import './App.css';

const VIEW_TITLES: Record<View, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: "Mom's Home — Overview" },
  live: { title: 'Live View', sub: 'Real-time camera feeds' },
  access: { title: 'Access Control', sub: 'Smart lock & entry management' },
  caretaker: { title: 'Caretaker Mode', sub: 'Wellness monitoring & alerts' },
  events: { title: 'Event Log', sub: 'Motion, doorbell & access history' },
  devices: { title: 'Devices', sub: 'All Ring devices in this location' },
};

function App() {
  const [view, setView] = useState<View>('dashboard');
  const sim = useRingSimulator();
  const { title, sub } = VIEW_TITLES[view];

  return (
    <div className="app-layout">
      <Sidebar
        currentView={view}
        onViewChange={setView}
        onlineDevices={sim.onlineDevices}
        totalDevices={sim.devices.length}
        activeAlerts={sim.activeAlerts.length}
        isConnected={sim.isConnected}
      />

      <main className="main-content">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>{title}</h2>
            <p>{sub}</p>
          </div>
          <div className="topbar-right">
            {sim.activeAlerts.length > 0 && (
              <button
                className="btn btn-ghost"
                style={{ borderColor: 'rgba(245,158,11,0.4)', color: 'var(--warning)', fontSize: 12 }}
                onClick={() => setView('caretaker')}
              >
                ⚠ {sim.activeAlerts.length} Active Alert{sim.activeAlerts.length > 1 ? 's' : ''}
              </button>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
              <div style={{ color: sim.isLocked ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                {sim.isLocked ? '🔒 Secured' : '🔓 Unlocked'}
              </div>
              <div>Front Door</div>
            </div>
          </div>
        </div>

        {view === 'dashboard' && (
          <Dashboard
            devices={sim.devices}
            events={sim.events}
            wellnessAlerts={sim.wellnessAlerts}
            onlineDevices={sim.onlineDevices}
            todayEventCount={sim.todayEventCount}
            isLocked={sim.isLocked}
            activeAlerts={sim.activeAlerts}
            onToggleLock={sim.toggleLock}
            onNavigate={v => setView(v as View)}
          />
        )}
        {view === 'live' && (
          <LiveView devices={sim.devices} />
        )}
        {view === 'access' && (
          <AccessControl
            devices={sim.devices}
            accessCodes={sim.accessCodes}
            isLocked={sim.isLocked}
            onToggleLock={sim.toggleLock}
            onToggleCode={sim.toggleCode}
          />
        )}
        {view === 'caretaker' && (
          <CaretakerMode
            wellnessAlerts={sim.wellnessAlerts}
            activityData={sim.activityData}
            location={sim.location}
            activeAlerts={sim.activeAlerts}
            onToggleAlert={sim.toggleWellnessAlert}
            onDismissAlert={sim.dismissWellnessAlert}
          />
        )}
        {view === 'events' && (
          <EventLog
            events={sim.events}
            onMarkResolved={sim.markEventResolved}
          />
        )}
        {view === 'devices' && (
          <DevicesView
            devices={sim.devices}
            location={sim.location}
          />
        )}
      </main>
    </div>
  );
}

export default App;
