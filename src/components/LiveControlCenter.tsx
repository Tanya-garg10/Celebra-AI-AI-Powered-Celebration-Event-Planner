import React, { useState } from 'react';
import {
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  FastForward,
  RotateCcw,
  Sparkles,
  Users,
  Check,
  ShieldAlert,
  Building
} from 'lucide-react';
import { CelebrationEvent, DayScheduleItem } from '../types.ts';
import { formatINR, formatShortDate } from '../utils/formatters.ts';

interface LiveControlCenterProps {
  event: CelebrationEvent;
  onUpdateEventSchedule?: (schedule: DayScheduleItem[]) => void;
  onUpdateSchedule?: (schedule: DayScheduleItem[]) => void;
  onUpdateTasks?: (newTasks: any[]) => void;
  onNavigateToEmergency?: () => void;
}

export const LiveControlCenter: React.FC<LiveControlCenterProps> = ({
  event,
  onUpdateEventSchedule,
  onUpdateSchedule,
  onUpdateTasks,
  onNavigateToEmergency,
}) => {
  const initialSchedule = (event.aiPlan?.eventDaySchedule || []).map((item, idx) => ({
    id: item.id || `sch-${idx}`,
    time: item.time,
    activity: item.activity,
    responsible: item.responsible,
    status: item.status || (idx === 0 ? 'Completed' : idx === 1 ? 'Current' : 'Upcoming'),
    delayMinutes: item.delayMinutes || 0
  }));

  const saveSchedule = (updated: DayScheduleItem[]) => {
    if (onUpdateSchedule) onUpdateSchedule(updated);
    else if (onUpdateEventSchedule) onUpdateEventSchedule(updated);
  };

  const [schedule, setSchedule] = useState<DayScheduleItem[]>(initialSchedule);
  const [globalDelay, setGlobalDelay] = useState<number>(0);

  const completedCount = schedule.filter((s) => s.status === 'Completed').length;
  const currentItem = schedule.find((s) => s.status === 'Current') || schedule[0];
  const upcomingCount = schedule.filter((s) => s.status === 'Upcoming').length;

  const handleToggleComplete = (id: string) => {
    const updated = schedule.map((item) => {
      if (item.id === id) {
        return { ...item, status: 'Completed' as const };
      }
      return item;
    });

    // Automatically make the next upcoming item "Current"
    const nextUpcoming = updated.find((item) => item.status === 'Upcoming');
    if (nextUpcoming) {
      nextUpcoming.status = 'Current';
    }

    setSchedule(updated);
    saveSchedule(updated);
  };

  const handleAddDelay = (mins: number) => {
    const newGlobalDelay = globalDelay + mins;
    setGlobalDelay(newGlobalDelay);

    const updated = schedule.map((item) => {
      if (item.status === 'Upcoming' || item.status === 'Current') {
        return {
          ...item,
          delayMinutes: (item.delayMinutes || 0) + mins,
          status: mins > 0 ? ('Delayed' as const) : item.status
        };
      }
      return item;
    });

    setSchedule(updated);
    saveSchedule(updated);
  };

  const handleResetTimeline = () => {
    setGlobalDelay(0);
    const updated = schedule.map((item, idx) => ({
      ...item,
      status: idx === 0 ? ('Current' as const) : ('Upcoming' as const),
      delayMinutes: 0
    }));
    setSchedule(updated);
    saveSchedule(updated);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Live Broadcast Bar */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-purple-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Live Event Day Control Room
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-300">{event.location}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {event.name}
          </h2>

          <p className="text-xs text-stone-300 mt-1">
            Real-time schedule synchronization, delay buffers, vendor coordination, and milestone execution.
          </p>
        </div>

        {/* Global Delay Adjusters */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handleAddDelay(15)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>+15m Delay</span>
          </button>
          <button
            onClick={() => handleAddDelay(30)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>+30m Delay</span>
          </button>
          <button
            onClick={handleResetTimeline}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors cursor-pointer"
            title="Reset Delays"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Currently Active Milestone */}
        <div className="p-5 rounded-3xl bg-purple-50/80 border border-purple-200 shadow-xs">
          <div className="flex items-center justify-between text-purple-800 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Milestone</span>
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          </div>
          <p className="font-serif text-lg font-bold text-stone-900 mt-1">
            {currentItem ? currentItem.activity : 'All milestones completed!'}
          </p>
          <p className="text-xs text-purple-900 font-semibold mt-1">
            Scheduled: {currentItem?.time} • Lead: {currentItem?.responsible}
          </p>
        </div>

        {/* Milestone Progress */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Run-of-Show Progress
          </span>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
            {completedCount} / {schedule.length} Executed
          </p>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="h-1.5 rounded-full bg-purple-600"
              style={{ width: `${Math.round((completedCount / (schedule.length || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Schedule Drift / Delay */}
        <div className={`p-5 rounded-3xl border shadow-xs ${
          globalDelay > 0 ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Schedule Timing Status
          </span>
          <p className="font-serif text-2xl font-bold mt-1">
            {globalDelay > 0 ? `+${globalDelay} Min Delay` : 'On Time (0 Min Drift)'}
          </p>
          <p className="text-[11px] font-semibold text-stone-600 mt-1">
            {globalDelay > 0 ? 'Subsequent rituals auto-adjusted' : 'All vendor arrivals on track'}
          </p>
        </div>
      </div>

      {/* Hourly Run-of-Show Interactive Checklist */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Run-of-Show Timeline Execution
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            Click &ldquo;Mark Complete&rdquo; to progress through the day
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {schedule.map((item) => {
            const isCompleted = item.status === 'Completed';
            const isCurrent = item.status === 'Current';
            const isDelayed = item.status === 'Delayed';

            return (
              <div
                key={item.id}
                className={`py-4 px-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isCurrent
                    ? 'bg-purple-50/70 border border-purple-200 shadow-xs'
                    : isCompleted
                    ? 'opacity-60 bg-stone-50/50'
                    : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold px-3 py-1 rounded-xl shrink-0 ${
                      isCurrent
                        ? 'bg-purple-700 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-stone-200 text-stone-600 line-through'
                        : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    {item.time}
                  </span>

                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isCompleted ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                      {item.activity}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Responsible Lead: <strong className="text-stone-700">{item.responsible}</strong>
                      {item.delayMinutes && item.delayMinutes > 0 ? (
                        <span className="text-amber-700 font-bold ml-2">
                          (+{item.delayMinutes}m delay applied)
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white border border-purple-200 px-2 py-0.5 rounded-md animate-pulse">
                      In Progress
                    </span>
                  )}

                  {!isCompleted ? (
                    <button
                      onClick={() => handleToggleComplete(item.id || '')}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Mark Complete</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency SOS Quick-Dial Directory */}
      <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-200/80 space-y-3">
        <div className="flex items-center gap-2 text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h4 className="font-serif text-base font-bold">
            Day-of Emergency SOS Speed-Dial Contacts
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {event.vendors.map((v) => (
            <div
              key={v.id}
              className="p-3.5 rounded-2xl bg-white border border-rose-100 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-stone-900 truncate">{v.name}</p>
                <p className="text-[10px] text-stone-500">{v.category} • {v.contactPerson}</p>
              </div>
              <a
                href={`tel:${v.phone.replace(/[^0-9+]/g, '')}`}
                className="p-2 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                title="Call Vendor"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
