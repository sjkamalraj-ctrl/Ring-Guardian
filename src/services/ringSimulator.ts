import type {
  RingDevice, RingEvent, AccessCode, WellnessAlert, Location, ActivityEntry,
} from '../types/ring';

export const LOCATION: Location = {
  id: 'loc-home',
  name: "Mom's Home",
  address: '742 Evergreen Terrace, Springfield, OR 97477',
  occupantName: 'Margaret Chen',
  emergencyContacts: [
    'Jane Chen (Daughter) +1 (503) 555-0147',
    'Dr. Williams +1 (503) 555-0192',
  ],
  devices: ['dev-doorbell', 'dev-cam-back', 'dev-cam-garage', 'dev-lock-front', 'dev-base'],
};

export const INITIAL_DEVICES: RingDevice[] = [
  {
    id: 'dev-doorbell',
    name: 'Front Door Camera',
    type: 'doorbell',
    locationId: 'loc-home',
    status: 'online',
    battery: 87,
    signal: 4,
    firmware: '1.8.45-r2',
    lastSeen: new Date(),
    hasLiveView: true,
    motionZones: ['Driveway', 'Front Walk'],
    isRecording: false,
    motionSensitivity: 7,
  },
  {
    id: 'dev-cam-back',
    name: 'Backyard Camera',
    type: 'camera',
    locationId: 'loc-home',
    status: 'online',
    battery: 42,
    signal: 3,
    firmware: '1.8.45-r2',
    lastSeen: new Date(),
    hasLiveView: true,
    motionZones: ['Garden', 'Back Gate'],
    isRecording: false,
    motionSensitivity: 5,
  },
  {
    id: 'dev-cam-garage',
    name: 'Garage Camera',
    type: 'camera',
    locationId: 'loc-home',
    status: 'online',
    signal: 5,
    firmware: '1.8.45-r2',
    lastSeen: new Date(),
    hasLiveView: true,
    motionZones: ['Garage Door'],
    isRecording: true,
    motionSensitivity: 6,
  },
  {
    id: 'dev-lock-front',
    name: 'Smart Lock',
    type: 'lock',
    locationId: 'loc-home',
    status: 'online',
    signal: 5,
    firmware: '2.3.1',
    lastSeen: new Date(),
    lockState: 'locked',
  },
  {
    id: 'dev-base',
    name: 'Ring Alarm Base',
    type: 'base_station',
    locationId: 'loc-home',
    status: 'online',
    signal: 5,
    firmware: '3.5.2',
    lastSeen: new Date(),
  },
];

const EVENT_TEMPLATES = [
  { deviceId: 'dev-doorbell', deviceName: 'Front Door Camera', type: 'motion' as const, details: 'Person detected at front door', snapshot: true },
  { deviceId: 'dev-doorbell', deviceName: 'Front Door Camera', type: 'ding' as const, details: 'Visitor rang the doorbell', snapshot: true },
  { deviceId: 'dev-cam-back', deviceName: 'Backyard Camera', type: 'motion' as const, details: 'Motion in backyard garden', snapshot: true },
  { deviceId: 'dev-lock-front', deviceName: 'Smart Lock', type: 'lock' as const, details: 'Door locked via app', snapshot: false },
  { deviceId: 'dev-lock-front', deviceName: 'Smart Lock', type: 'unlock' as const, details: 'Door unlocked by Margaret', snapshot: false },
  { deviceId: 'dev-cam-garage', deviceName: 'Garage Camera', type: 'motion' as const, details: 'Vehicle detected near garage', snapshot: true },
  { deviceId: 'dev-lock-front', deviceName: 'Smart Lock', type: 'unlock' as const, details: 'Doctor visit — access code used', snapshot: false },
  { deviceId: 'dev-doorbell', deviceName: 'Front Door Camera', type: 'motion' as const, details: 'Package delivery detected', snapshot: true },
];

export function generateInitialEvents(): RingEvent[] {
  const events: RingEvent[] = [];
  const now = new Date();
  for (let i = 0; i < 45; i++) {
    const t = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    const minsAgo = Math.floor(Math.random() * 24 * 60);
    events.push({
      id: `evt-init-${i}`,
      ...t,
      location: LOCATION.name,
      timestamp: new Date(now.getTime() - minsAgo * 60_000),
      resolved: minsAgo > 45,
    });
  }
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const INITIAL_ACCESS_CODES: AccessCode[] = [
  {
    id: 'code-margaret',
    name: 'Margaret (Resident)',
    type: 'permanent',
    usageCount: 341,
    lastUsed: new Date(Date.now() - 6 * 3_600_000),
    enabled: true,
  },
  {
    id: 'code-jane',
    name: 'Jane (Daughter)',
    type: 'permanent',
    usageCount: 87,
    lastUsed: new Date(Date.now() - 2 * 3_600_000),
    enabled: true,
  },
  {
    id: 'code-nurse',
    name: 'Home Nurse',
    type: 'scheduled',
    usageCount: 24,
    lastUsed: new Date(Date.now() - 24 * 3_600_000),
    enabled: true,
    validUntil: new Date(Date.now() + 90 * 24 * 3_600_000),
    schedule: { days: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '13:00' },
  },
  {
    id: 'code-cleaner',
    name: 'House Cleaner',
    type: 'temporary',
    usageCount: 6,
    lastUsed: new Date(Date.now() - 7 * 24 * 3_600_000),
    enabled: true,
    validUntil: new Date(Date.now() + 30 * 24 * 3_600_000),
    schedule: { days: [5], startTime: '10:00', endTime: '15:00' },
  },
  {
    id: 'code-delivery',
    name: 'Pharmacy Delivery',
    type: 'temporary',
    usageCount: 2,
    lastUsed: new Date(Date.now() - 3 * 24 * 3_600_000),
    enabled: false,
    validUntil: new Date(Date.now() - 24 * 3_600_000),
  },
];

export const INITIAL_WELLNESS_ALERTS: WellnessAlert[] = [
  {
    id: 'wa-morning',
    name: 'Morning Activity Check',
    type: 'no_motion',
    threshold: 4,
    unit: 'hours',
    enabled: true,
    contacts: ['Jane Chen (Daughter) +1 (503) 555-0147'],
    triggered: false,
  },
  {
    id: 'wa-night',
    name: 'Late-Night Movement',
    type: 'unusual_activity',
    threshold: 30,
    unit: 'minutes',
    enabled: true,
    contacts: ['Jane Chen (Daughter) +1 (503) 555-0147', 'Dr. Williams +1 (503) 555-0192'],
    triggered: true,
    lastTriggered: new Date(Date.now() - 18 * 3_600_000),
  },
  {
    id: 'wa-door',
    name: 'Door Left Open',
    type: 'door_open',
    threshold: 15,
    unit: 'minutes',
    enabled: true,
    contacts: ['Jane Chen (Daughter) +1 (503) 555-0147'],
    triggered: false,
  },
];

export function generateActivityData(): ActivityEntry[] {
  const data: ActivityEntry[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let base = 0;
      if (hour >= 7 && hour <= 8) base = 7;
      else if (hour >= 9 && hour <= 11) base = 4;
      else if (hour === 12) base = 5;
      else if (hour >= 13 && hour <= 15) base = 3;
      else if (hour >= 16 && hour <= 18) base = 6;
      else if (hour >= 19 && hour <= 21) base = 3;
      else if (hour === 22) base = 1;
      if (day >= 1 && day <= 5 && hour >= 9 && hour <= 13) base += 3;
      const count = Math.max(0, base + Math.floor(Math.random() * 3 - 1));
      data.push({ hour, day, count });
    }
  }
  return data;
}
