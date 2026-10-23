# Ring Guardian — Smart Home Safety & Caretaking Hub

> **🌐 Live Demo**: [https://sjkamalraj-ctrl.github.io/Ring-Guardian/](https://sjkamalraj-ctrl.github.io/Ring-Guardian/)

A smart home caretaking, security, and access control dashboard built with **React 19**, **TypeScript**, and **Vite**, powered by a high-fidelity **Ring API & Device Simulator**.

---

## 🌟 Key Features

1. **🏠 Interactive Dashboard**
   - Real-time device status cards (doorbells, outdoor cameras, garage cams, smart locks, base stations).
   - One-tap quick lock/unlock toggle with audit logging.
   - Live event feed with event-type filters and visual indicators.
   - Health and battery level monitoring with visual indicators.

2. **📹 Live Camera Feeds**
   - Simulated real-time camera feeds with motion detection overlays.
   - Front door, driveway/garden, and garage angles with live recording tags.

3. **🔐 Access Control & Keypad Management**
   - Smart lock state synchronization.
   - Guest and family pin code management (temporary, recurring, emergency).
   - Instant access code enable/disable controls.

4. **❤️ Caretaker Mode (IoT Home Automation & Wellness)**
   - Inactivity and wellness anomaly detection for seniors/loved ones.
   - 7-day hourly motion activity heatmap.
   - Automated emergency contact alerts and notification dismissal workflows.

5. **📋 Audit & Event Log**
   - Complete timeline of dings, motion events, lock toggles, and alarms.
   - Filter by event type and mark events as resolved.

6. **📱 Device Inventory**
   - Per-device metrics including Wi-Fi RSSI signal strength, battery percentage, firmware version, and motion zones.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Setup

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

---

## 🛠 Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library, JSDOM
- **Styling**: Vanilla CSS custom design system with dark mode glassmorphism
