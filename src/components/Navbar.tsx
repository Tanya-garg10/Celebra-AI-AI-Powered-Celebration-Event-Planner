import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  PlusCircle,
  ChevronDown,
  Bot,
  RotateCcw,
  Download,
  Upload,
  Check,
  Compass
} from 'lucide-react';
import { CelebrationEvent } from '../types.ts';
import { formatINR } from '../utils/formatters.ts';

interface NavbarProps {
  events: CelebrationEvent[];
  activeEvent: CelebrationEvent | null;
  onSelectEvent: (eventId: string) => void;
  onOpenWizard: () => void;
  currentView: 'landing' | 'dashboard';
  onChangeView: (view: 'landing' | 'dashboard') => void;
  onOpenAssistant: () => void;
  onResetDemo: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  geminiStatus: { geminiAvailable: boolean; model: string };
}

export const Navbar: React.FC<NavbarProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenWizard,
  currentView,
  onChangeView,
  onOpenAssistant,
  onResetDemo,
  onExportData,
  onImportData,
  geminiStatus,
}) => {
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          onImportData(content);
          setIsSettingsOpen(false);
        } catch (err) {
          alert('Failed to parse file. Please upload a valid JSON backup.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onChangeView('landing')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-rose-400 flex items-center justify-center text-white shadow-sm shadow-purple-900/10 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                  Celebra <span className="text-purple-700 font-sans text-xs tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-purple-100 font-semibold">AI</span>
                </span>
                <span className="text-[11px] block text-stone-500 font-medium -mt-1 tracking-tight">
                  Your Celebration, Perfectly Planned
                </span>
              </div>
            </button>

            {/* View Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-stone-200/60 p-1 rounded-xl text-xs font-semibold text-stone-600">
              <button
                onClick={() => onChangeView('landing')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentView === 'landing'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                Home & Features
              </button>
              <button
                onClick={() => onChangeView('dashboard')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-white text-purple-950 shadow-xs font-bold'
                    : 'hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                Planning Workspace
              </button>
            </nav>

            {/* Clear Engine Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200/80 text-[10px] font-semibold text-stone-600">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  geminiStatus.geminiAvailable
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />
              <span>
                {geminiStatus.geminiAvailable
                  ? 'Gemini 3.8 Flash'
                  : 'Curated Demo Engine'}
              </span>
            </div>
          </div>

          {/* Center/Right: Active Event Dropdown & Actions */}
          <div className="flex items-center gap-3">
            {/* Event Dropdown Picker */}
            {events.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsEventMenuOpen(!isEventMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-stone-200/90 hover:border-purple-300 text-xs text-stone-800 shadow-xs transition-all max-w-[220px] sm:max-w-[260px] cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <div className="truncate text-left">
                    <p className="font-semibold text-stone-900 truncate">
                      {activeEvent?.name || 'Select Celebration'}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate">
                      {activeEvent ? `${activeEvent.eventType} • ${formatINR(activeEvent.budget)}` : 'No active event'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-auto shrink-0" />
                </button>

                {isEventMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsEventMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3.5 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        My Saved Celebrations
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-stone-100">
                        {events.map((evt) => {
                          const isSelected = evt.id === activeEvent?.id;
                          return (
                            <button
                              key={evt.id}
                              onClick={() => {
                                onSelectEvent(evt.id);
                                setIsEventMenuOpen(false);
                                if (currentView !== 'dashboard') onChangeView('dashboard');
                              }}
                              className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-stone-50 transition-colors cursor-pointer ${
                                isSelected ? 'bg-purple-50/60' : ''
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                  isSelected
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-stone-100 text-stone-600'
                                }`}
                              >
                                {evt.eventType === 'Wedding'
                                  ? '💍'
                                  : evt.eventType === 'Birthday'
                                  ? '🎂'
                                  : evt.eventType === 'Anniversary'
                                  ? '🥂'
                                  : '✨'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold text-stone-800 truncate">
                                    {evt.name}
                                  </p>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-500">
                                  {evt.location} • {formatINR(evt.budget)}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-2 border-t border-stone-100 mt-1">
                        <button
                          onClick={() => {
                            setIsEventMenuOpen(false);
                            onOpenWizard();
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Plan New Celebration
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-100/80 text-purple-900 hover:bg-purple-200/90 transition-all border border-purple-200/70 shadow-xs cursor-pointer group"
              title="Open Celebra AI Assistant"
            >
              <Bot className="w-4 h-4 text-purple-700 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Planner</span>
            </button>

            {/* Create Event CTA */}
            <button
              onClick={onOpenWizard}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">New Event</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Settings & Persistence Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="w-9 h-9 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                title="Workspace Options & Data"
              >
                <div className="flex flex-col gap-0.5 items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-stone-500" />
                  <span className="w-1 h-1 rounded-full bg-stone-500" />
                  <span className="w-1 h-1 rounded-full bg-stone-500" />
                </div>
              </button>

              {isSettingsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSettingsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-40 text-xs">
                    <div className="px-2 py-1.5 mb-1 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            geminiStatus.geminiAvailable
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="font-semibold text-stone-800">
                          {geminiStatus.geminiAvailable
                            ? 'Gemini 3.8 Flash'
                            : 'Curated Engine Mode'}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {geminiStatus.geminiAvailable
                          ? 'Real-time AI active via server proxy'
                          : 'Realistic curated templates enabled'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onExportData();
                        setIsSettingsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-stone-50 text-stone-700 text-left transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-400" />
                      <span>Export Plan Backup (.JSON)</span>
                    </button>

                    <label className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-stone-50 text-stone-700 text-left transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-stone-400" />
                      <span>Import Plan Backup</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Reset all events to the curated wedding and 30th birthday showcase data?'
                          )
                        ) {
                          onResetDemo();
                          setIsSettingsOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-rose-50 text-rose-700 text-left transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reset to Demo Events</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
