import { useState, useEffect, useCallback } from 'react';
import type { RingDevice, RingEvent, AccessCode, WellnessAlert, ActivityEntry } from '../types/ring';
import {
  INITIAL_DEVICES,
  generateInitialEvents,
  INITIAL_ACCESS_CODES,
  INITIAL_WELLNESS_ALERTS,
  generateActivityData,
  LOCATION,
} from '../services/ringSimulator';

const LIVE_EVENT_POOL = [
  { deviceId: 'dev-doorbell', deviceName: 'Front Door Camera', type: 'motion' as const, details: 'Person detected at front entrance', snapshot: true },
  { deviceId: 'dev-doorbell', deviceName: 'Front Door Camera', type: 'ding' as const, details: 'Visitor pressed the doorbell', snapshot: true },
  { deviceId: 'dev-cam-back', deviceName: 'Backyard Camera', type: 'motion' as const, details: 'Motion in backyard garden', snapshot: true },
  { deviceId: 'dev-cam-garage', deviceName: 'Garage Camera', type: 'motion' as const, details: 'Vehicle approaching garage', snapshot: true },
  { deviceId: 'dev-doorbell', deviceName: 'Front Door Camera', type: 'motion' as const, details: 'Animal detected in driveway', snapshot: true },
];

export function useRingSimulator() {
  const [devices, setDevices] = useState<RingDevice[]>(INITIAL_DEVICES);
  const [events, setEvents] = useState<RingEvent[]>(generateInitialEvents);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>(INITIAL_ACCESS_CODES);
  const [wellnessAlerts, setWellnessAlerts] = useState<WellnessAlert[]>(INITIAL_WELLNESS_ALERTS);
  const [activityData] = useState<ActivityEntry[]>(generateActivityData);
  const [isConnected] = useState(true);

  // Simulate Ring WebSocket — real-time events
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.35) {
        const template = LIVE_EVENT_POOL[Math.floor(Math.random() * LIVE_EVENT_POOL.length)];
        const newEvent: RingEvent = {
          id: `evt-live-${Date.now()}`,
          ...template,
          location: LOCATION.name,
          timestamp: new Date(),
          resolved: false,
        };
        setEvents(prev => [newEvent, ...prev.slice(0, 99)]);
      }
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const toggleLock = useCallback((deviceId: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id !== deviceId || d.type !== 'lock') return d;
      const isLocking = d.lockState !== 'locked';
      const newState = isLocking ? 'locked' : 'unlocked';
      setEvents(evts => [{
        id: `evt-lock-${Date.now()}`,
        deviceId,
        deviceName: d.name,
        type: isLocking ? 'lock' : 'unlock',
        timestamp: new Date(),
        location: LOCATION.name,
        details: `Door ${newState} via Ring Guardian`,
        snapshot: false,
        resolved: false,
      }, ...evts]);
      return { ...d, lockState: newState };
    }));
  }, []);

  const toggleCode = useCallback((codeId: string) => {
    setAccessCodes(prev => prev.map(c => c.id === codeId ? { ...c, enabled: !c.enabled } : c));
  }, []);

  const toggleWellnessAlert = useCallback((alertId: string) => {
    setWellnessAlerts(prev => prev.map(a => a.id === alertId ? { ...a, enabled: !a.enabled } : a));
  }, []);

  const dismissWellnessAlert = useCallback((alertId: string) => {
    setWellnessAlerts(prev => prev.map(a => a.id === alertId ? { ...a, triggered: false } : a));
  }, []);

  const markEventResolved = useCallback((eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, resolved: true } : e));
  }, []);

  const today = new Date();
  const todayEvents = events.filter(e => new Date(e.timestamp).toDateString() === today.toDateString());
  const lockDevice = devices.find(d => d.type === 'lock');
  const activeAlerts = wellnessAlerts.filter(a => a.triggered && a.enabled);

  return {
    devices,
    events,
    accessCodes,
    wellnessAlerts,
    activityData,
    isConnected,
    location: LOCATION,
    toggleLock,
    toggleCode,
    toggleWellnessAlert,
    dismissWellnessAlert,
    markEventResolved,
    activeAlerts,
    onlineDevices: devices.filter(d => d.status === 'online').length,
    todayEventCount: todayEvents.length,
    isLocked: lockDevice?.lockState === 'locked',
    lockDevice,
  };
}
