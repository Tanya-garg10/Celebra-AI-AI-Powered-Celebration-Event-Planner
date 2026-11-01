import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  PlusCircle,
  Phone,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Clock,
  Sparkles,
  HelpCircle,
  Flame,
  CloudRain,
  Zap,
  Truck
} from 'lucide-react';
import { CelebrationEvent, RiskItem } from '../types.ts';

interface EmergencyPlannerProps {
  event: CelebrationEvent;
  onUpdateRisks: (risks: RiskItem[]) => void;
  onNavigateToLive?: () => void;
}

export const EmergencyPlanner: React.FC<EmergencyPlannerProps> = ({
  event,
  onUpdateRisks,
  onNavigateToLive,
}) => {
  const [risks, setRisks] = useState<RiskItem[]>(event.risks || event.emergencyRisks || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskItem | null>(null);

  // Form states
  const [formRisk, setFormRisk] = useState('');
  const [formCategory, setFormCategory] = useState<RiskItem['category']>('Weather');
  const [formProbability, setFormProbability] = useState<RiskItem['probability']>('Medium');
  const [formImpact, setFormImpact] = useState<RiskItem['impact']>('Moderate');
  const [formPlanB, setFormPlanB] = useState('');
  const [formTrigger, setFormTrigger] = useState('');
  const [formContactName, setFormContactName] = useState('');
  const [formContactPhone, setFormContactPhone] = useState('');

  const mitigatedCount = risks.filter((r) => r.status === 'Mitigated').length;
  const criticalCount = risks.filter((r) => r.impact === 'Critical').length;

  const handleOpenAdd = () => {
    setEditingRisk(null);
    setFormRisk('');
    setFormCategory('Weather');
    setFormProbability('Medium');
    setFormImpact('Moderate');
    setFormPlanB('');
    setFormTrigger('');
    setFormContactName('');
    setFormContactPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: RiskItem) => {
    setEditingRisk(r);
    setFormRisk(r.risk);
    setFormCategory(r.category);
    setFormProbability(r.probability);
    setFormImpact(r.impact);
    setFormPlanB(r.contingencyPlanB);
    setFormTrigger(r.triggerCondition);
    setFormContactName(r.emergencyContactName);
    setFormContactPhone(r.emergencyPhone);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (r: RiskItem) => {
    const updated = risks.map((item) =>
      item.id === r.id
        ? { ...item, status: (item.status === 'Mitigated' ? 'Monitoring' : 'Mitigated') as any }
        : item
    );
    setRisks(updated);
    onUpdateRisks(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this risk and contingency protocol?')) {
      const updated = risks.filter((r) => r.id !== id);
      setRisks(updated);
      onUpdateRisks(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRisk.trim()) return;

    if (editingRisk) {
      const updated = risks.map((item) =>
        item.id === editingRisk.id
          ? {
              ...item,
              risk: formRisk.trim(),
              category: formCategory,
              probability: formProbability,
              impact: formImpact,
              contingencyPlanB: formPlanB.trim(),
              triggerCondition: formTrigger.trim(),
              emergencyContactName: formContactName.trim(),
              emergencyPhone: formContactPhone.trim()
            }
          : item
      );
      setRisks(updated);
      onUpdateRisks(updated);
    } else {
      const newItem: RiskItem = {
        id: `risk-${Date.now()}`,
        risk: formRisk.trim(),
        category: formCategory,
        probability: formProbability,
        impact: formImpact,
        contingencyPlanB: formPlanB.trim(),
        triggerCondition: formTrigger.trim(),
        emergencyContactName: formContactName.trim(),
        emergencyPhone: formContactPhone.trim(),
        status: 'Monitoring'
      };
      const updated = [...risks, newItem];
      setRisks(updated);
      onUpdateRisks(updated);
    }
    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat: RiskItem['category']) => {
    switch (cat) {
      case 'Weather':
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case 'Technical':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'Logistics':
        return <Truck className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Emergency & Backup Contingency Planner
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Proactively identify celebration vulnerabilities (monsoons, power dropouts, vendor delays) and lock fail-safe Plan B action plans.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-rose-300" />
          <span>Add Risk Protocol</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-400">Total Risk Scenarios</p>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-1">{risks.length}</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Weather, power, vendors</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-emerald-800">Plan B Ready</p>
          <p className="font-serif text-2xl font-bold text-emerald-950 mt-1">{mitigatedCount}</p>
          <p className="text-[11px] text-emerald-800 mt-0.5">Mitigated & backed up</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-rose-800">Critical Priority</p>
          <p className="font-serif text-2xl font-bold text-rose-950 mt-1">{criticalCount}</p>
          <p className="text-[11px] text-rose-800 mt-0.5">High disruption impact</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-400">Emergency Contacts</p>
          <p className="font-serif text-2xl font-bold text-purple-900 mt-1">
            {risks.filter((r) => r.emergencyPhone).length}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">Direct speed-dials logged</p>
        </div>
      </div>

      {/* Risk Protocols List */}
      <div className="space-y-4">
        {risks.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:border-purple-300 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="p-1 rounded-md bg-stone-100 flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.impact === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : item.impact === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    Impact: {item.impact}
                  </span>
                  <span className="text-[10px] font-semibold text-stone-500">
                    Probability: {item.probability}
                  </span>
                </div>

                <h4 className="font-serif text-base font-bold text-stone-900">
                  {item.risk}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    item.status === 'Mitigated'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.status}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Edit Protocol"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Protocol"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Plan B Strategy Box */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 text-xs space-y-1.5">
              <p className="font-bold text-stone-900 flex items-center gap-1 text-purple-950">
                <span>🛡️ Plan B Contingency Protocol:</span>
              </p>
              <p className="text-stone-700 leading-relaxed font-normal">
                {item.contingencyPlanB}
              </p>
            </div>

            {/* Trigger condition & SOS speed-dial */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
              <div className="text-stone-500">
                <span className="font-semibold text-stone-700">Trigger Threshold: </span>
                <span>{item.triggerCondition || 'Immediate host assessment'}</span>
              </div>

              {item.emergencyPhone && (
                <div className="flex items-center gap-1.5 text-rose-800 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200/70 font-semibold">
                  <Phone className="w-3 h-3" />
                  <span>SOS: {item.emergencyContactName} ({item.emergencyPhone})</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Risk Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingRisk ? 'Edit Contingency Protocol' : 'Add Risk & Backup Plan'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Risk Scenario
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unseasonal rain shower on outdoor lawn"
                  value={formRisk}
                  onChange={(e) => setFormRisk(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="Weather">Weather</option>
                    <option value="Technical">Technical</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Catering">Catering</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Probability
                  </label>
                  <select
                    value={formProbability}
                    onChange={(e) => setFormProbability(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Disruption Impact
                  </label>
                  <select
                    value={formImpact}
                    onChange={(e) => setFormImpact(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Plan B Contingency Protocol
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specific backup steps, secondary supplier, indoor switchover plan"
                  value={formPlanB}
                  onChange={(e) => setFormPlanB(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Trigger Threshold
                </label>
                <input
                  type="text"
                  placeholder="e.g. If rain forecast crosses 40% on morning weather update"
                  value={formTrigger}
                  onChange={(e) => setFormTrigger(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Venue Operations Lead"
                    value={formContactName}
                    onChange={(e) => setFormContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formContactPhone}
                    onChange={(e) => setFormContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Save Contingency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
