import { useState, useMemo } from 'react';
import { Bell, Activity, Lock, AlertTriangle, Battery, CheckCircle, Filter, Search } from 'lucide-react';
import type { RingEvent, EventType } from '../types/ring';
import { formatDistanceToNow } from '../utils/time';

interface EventLogProps {
  events: RingEvent[];
  onMarkResolved: (id: string) => void;
}

const EVENT_META: Record<EventType, { Icon: React.ElementType; label: string; color: string }> = {
  motion: { Icon: Activity, label: 'Motion', color: 'var(--ring-secondary)' },
  ding: { Icon: Bell, label: 'Doorbell', color: 'var(--warning)' },
  lock: { Icon: Lock, label: 'Locked', color: 'var(--success)' },
  unlock: { Icon: Lock, label: 'Unlocked', color: 'var(--danger)' },
  alarm: { Icon: AlertTriangle, label: 'Alarm', color: 'var(--danger)' },
  wellness_alert: { Icon: AlertTriangle, label: 'Wellness', color: 'var(--warning)' },
  low_battery: { Icon: Battery, label: 'Battery', color: 'var(--warning)' },
};

const FILTER_TYPES: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Motion', value: 'motion' },
  { label: 'Doorbell', value: 'ding' },
  { label: 'Lock', value: 'lock' },
  { label: 'Unlock', value: 'unlock' },
  { label: 'Unresolved', value: 'unresolved' },
];

export function EventLog({ events, onMarkResolved }: EventLogProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (filter === 'unresolved') return !e.resolved;
      if (filter !== 'all' && e.type !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.deviceName.toLowerCase().includes(q) || e.details.toLowerCase().includes(q);
      }
      return true;
    });
  }, [events, filter, search]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, RingEvent[]> = {};
    filtered.forEach(e => {
      const key = new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return groups;
  }, [filtered]);

  const unresolvedCount = events.filter(e => !e.resolved).length;

  return (
    <div className="content-area">
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Events', value: events.length, color: 'var(--ring-primary)' },
          { label: 'Unresolved', value: unresolvedCount, color: 'var(--warning)' },
          { label: 'Motion Events', value: events.filter(e => e.type === 'motion').length, color: 'var(--ring-secondary)' },
          { label: 'Doorbell Rings', value: events.filter(e => e.type === 'ding').length, color: 'var(--success)' },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 100px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', borderRadius: 8, padding: '6px 12px', flex: 1, minWidth: 180 }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={14} color="var(--text-muted)" />
            {FILTER_TYPES.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: filter === f.value ? '1px solid var(--ring-primary)' : '1px solid var(--border)',
                  background: filter === f.value ? 'rgba(0,180,216,0.15)' : 'transparent',
                  color: filter === f.value ? 'var(--ring-primary)' : 'var(--text-secondary)',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: filter === f.value ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event List */}
      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state">
          <Bell size={32} />
          <p>No events match your filters</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {Object.entries(grouped).map(([date, evts]) => (
            <div key={date}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10, paddingLeft: 4 }}>
                {date}
              </p>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {evts.map((evt, i) => (
                  <EventRow
                    key={evt.id}
                    event={evt}
                    isLast={i === evts.length - 1}
                    onResolve={() => onMarkResolved(evt.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventRow({ event, isLast, onResolve }: { event: RingEvent; isLast: boolean; onResolve: () => void }) {
  const meta = EVENT_META[event.type] ?? EVENT_META.motion;
  const { Icon } = meta;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
      opacity: event.resolved ? 0.55 : 1,
      transition: 'opacity 0.3s',
      animation: !event.resolved ? 'slideIn 0.3s ease' : undefined,
    }}>
      <div className={`event-icon ${event.type}`} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{event.deviceName}</p>
          <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: `${meta.color}20`, color: meta.color, fontWeight: 600 }}>
            {meta.label}
          </span>
          {event.snapshot && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>📷 snapshot</span>
          )}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{event.details}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          <br />
          <span style={{ fontSize: 10 }}>{formatDistanceToNow(event.timestamp)}</span>
        </p>
        {!event.resolved ? (
          <button
            onClick={onResolve}
            title="Mark as resolved"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <CheckCircle size={12} /> Resolve
          </button>
        ) : (
          <CheckCircle size={16} color="var(--success)" />
        )}
      </div>
    </div>
  );
}
