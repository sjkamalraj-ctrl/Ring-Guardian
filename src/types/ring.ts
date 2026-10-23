export type DeviceType = 'doorbell' | 'camera' | 'lock' | 'chime' | 'base_station';
export type DeviceStatus = 'online' | 'offline' | 'low_battery';
export type LockState = 'locked' | 'unlocked' | 'jammed' | 'transitioning';
export type EventType = 'motion' | 'ding' | 'lock' | 'unlock' | 'alarm' | 'wellness_alert' | 'low_battery';
export type View = 'dashboard' | 'live' | 'access' | 'caretaker' | 'events' | 'devices';

export interface RingDevice {
  id: string;
  name: string;
  type: DeviceType;
  locationId: string;
  status: DeviceStatus;
  battery?: number;
  signal: number; // 1-5
  firmware: string;
  lastSeen: Date;
  hasLiveView?: boolean;
  lockState?: LockState;
  motionZones?: string[];
  isRecording?: boolean;
  motionSensitivity?: number;
}

export interface RingEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  type: EventType;
  timestamp: Date;
  location: string;
  details: string;
  snapshot: boolean;
  resolved: boolean;
}

export interface AccessCode {
  id: string;
  name: string;
  type: 'permanent' | 'temporary' | 'scheduled';
  usageCount: number;
  lastUsed?: Date;
  validUntil?: Date;
  enabled: boolean;
  schedule?: { days: number[]; startTime: string; endTime: string };
}

export interface WellnessAlert {
  id: string;
  name: string;
  type: 'no_motion' | 'unusual_activity' | 'door_open';
  threshold: number;
  unit: 'hours' | 'minutes';
  enabled: boolean;
  contacts: string[];
  triggered: boolean;
  lastTriggered?: Date;
}

export interface ActivityEntry {
  hour: number;
  day: number;
  count: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  occupantName: string;
  emergencyContacts: string[];
  devices: string[];
}
