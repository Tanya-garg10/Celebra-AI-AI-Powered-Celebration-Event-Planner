import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Check,
  RotateCcw,
  AlertTriangle,
  IndianRupee,
  Users,
  Clock,
  Layers,
  ShieldAlert
} from 'lucide-react';
import {
  BudgetCategory,
  CelebrationEvent,
  PlanningMode,
  SimulationResult,
  VenuePreference
} from '../types.ts';
import { formatINR } from '../utils/formatters.ts';

interface EventSimulatorProps {
  event: CelebrationEvent;
  onApplyChanges?: (newGuestCount: number, newBudget: number, newDuration: string) => void;
  onApplySimulation?: (result: { simulatedGuests: number; simulatedBudget: number; simulatedExpenses: any[] }) => void;
  onNavigateToBudget?: () => void;
}

export const EventSimulator: React.FC<EventSimulatorProps> = ({
  event,
  onApplyChanges,
  onApplySimulation,
  onNavigateToBudget,
}) => {
  // Simulator Controls
  const [simGuests, setSimGuests] = useState<number>(event.guestCount || 100);
  const [simBudget, setSimBudget] = useState<number>(event.budget || 500000);
  const [simDuration, setSimDuration] = useState<string>(event.duration || '1 Day');
  const [simPlanningMode, setSimPlanningMode] = useState<PlanningMode>('Balanced');
  const [hasApplied, setHasApplied] = useState(false);

  // Original baselines
  const origGuests = event.guestCount || 1;
  const origBudget = event.budget || 1;
  const origCostPerGuest = Math.round(origBudget / origGuests);

  // Simulated metrics
  const simCostPerGuest = Math.round(simBudget / simGuests);
  const costPerGuestDelta = simCostPerGuest - origCostPerGuest;
  const budgetDelta = simBudget - origBudget;
  const guestDelta = simGuests - origGuests;

  // Multiplier for category scaling based on planning mode
  const modeMultiplier =
    simPlanningMode === 'Budget'
      ? { Catering: 0.38, Venue: 0.22, Decoration: 0.12, Photography: 0.08, Entertainment: 0.05, Invitations: 0.02, Transportation: 0.03, Miscellaneous: 0.10 }
      : simPlanningMode === 'Premium'
      ? { Catering: 0.35, Venue: 0.28, Decoration: 0.18, Photography: 0.10, Entertainment: 0.05, Invitations: 0.01, Transportation: 0.02, Miscellaneous: 0.01 }
      : { Catering: 0.35, Venue: 0.25, Decoration: 0.15, Photography: 0.10, Entertainment: 0.06, Invitations: 0.02, Transportation: 0.03, Miscellaneous: 0.04 };

  const categories: BudgetCategory[] = [
    'Catering',
    'Venue',
    'Decoration',
    'Photography',
    'Entertainment',
    'Invitations',
    'Transportation',
    'Miscellaneous'
  ];

  const categoryDeltas = categories.map((cat) => {
    const origExp = event.expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + (e.estimatedCost || 0), 0);

    const targetRatio = (modeMultiplier as any)[cat] || 0.1;
    const simExp = Math.round(simBudget * targetRatio);
    return {
      category: cat,
      original: origExp,
      simulated: simExp,
      diff: simExp - origExp
    };
  });

  // Logistical metrics
  const seatingRowsNeeded = Math.ceil(simGuests / 8);
  const staffRecommended = Math.ceil(simGuests / 15);

  let riskAlert = 'Plan is well-balanced within normal operating thresholds.';
  let isHighRisk = false;
  if (simCostPerGuest < 1200 && event.eventType === 'Wedding') {
    riskAlert = 'Critical Risk: Budget per guest is under ₹1,200. Catering and venue quality will face severe strain for a wedding.';
    isHighRisk = true;
  } else if (simGuests > origGuests * 1.4 && simBudget <= origBudget) {
    riskAlert = 'Scale Warning: Guest count surged by over 40% with no budget increase. Plate and seating buffers must be heavily curtailed.';
    isHighRisk = true;
  } else if (simCostPerGuest > origCostPerGuest * 1.5) {
    riskAlert = 'Premium Tier: Generous allocation per attendee allows luxury live counters, imported florals, and drone cinematography.';
  }

  const handleApply = () => {
    if (onApplySimulation) {
      const updatedExpenses = event.expenses.map((e) => {
        const delta = categoryDeltas.find((d) => d.category === e.category);
        return delta ? { ...e, estimatedCost: delta.simulated } : e;
      });
      onApplySimulation({
        simulatedGuests: simGuests,
        simulatedBudget: simBudget,
        simulatedExpenses: updatedExpenses,
      });
    } else if (onApplyChanges) {
      onApplyChanges(simGuests, simBudget, simDuration);
    }
    setHasApplied(true);
    setTimeout(() => setHasApplied(false), 2500);
  };

  const handleReset = () => {
    setSimGuests(event.guestCount);
    setSimBudget(event.budget);
    setSimDuration(event.duration);
    setSimPlanningMode('Balanced');
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              What-If Event Simulation Engine
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Simulate variations in guest scale, budget ceiling, and planning modes to observe immediate financial & logistical trade-offs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            {hasApplied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Committed to Event!</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 text-amber-200" />
                <span>Apply Simulation to Event</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulator Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slider 1: Guest Scale */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              Simulated Guests
            </span>
            <span className="font-serif text-lg font-bold text-stone-900">
              {simGuests} Pax
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="1000"
            step="10"
            value={simGuests}
            onChange={(e) => setSimGuests(Number(e.target.value))}
            className="w-full accent-purple-700 cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>Base: {origGuests} guests</span>
            <span className={`font-bold ${guestDelta > 0 ? 'text-amber-700' : guestDelta < 0 ? 'text-blue-700' : 'text-stone-500'}`}>
              {guestDelta > 0 ? `+${guestDelta}` : guestDelta} variance
            </span>
          </div>
        </div>

        {/* Slider 2: Total Budget */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
              Simulated Budget
            </span>
            <span className="font-serif text-lg font-bold text-purple-900">
              {formatINR(simBudget)}
            </span>
          </div>

          <input
            type="range"
            min="50000"
            max="3000000"
            step="25000"
            value={simBudget}
            onChange={(e) => setSimBudget(Number(e.target.value))}
            className="w-full accent-purple-700 cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>Base: {formatINR(origBudget)}</span>
            <span className={`font-bold ${budgetDelta > 0 ? 'text-emerald-700' : budgetDelta < 0 ? 'text-rose-700' : 'text-stone-500'}`}>
              {budgetDelta > 0 ? `+${formatINR(budgetDelta)}` : formatINR(budgetDelta)}
            </span>
          </div>
        </div>

        {/* Planning Tier Selector */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-3">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Planning Strategy Tier
          </span>

          <div className="grid grid-cols-3 gap-1.5">
            {(['Budget', 'Balanced', 'Premium'] as PlanningMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSimPlanningMode(mode)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  simPlanningMode === mode
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-stone-500">
            {simPlanningMode === 'Budget' && 'Focuses 70% of spend on food & essential venue rent.'}
            {simPlanningMode === 'Balanced' && 'Standard industry allocation with healthy contingency.'}
            {simPlanningMode === 'Premium' && 'Enhances decor, cinematic video reels, and live performers.'}
          </p>
        </div>
      </div>

      {/* Impact Evaluation Banner */}
      <div className={`p-5 rounded-3xl border ${
        isHighRisk ? 'bg-rose-50/80 border-rose-200 text-rose-950' : 'bg-purple-50/70 border-purple-200 text-purple-950'
      }`}>
        <div className="flex items-start gap-3">
          {isHighRisk ? (
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-serif text-sm font-bold">Simulator Feasibility Assessment</h4>
            <p className="text-xs mt-1 leading-relaxed">{riskAlert}</p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold text-stone-400 uppercase">Cost Per Guest</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif text-xl font-bold text-stone-900">{formatINR(simCostPerGuest)}</span>
            <span className="text-[11px] text-stone-400 line-through">{formatINR(origCostPerGuest)}</span>
          </div>
          <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${costPerGuestDelta > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {costPerGuestDelta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {costPerGuestDelta > 0 ? `+${formatINR(costPerGuestDelta)} per head` : `${formatINR(costPerGuestDelta)} per head`}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold text-stone-400 uppercase">Round Tables Needed</p>
          <p className="font-serif text-xl font-bold text-stone-900 mt-1">{seatingRowsNeeded} Tables</p>
          <p className="text-[11px] text-stone-500 mt-1">Assuming standard 8-pax round setup</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold text-stone-400 uppercase">Hospitality Staff Ratio</p>
          <p className="font-serif text-xl font-bold text-stone-900 mt-1">{staffRecommended} Captains & Servers</p>
          <p className="text-[11px] text-stone-500 mt-1">1:15 server to attendee ratio</p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold text-stone-400 uppercase">Catering Buffet Length</p>
          <p className="font-serif text-xl font-bold text-stone-900 mt-1">{Math.ceil(simGuests / 60)} Double-Sided Runs</p>
          <p className="text-[11px] text-stone-500 mt-1">Prevents food line congestion</p>
        </div>
      </div>

      {/* Category Impact Comparison Table */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs overflow-x-auto space-y-4">
        <h4 className="font-serif text-base font-bold text-stone-900">
          Simulated Budget Category Distribution
        </h4>

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider font-bold">
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Current Allocation</th>
              <th className="py-2.5 px-3">Simulated Target</th>
              <th className="py-2.5 px-3">Delta Variance</th>
              <th className="py-2.5 px-3">Logistical Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {categoryDeltas.map((item) => (
              <tr key={item.category} className="hover:bg-stone-50/70">
                <td className="py-3 px-3 font-bold text-stone-900">{item.category}</td>
                <td className="py-3 px-3 text-stone-500">{formatINR(item.original)}</td>
                <td className="py-3 px-3 font-bold text-purple-900">{formatINR(item.simulated)}</td>
                <td className="py-3 px-3">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                      item.diff > 0
                        ? 'bg-amber-100 text-amber-800'
                        : item.diff < 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.diff > 0 ? `+${formatINR(item.diff)}` : formatINR(item.diff)}
                  </span>
                </td>
                <td className="py-3 px-3 text-stone-600">
                  {item.category === 'Catering'
                    ? `Per-plate estimate adjusted for ${simGuests} guests`
                    : item.category === 'Venue'
                    ? 'Rental buffer for simulated square footage'
                    : 'Proportionally scaled to total simulated budget'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
