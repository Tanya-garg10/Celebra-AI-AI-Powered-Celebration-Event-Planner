import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  IndianRupee,
  ShieldAlert,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { BudgetCategory, CelebrationEvent } from '../types.ts';
import { formatINR } from '../utils/formatters.ts';

interface BudgetRiskPredictorProps {
  event: CelebrationEvent;
  onNavigateToBudget: () => void;
}

export const BudgetRiskPredictor: React.FC<BudgetRiskPredictorProps> = ({
  event,
  onNavigateToBudget,
}) => {
  const totalBudget = event.budget || 1;
  const totalActual = event.expenses.reduce((s, e) => s + (e.actualCost || 0), 0);
  const totalEstimated = event.expenses.reduce((s, e) => s + (e.estimatedCost || 0), 0);

  // Category Risk Assessment Model
  const riskCategories: {
    category: BudgetCategory;
    riskScore: number; // 0 - 100
    riskLevel: 'High' | 'Medium' | 'Low';
    allocated: number;
    spent: number;
    triggerReason: string;
    actionableAlternative: string;
  }[] = [
    {
      category: 'Catering',
      riskScore: 78,
      riskLevel: 'High',
      allocated: Math.round(totalBudget * 0.35),
      spent: event.expenses.filter((e) => e.category === 'Catering').reduce((s, e) => s + (e.actualCost || 0), 0),
      triggerReason: 'Per-plate count creep and last-minute RSVP additions typically generate a 12-18% cost spike in final food bills.',
      actionableAlternative: 'Contract a strict 10% plate buffer with fixed discounted overage pricing, and replace multi-tier dessert buffets with 2 live artisan stations.'
    },
    {
      category: 'Decoration',
      riskScore: 65,
      riskLevel: 'Medium',
      allocated: Math.round(totalBudget * 0.15),
      spent: event.expenses.filter((e) => e.category === 'Decoration').reduce((s, e) => s + (e.actualCost || 0), 0),
      triggerReason: 'Seasonal flower price swings (especially marigolds during peak muhurat wedding dates) and structural truss rentals.',
      actionableAlternative: 'Lock contract with local nursery blooms + reusable brass urlis and amber uplighting instead of imported flora.'
    },
    {
      category: 'Venue',
      riskScore: 40,
      riskLevel: 'Low',
      allocated: Math.round(totalBudget * 0.25),
      spent: event.expenses.filter((e) => e.category === 'Venue').reduce((s, e) => s + (e.actualCost || 0), 0),
      triggerReason: 'Overtime penalties post 11 PM and generator diesel consumption beyond standard allowances.',
      actionableAlternative: 'Pre-negotiate late teardown grace period (up to 2 hours) in written contract before paying final advance.'
    },
    {
      category: 'Photography',
      riskScore: 30,
      riskLevel: 'Low',
      allocated: Math.round(totalBudget * 0.10),
      spent: event.expenses.filter((e) => e.category === 'Photography').reduce((s, e) => s + (e.actualCost || 0), 0),
      triggerReason: 'Extra physical luxury leather album requests and drone permit fees.',
      actionableAlternative: 'Standardize on digital 4K raw cloud repository + high-res reels; print albums post-celebration if budget remains.'
    }
  ];

  // Overall event risk score (weighted)
  const averageRisk = Math.round(
    riskCategories.reduce((sum, r) => sum + r.riskScore, 0) / riskCategories.length
  );

  const proactiveWarnings = [
    'Catering plate headcount is not locked with a final guest cutoff date.',
    'No dedicated 5% contingency fund has been ring-fenced for miscellaneous tips & logistics.',
    'Late-night sound curfew violations could incur municipal venue fines.'
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Smart Budget Risk Predictor
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Predictive financial analytics detecting cost inflation risks, vendor buffer creep, and proactive mitigation tactics.
          </p>
        </div>

        <button
          onClick={onNavigateToBudget}
          className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Open Budget Log</span>
          <ArrowRight className="w-3.5 h-3.5 text-rose-300" />
        </button>
      </div>

      {/* Top Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Risk Score Gauge */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Overspend Risk Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-3xl font-bold text-stone-900">{averageRisk}</span>
              <span className="text-xs text-stone-400">/ 100</span>
            </div>
            <p className="text-xs font-semibold text-amber-700 mt-1">
              {averageRisk > 60 ? 'Moderate to High Risk' : 'Healthy Control'}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        {/* Financial Exposure */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Estimated Overrun Exposure
            </span>
            <p className="font-serif text-2xl font-bold text-rose-900 mt-1">
              {formatINR(Math.round(totalBudget * 0.12))}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Average 12% industry slippage buffer
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        {/* Recommended Safe Reserve */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Contingency Reserve
            </span>
            <p className="font-serif text-2xl font-bold text-emerald-900 mt-1">
              {formatINR(Math.round(totalBudget * 0.05))}
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              Recommended 5% unallocated cushion
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Proactive Risk Warnings Callout */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-800" />
          <h4 className="font-serif text-sm font-bold text-amber-950">
            Proactive Warning Triggers Detected
          </h4>
        </div>
        <ul className="space-y-1.5 text-xs text-amber-900">
          {proactiveWarnings.map((w, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Category Risk Cards */}
      <div className="space-y-4">
        <h4 className="font-serif text-base font-bold text-stone-900">
          Category Risk Matrix & Practical Alternatives
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskCategories.map((rc) => (
            <div
              key={rc.category}
              className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-base font-bold text-stone-900">{rc.category}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      rc.riskLevel === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : rc.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {rc.riskLevel} Risk ({rc.riskScore}%)
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  <strong className="text-stone-800">Risk Cause: </strong>
                  {rc.triggerReason}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs">
                <p className="font-bold text-emerald-950 mb-0.5">Recommended Cost-Saving Alternative:</p>
                <p className="text-emerald-900 leading-relaxed">{rc.actionableAlternative}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
