/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CelebrationEvent } from './types.ts';
import {
  getStoredEvents,
  saveStoredEvents,
  getActiveEventId,
  setActiveEventId,
  resetToDemoData,
  exportEventsToJSON,
  importEventsFromJSON
} from './services/storage.ts';
import { checkServerStatus } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { MainDashboard } from './components/MainDashboard.tsx';
import { EventWizard } from './components/EventWizard.tsx';
import { ChatAssistant } from './components/ChatAssistant.tsx';

export default function App() {
  const [events, setEvents] = useState<CelebrationEvent[]>([]);
  const [activeEventId, setActiveEventIdState] = useState<string>('');
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ featherlessAvailable: boolean; model: string }>({
    featherlessAvailable: false,
    model: 'MiniMaxAI/MiniMax-M3.1-Flash'
  });

  // Initialize data on mount
  useEffect(() => {
    const loadedEvents = getStoredEvents();
    setEvents(loadedEvents);
    const storedActiveId = getActiveEventId();
    if (storedActiveId && loadedEvents.some((e) => e.id === storedActiveId)) {
      setActiveEventIdState(storedActiveId);
    } else if (loadedEvents.length > 0) {
      setActiveEventIdState(loadedEvents[0].id);
      setActiveEventId(loadedEvents[0].id);
    }

    checkServerStatus().then((status) => {
      setAiStatus(status);
    });
  }, []);

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || null;

  const handleSelectEvent = (id: string) => {
    setActiveEventIdState(id);
    setActiveEventId(id);
    setCurrentView('dashboard');
  };

  const handleEventCreated = (newEvent: CelebrationEvent) => {
    const updated = [newEvent, ...events];
    setEvents(updated);
    saveStoredEvents(updated);
    setActiveEventIdState(newEvent.id);
    setActiveEventId(newEvent.id);
    setCurrentView('dashboard');
  };

  const handleUpdateActiveEvent = (updated: CelebrationEvent) => {
    const newEvents = events.map((e) => (e.id === updated.id ? updated : e));
    setEvents(newEvents);
    saveStoredEvents(newEvents);
  };

  const handleResetDemo = () => {
    const demoEvents = resetToDemoData();
    setEvents(demoEvents);
    setActiveEventIdState(demoEvents[0].id);
  };

  const handleExportData = () => {
    const dataStr = exportEventsToJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `celebra_ai_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const imported = importEventsFromJSON(jsonStr);
      setEvents(imported);
      if (imported.length > 0) {
        setActiveEventIdState(imported[0].id);
      }
      alert('Event plan backup imported successfully!');
    } catch (err: any) {
      alert(`Import failed: ${err.message || 'Invalid JSON format'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col antialiased">
      {/* Navigation Bar */}
      <Navbar
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onOpenWizard={() => setIsWizardOpen(true)}
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onResetDemo={handleResetDemo}
        onExportData={handleExportData}
        onImportData={handleImportData}
        aiStatus={aiStatus}
      />

      {/* Main Views */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            onPlanEvent={() => setIsWizardOpen(true)}
            onExploreDemo={(eventId) => {
              if (eventId) handleSelectEvent(eventId);
              setCurrentView('dashboard');
            }}
            featuredEvents={events}
          />
        ) : (
          <MainDashboard
            events={events}
            activeEvent={activeEvent}
            onSelectEvent={handleSelectEvent}
            onUpdateEvent={handleUpdateActiveEvent}
            onOpenWizard={() => setIsWizardOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}
      </main>

      {/* Event Creation Multi-Step Wizard Modal */}
      <EventWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onEventCreated={handleEventCreated}
      />

      {/* AI Assistant Slide-over Drawer */}
      <ChatAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeEvent={activeEvent}
      />
    </div>
  );
}
