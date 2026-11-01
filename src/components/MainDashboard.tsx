import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Compass,
  Layers,
  ArrowRight,
  Bot,
  AlertTriangle,
  Lightbulb,
  Building,
  Check,
  Palette,
  Sliders,
  ShieldAlert,
  Armchair,
  Send,
  LifeBuoy,
  UserCheck,
  Leaf,
  Radio,
  Activity,
  ChevronRight
} from 'lucide-react';
import { CelebrationEvent } from '../types.ts';
import { formatINR, formatShortDate, getDaysRemaining } from '../utils/formatters.ts';
import { EventOverview } from './EventOverview.tsx';
import { BudgetPlanner } from './BudgetPlanner.tsx';
import { TaskManager } from './TaskManager.tsx';
import { VendorManager } from './VendorManager.tsx';
import { GuestManager } from './GuestManager.tsx';
import { IdeaGenerator } from './IdeaGenerator.tsx';
import { MoodboardGenerator } from './MoodboardGenerator.tsx';
import { EventSimulator } from './EventSimulator.tsx';
import { BudgetRiskPredictor } from './BudgetRiskPredictor.tsx';
import { SeatingPlanner } from './SeatingPlanner.tsx';
import { InvitationStudio } from './InvitationStudio.tsx';
import { EmergencyPlanner } from './EmergencyPlanner.tsx';
import { TeamCollaboration } from './TeamCollaboration.tsx';
import { EcoPlanner } from './EcoPlanner.tsx';
import { LiveControlCenter } from './LiveControlCenter.tsx';

interface MainDashboardProps {
  events: CelebrationEvent[];
  activeEvent: CelebrationEvent | null;
  onSelectEvent: (id: string) => void;
  onUpdateEvent: (updated: CelebrationEvent) => void;
  onOpenWizard: () => void;
  onOpenAssistant: () => void;
}

export type DashboardTab =
  | 'overview'
  | 'simulator'
  | 'budget'
  | 'risk'
  | 'seating'
  | 'invitations'
  | 'moodboard'
  | 'emergency'
  | 'timeline'
  | 'live'
  | 'vendors'
  | 'guests'
  | 'team'
  | 'eco'
  | 'ideas';

export const MainDashboard: React.FC<MainDashboardProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onUpdateEvent,
  onOpenWizard,
  onOpenAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  if (!activeEvent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          No Celebration Selected
        </h2>
        <p className="text-stone-600 text-sm mt-2 max-w-md mx-auto">
          Start planning your next wedding, birthday, anniversary, or college event with Celebra AI.
        </p>
        <button
          onClick={onOpenWizard}
          className="mt-6 px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-sm hover:bg-stone-800 transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-rose-300" />
          <span>Plan My Celebration</span>
        </button>
      </div>
    );
  }

  const countdown = getDaysRemaining(activeEvent.date);
  const totalActual = activeEvent.expenses.reduce((s, e) => s + (e.actualCost || 0), 0);
  const budgetUtilization = activeEvent.budget > 0 ? Math.round((totalActual / activeEvent.budget) * 100) : 0;
  const completedTasks = activeEvent.tasks.filter((t) => t.status === 'Completed').length;
  const totalTasks = activeEvent.tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const confirmedGuests = activeEvent.guests.filter((g) => g.status === 'Confirmed').length;

  // Event Health Score (0 - 100) calculation
  const computeHealthScore = () => {
    let score = 0;
    // Budget health (25 pts)
    if (activeEvent.budget > 0) {
      if (budgetUtilization <= 90) score += 25;
      else if (budgetUtilization <= 100) score += 20;
      else if (budgetUtilization <= 115) score += 12;
      else score += 5;
    } else {
      score += 15;
    }
    // Milestone execution (25 pts)
    score += Math.round(taskProgress * 0.25);
    // Guest clarity (20 pts)
    if (activeEvent.guests.length > 0) {
      const respondedCount = activeEvent.guests.filter(g => g.status !== 'Pending').length;
      score += Math.round((respondedCount / activeEvent.guests.length) * 20);
    } else {
      score += 12;
    }
    // Contingency readiness (15 pts)
    const eventRisks = activeEvent.emergencyRisks || activeEvent.risks || [];
    const riskCount = eventRisks.length;
    const resolvedOrMitigated = eventRisks.filter((r) => r.status === 'Mitigated').length;
    if (riskCount > 0) {
      score += Math.min(15, Math.round((resolvedOrMitigated / riskCount) * 15) + 5);
    } else {
      score += 10;
    }
    // Eco score (15 pts)
    const ecoScore = activeEvent.ecoAudit?.sustainabilityScore ?? activeEvent.ecoAudit?.score ?? 72;
    score += Math.round((ecoScore / 100) * 15);

    return Math.min(100, Math.max(15, score));
  };

  const healthScore = computeHealthScore();
  const healthStatus = healthScore >= 80 ? 'Optimal' : healthScore >= 60 ? 'On Track' : 'Needs Review';
  const healthBadgeStyle = healthScore >= 80
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : healthScore >= 60
    ? 'bg-amber-50 text-amber-800 border-amber-200'
    : 'bg-rose-50 text-rose-800 border-rose-200';

  // Handlers to update nested models
  const handleUpdatePlan = (newPlan: any) => {
    onUpdateEvent({ ...activeEvent, aiPlan: newPlan });
  };

  const handleUpdateExpenses = (newExpenses: any[]) => {
    onUpdateEvent({ ...activeEvent, expenses: newExpenses });
  };

  const handleUpdateTasks = (newTasks: any[]) => {
    onUpdateEvent({ ...activeEvent, tasks: newTasks });
  };

  const handleUpdateVendors = (newVendors: any[]) => {
    onUpdateEvent({ ...activeEvent, vendors: newVendors });
  };

  const handleUpdateGuests = (newGuests: any[]) => {
    onUpdateEvent({ ...activeEvent, guests: newGuests });
  };

  const tabs: { id: DashboardTab; label: string; icon: any; count?: number; badge?: string }[] = [
    { id: 'overview', label: 'AI Event Plan', icon: Sparkles },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders, badge: 'Smart' },
    { id: 'budget', label: 'Budget Planner', icon: IndianRupee, count: activeEvent.expenses.length },
    { id: 'risk', label: 'Risk Predictor', icon: ShieldAlert, badge: 'AI Guard' },
    { id: 'seating', label: 'Venue & Seating', icon: Armchair, badge: '2D Layout' },
    { id: 'invitations', label: 'Invitation Studio', icon: Send },
    { id: 'moodboard', label: 'AI Moodboards', icon: Palette, count: activeEvent.moodboards?.length || 1 },
    { id: 'emergency', label: 'Emergency & Backup', icon: LifeBuoy, count: (activeEvent.emergencyRisks || activeEvent.risks)?.length || 4 },
    { id: 'timeline', label: 'Timeline & Tasks', icon: Clock, count: activeEvent.tasks.length },
    { id: 'live', label: 'Live Control Center', icon: Radio, badge: 'Run-of-Show' },
    { id: 'vendors', label: 'Vendor Hub', icon: Building, count: activeEvent.vendors.length },
    { id: 'guests', label: 'Guests & RSVPs', icon: Users, count: activeEvent.guests.length },
    { id: 'team', label: 'Committee', icon: UserCheck, count: activeEvent.teamMembers?.length || 3 },
    { id: 'eco', label: 'Eco Planner', icon: Leaf, badge: `${activeEvent.ecoAudit?.sustainabilityScore ?? 74}%` },
    { id: 'ideas', label: 'AI Inspiration', icon: Lightbulb }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 text-left">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <span>Active Celebration Workspace</span>
            <span>•</span>
            <span className="text-stone-500">{activeEvent.location}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {activeEvent.name}
          </h1>
          <p className="text-xs text-stone-600 mt-1 font-normal">
            Target Date: <strong className="text-stone-800">{formatShortDate(activeEvent.date)}</strong> ({countdown.label}) • Planned for {activeEvent.guestCount} guests
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('live')}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Live Control</span>
          </button>
          <button
            onClick={onOpenAssistant}
            className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4 text-purple-700" />
            <span>Ask AI Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
            <span>{formatINR(activeEvent.budget)}</span>
          </button>
          <button
            onClick={onOpenWizard}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-300" />
            <span>New Celebration</span>
          </button>
        </div>
      </div>

      {/* Snapshot Cards + Event Health Gauge */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
        {/* Metric 1: Countdown */}
        <div
          onClick={() => setActiveTab('overview')}
          className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Countdown</span>
            <Calendar className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-2">
            {countdown.days} {countdown.days === 1 ? 'Day' : 'Days'}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5 truncate">{countdown.label}</p>
        </div>

        {/* Metric 2: Budget Progress */}
        <div
          onClick={() => setActiveTab('budget')}
          className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Budget Spent</span>
            <IndianRupee className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-2">
            {formatINR(totalActual)}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5 truncate">
            {budgetUtilization}% of {formatINR(activeEvent.budget)}
          </p>
        </div>

        {/* Metric 3: Planning Milestones */}
        <div
          onClick={() => setActiveTab('timeline')}
          className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Milestones</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-2">
            {completedTasks} / {totalTasks}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">{taskProgress}% checklist executed</p>
        </div>

        {/* Metric 4: Confirmed RSVPs */}
        <div
          onClick={() => setActiveTab('guests')}
          className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Confirmed RSVPs</span>
            <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-2">
            {confirmedGuests} Attendees
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5 truncate">{activeEvent.guests.length} total invitations</p>
        </div>

        {/* Metric 5: Event Health Score Gauge */}
        <div
          onClick={() => setActiveTab('risk')}
          className="p-5 rounded-3xl bg-linear-to-br from-purple-50/70 to-rose-50/40 border border-purple-200/80 shadow-xs hover:border-purple-400 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">Health Score</span>
            <Activity className="w-4 h-4 text-purple-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="font-serif text-2xl font-bold text-stone-900">
              {healthScore}
            </p>
            <span className="text-xs text-stone-500 font-medium">/ 100</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthBadgeStyle}`}>
              {healthStatus}
            </span>
            <span className="text-[10px] text-purple-700 font-semibold group-hover:underline">Inspect Risks &rarr;</span>
          </div>
        </div>
      </div>

      {/* Quick Launcher Suite Ribbon */}
      <div className="p-4 rounded-3xl bg-stone-50/80 border border-stone-200/70 text-left">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Intelligent Celebration Suites</span>
          </p>
          <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">
            Click any suite to launch specialized workspace
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'simulator' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            <span>⚡ What-If Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'risk' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>🛡️ Risk Predictor</span>
          </button>
          <button
            onClick={() => setActiveTab('moodboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'moodboard' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-rose-500" />
            <span>🎨 Moodboards</span>
          </button>
          <button
            onClick={() => setActiveTab('seating')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'seating' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <Armchair className="w-3.5 h-3.5 text-indigo-500" />
            <span>🗺️ Seating & Venue</span>
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'invitations' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-blue-500" />
            <span>💌 AI Invites</span>
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'emergency' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-rose-500" />
            <span>⚠️ Contingencies</span>
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'live' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-600" />
            <span>🔴 Live Control</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'team' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>👥 Committee</span>
          </button>
          <button
            onClick={() => setActiveTab('eco')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'eco' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>🌱 Eco Audit</span>
          </button>
        </div>
      </div>

      {/* Primary Tabs Navigation Bar */}
      <div className="border-b border-stone-200/80">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-purple-700 text-purple-900 bg-purple-50/50 rounded-t-xl'
                    : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-purple-200 text-purple-950' : 'bg-purple-100/60 text-purple-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && !tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-purple-200 text-purple-900' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Workspace Content */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <EventOverview
            event={activeEvent}
            onUpdateEventPlan={handleUpdatePlan}
            onNavigateToTab={(tab) => setActiveTab(tab as DashboardTab)}
          />
        )}

        {activeTab === 'simulator' && (
          <EventSimulator
            event={activeEvent}
            onApplySimulation={(result) => {
              onUpdateEvent({
                ...activeEvent,
                budget: result.simulatedBudget,
                guestCount: result.simulatedGuests,
                expenses: result.simulatedExpenses
              });
              setActiveTab('budget');
            }}
            onNavigateToBudget={() => setActiveTab('budget')}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlanner
            event={activeEvent}
            onUpdateExpenses={handleUpdateExpenses}
            onUpdateBudget={(b) => onUpdateEvent({ ...activeEvent, budget: b })}
          />
        )}

        {activeTab === 'risk' && (
          <BudgetRiskPredictor
            event={activeEvent}
            onNavigateToBudget={() => setActiveTab('budget')}
          />
        )}

        {activeTab === 'seating' && (
          <SeatingPlanner
            event={activeEvent}
            onUpdateLayout={(layout) => onUpdateEvent({ ...activeEvent, seatingLayout: layout })}
          />
        )}

        {activeTab === 'invitations' && (
          <InvitationStudio
            event={activeEvent}
            onUpdateInvitation={(inv) => onUpdateEvent({ ...activeEvent, invitation: inv })}
          />
        )}

        {activeTab === 'moodboard' && (
          <MoodboardGenerator
            event={activeEvent}
            onUpdateMoodboards={(moodboards) => onUpdateEvent({ ...activeEvent, moodboards })}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyPlanner
            event={activeEvent}
            onUpdateRisks={(risks) => onUpdateEvent({ ...activeEvent, emergencyRisks: risks, risks })}
            onNavigateToLive={() => setActiveTab('live')}
          />
        )}

        {activeTab === 'timeline' && (
          <TaskManager
            event={activeEvent}
            onUpdateTasks={handleUpdateTasks}
          />
        )}

        {activeTab === 'live' && (
          <LiveControlCenter
            event={activeEvent}
            onUpdateSchedule={(schedule) => onUpdateEvent({ ...activeEvent, daySchedule: schedule })}
            onUpdateTasks={handleUpdateTasks}
            onNavigateToEmergency={() => setActiveTab('emergency')}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorManager
            event={activeEvent}
            onUpdateVendors={handleUpdateVendors}
          />
        )}

        {activeTab === 'guests' && (
          <GuestManager
            event={activeEvent}
            onUpdateGuests={handleUpdateGuests}
          />
        )}

        {activeTab === 'team' && (
          <TeamCollaboration
            event={activeEvent}
            onUpdateTeam={(members, comments) =>
              onUpdateEvent({
                ...activeEvent,
                teamMembers: members,
                teamComments: comments
              })
            }
          />
        )}

        {activeTab === 'eco' && (
          <EcoPlanner
            event={activeEvent}
            onUpdateEcoAudit={(ecoAudit) => onUpdateEvent({ ...activeEvent, ecoAudit })}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeaGenerator event={activeEvent} />
        )}
      </div>
    </div>
  );
};
