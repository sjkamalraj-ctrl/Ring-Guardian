import { LayoutDashboard, Video, Shield, Heart, Bell, Cpu, Wifi, ChevronRight } from 'lucide-react';
import type { View } from '../types/ring';

interface SidebarProps {
  currentView: View;
  onViewChange: (v: View) => void;
  onlineDevices: number;
  totalDevices: number;
  activeAlerts: number;
  isConnected: boolean;
}

const NAV: { id: View; Icon: React.ElementType; label: string; badge?: 'alerts' }[] = [
  { id: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'live', Icon: Video, label: 'Live View' },
  { id: 'access', Icon: Shield, label: 'Access Control' },
  { id: 'caretaker', Icon: Heart, label: 'Caretaker Mode', badge: 'alerts' },
  { id: 'events', Icon: Bell, label: 'Event Log' },
  { id: 'devices', Icon: Cpu, label: 'Devices' },
];

export function Sidebar({ currentView, onViewChange, onlineDevices, totalDevices, activeAlerts, isConnected }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <div className="logo-ring" />
        </div>
        <div className="sidebar-brand-text">
          <p className="sidebar-title">Ring Guardian</p>
          <p className="sidebar-subtitle">Home Safety Hub</p>
        </div>
      </div>

      <div className="sidebar-status">
        <span className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
          <Wifi size={11} />
          {isConnected ? 'Connected' : 'Offline'}
        </span>
        <span className="device-count">{onlineDevices}/{totalDevices} online</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, Icon, label, badge }) => {
          const active = currentView === id;
          const count = badge === 'alerts' ? activeAlerts : 0;
          return (
            <button key={id} className={`nav-item${active ? ' active' : ''}`} onClick={() => onViewChange(id)}>
              <Icon size={18} />
              <span className="nav-label">{label}</span>
              {count > 0 && <span className="nav-badge">{count}</span>}
              {active && <ChevronRight size={13} className="nav-chevron" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="api-status">
          <div className="api-dot" />
          <span>Ring API Simulator v3.5.2</span>
        </div>
      </div>
    </aside>
  );
}
