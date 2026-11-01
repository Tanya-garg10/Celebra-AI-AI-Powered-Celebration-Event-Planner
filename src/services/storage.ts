import { CelebrationEvent } from '../types.ts';
import { INITIAL_EVENTS } from '../data/initialEvents.ts';

const STORAGE_KEY = 'celebra_ai_events_v2';
const ACTIVE_EVENT_KEY = 'celebra_ai_active_event_id_v2';

export function getStoredEvents(): CelebrationEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredEvents(INITIAL_EVENTS);
      return INITIAL_EVENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveStoredEvents(INITIAL_EVENTS);
    return INITIAL_EVENTS;
  } catch (e) {
    console.error('Failed reading from localStorage:', e);
    return INITIAL_EVENTS;
  }
}

export function saveStoredEvents(events: CelebrationEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed saving to localStorage:', e);
  }
}

export function getActiveEventId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_EVENT_KEY);
    if (id) return id;
  } catch (e) {
    // Ignore
  }
  return INITIAL_EVENTS[0].id;
}

export function setActiveEventId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_EVENT_KEY, id);
  } catch (e) {
    // Ignore
  }
}

export function resetToDemoData(): CelebrationEvent[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_EVENT_KEY);
  } catch (e) {
    // Ignore
  }
  saveStoredEvents(INITIAL_EVENTS);
  setActiveEventId(INITIAL_EVENTS[0].id);
  return INITIAL_EVENTS;
}

export function exportEventsToJSON(): string {
  const events = getStoredEvents();
  return JSON.stringify(events, null, 2);
}

export function importEventsFromJSON(jsonString: string): CelebrationEvent[] {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) throw new Error('Invalid JSON format: expected an array of events.');
  saveStoredEvents(parsed);
  if (parsed.length > 0) {
    setActiveEventId(parsed[0].id);
  }
  return parsed;
}
