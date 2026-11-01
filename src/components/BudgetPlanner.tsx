import React, { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import {
  PlusCircle,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  IndianRupee,
  Layers,
  ArrowDownRight,
  Loader2,
  Check
} from 'lucide-react';
import {
  BudgetCategory,
  BudgetOptimizationSuggestion,
  CelebrationEvent,
  Expense
} from '../types.ts';
import { formatINR } from '../utils/formatters.ts';
import { optimizeBudgetAPI } from '../services/api.ts';

interface BudgetPlannerProps {
  event: CelebrationEvent;
  onUpdateExpenses: (expenses: Expense[]) => void;
  onUpdateBudget: (newBudget: number) => void;
}

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  Venue: '#7C5EB6',
  Catering: '#F97352',
  Decoration: '#6B9080',
  Photography: '#3B82F6',
  Entertainment: '#EC4899',
  Invitations: '#EAB308',
  Transportation: '#14B8A6',
  Miscellaneous: '#94A3B8'
};

const CATEGORIES: BudgetCategory[] = [
  'Venue',
  'Catering',
  'Decoration',
  'Photography',
  'Entertainment',
  'Invitations',
  'Transportation',
  'Miscellaneous'
];

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  event,
  onUpdateExpenses,
  onUpdateBudget,
}) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<BudgetOptimizationSuggestion | null>(null);

  // Form state
  const [formCategory, setFormCategory] = useState<BudgetCategory>('Venue');
  const [formTitle, setFormTitle] = useState('');
  const [formEstimatedCost, setFormEstimatedCost] = useState<number>(0);
  const [formActualCost, setFormActualCost] = useState<number>(0);
  const [formPaidAmount, setFormPaidAmount] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<'Paid' | 'Pending' | 'Partial'>('Pending');
  const [formNotes, setFormNotes] = useState('');

  // Calculations
  const totalBudget = event.budget || 0;
  const totalEstimated = event.expenses.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);
  const totalActual = event.expenses.reduce((acc, curr) => acc + (curr.actualCost || 0), 0);
  const totalPaid = event.expenses.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
  const remainingBudget = totalBudget - totalActual;
  const utilizationPercent = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;
  const isOverBudget = totalActual > totalBudget || totalEstimated > totalBudget;
  const overAmount = Math.max(0, Math.max(totalActual, totalEstimated) - totalBudget);

  // Category aggregates for charts
  const categoryData = CATEGORIES.map((cat) => {
    const items = event.expenses.filter((e) => e.category === cat);
    const catEstimated = items.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
    const catActual = items.reduce((sum, item) => sum + (item.actualCost || 0), 0);
    const catPaid = items.reduce((sum, item) => sum + (item.paidAmount || 0), 0);

    return {
      name: cat,
      estimated: catEstimated,
      actual: catActual,
      paid: catPaid,
      color: CATEGORY_COLORS[cat]
    };
  }).filter((d) => d.estimated > 0 || d.actual > 0);

  // Open modal for new expense
  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormCategory('Venue');
    setFormTitle('');
    setFormEstimatedCost(10000);
    setFormActualCost(10000);
    setFormPaidAmount(0);
    setFormStatus('Pending');
    setFormNotes('');
    setIsExpenseModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setFormCategory(exp.category);
    setFormTitle(exp.title);
    setFormEstimatedCost(exp.estimatedCost);
    setFormActualCost(exp.actualCost);
    setFormPaidAmount(exp.paidAmount);
    setFormStatus(exp.status);
    setFormNotes(exp.notes || '');
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingExpense) {
      const updated = event.expenses.map((item) =>
        item.id === editingExpense.id
          ? {
              ...item,
              category: formCategory,
              title: formTitle.trim(),
              estimatedCost: Number(formEstimatedCost),
              actualCost: Number(formActualCost),
              paidAmount: Number(formPaidAmount),
              status: formStatus,
              notes: formNotes.trim()
            }
          : item
      );
      onUpdateExpenses(updated);
    } else {
      const newExp: Expense = {
        id: `exp-${Date.now()}`,
        category: formCategory,
        title: formTitle.trim(),
        estimatedCost: Number(formEstimatedCost),
        actualCost: Number(formActualCost),
        paidAmount: Number(formPaidAmount),
        status: formStatus,
        notes: formNotes.trim(),
        date: new Date().toISOString().split('T')[0]
      };
      onUpdateExpenses([...event.expenses, newExp]);
    }

    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Delete this expense line item?')) {
      onUpdateExpenses(event.expenses.filter((e) => e.id !== id));
    }
  };

  // Featherless AI Budget Optimization Trigger
  const handleOptimizeBudget = async () => {
    setIsOptimizing(true);
    try {
      const payload = {
        eventName: event.name,
        budget: totalBudget,
        estimatedCost: Math.max(totalEstimated, totalActual),
        actualSpent: totalActual,
        categories: categoryData
      };
      const response = await optimizeBudgetAPI(payload);
      if (response?.optimization) {
        setOptimizationResult(response.optimization);
      }
    } catch (err) {
      alert('Failed to analyze budget. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const filteredExpenses = event.expenses.filter(
    (e) => selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter
  );

  return (
    <div className="space-y-8 text-left">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Budget */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available Budget</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-2">
            {formatINR(totalBudget)}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Target ceiling for {event.guestCount} guests
          </p>
        </div>

        {/* Card 2: Estimated / Committed Cost */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Costs</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-2">
            {formatINR(totalEstimated)}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Sum of all planned category allocations
          </p>
        </div>

        {/* Card 3: Actual Logged Expenses */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Actual Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-2">
            {formatINR(totalActual)}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {formatINR(totalPaid)} already disbursed
          </p>
        </div>

        {/* Card 4: Remaining Balance & Health */}
        <div className={`p-5 rounded-3xl border shadow-xs ${
          isOverBudget
            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
            : 'bg-white border-stone-200/80 text-stone-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {isOverBudget ? 'Budget Overrun' : 'Remaining Balance'}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isOverBudget ? 'bg-rose-200 text-rose-800' : 'bg-emerald-50 text-emerald-700'
            }`}>
              {isOverBudget ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
          </div>
          <p className="font-serif text-2xl font-bold mt-2">
            {isOverBudget ? `-${formatINR(overAmount)}` : formatINR(remainingBudget)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-stone-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  utilizationPercent > 100
                    ? 'bg-rose-600'
                    : utilizationPercent > 85
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, utilizationPercent)}%` }}
              />
            </div>
            <span className="text-[11px] font-bold">{utilizationPercent}%</span>
          </div>
        </div>
      </div>

      {/* Over-budget AI Recommendation Callout Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isOverBudget
          ? 'bg-gradient-to-r from-rose-50 via-amber-50 to-purple-50 border-rose-200'
          : 'bg-gradient-to-r from-purple-50 via-stone-50 to-amber-50 border-purple-200'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <h4 className="font-serif text-base font-bold text-stone-900">
              {isOverBudget
                ? `Cost Overrun Detected: Save ₹${overAmount.toLocaleString('en-IN')} with Featherless AI`
                : 'Celebra AI Smart Budget Optimization'}
            </h4>
          </div>
          <p className="text-xs text-stone-600 max-w-2xl font-normal">
            {isOverBudget
              ? 'Your estimated cost exceeds the designated target. Ask Featherless AI to pinpoint redundant items and deliver practical cost-saving alternatives without compromising guest delight.'
              : 'Audit your current expenses against industry benchmark averages to find potential savings and negotiate vendor quotes.'}
          </p>
        </div>

        <button
          onClick={handleOptimizeBudget}
          disabled={isOptimizing}
          className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shrink-0 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Budget...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Optimize Budget with AI</span>
            </>
          )}
        </button>
      </div>

      {/* AI Budget Optimization Results (if available) */}
      {optimizationResult && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-purple-200 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Featherless AI Cost Reduction Blueprint
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Target Savings: {formatINR(optimizationResult.targetSavings)}
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100">
            <span className="font-bold text-purple-900">Executive Summary: </span>
            {optimizationResult.summary}
          </p>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              High-Impact Cost Saving Recommendations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {optimizationResult.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-purple-900">{rec.category}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Save {formatINR(rec.potentialSaving)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 mt-1 font-medium">{rec.action}</p>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-3 pt-2 border-t border-stone-200/60">
                    <span className="font-semibold text-stone-700">Guest Experience: </span>
                    {rec.impactOnExperience}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Swaps & Contingency Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs">
              <p className="font-bold text-amber-900 mb-1.5">Suggested Smart Swaps</p>
              <ul className="list-disc list-inside space-y-1 text-amber-950">
                {optimizationResult.smartSwaps.map((sw, i) => (
                  <li key={i}>{sw}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs">
              <p className="font-bold text-stone-900 mb-1.5">Contingency Safeguard</p>
              <p className="text-stone-700 leading-relaxed font-normal">{optimizationResult.contingencyAdvice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Charts Grid: Donut + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Share Donut Chart */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
            Category-wise Allocation
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Percentage distribution across active celebration departments
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  dataKey="actual"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), 'Spent']}
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid #E7E5E4',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center mt-3">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated vs Actual Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
            Allocated vs Actual Spending
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Comparison of initial plan estimates against actual vendor commitments
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value))]}
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid #E7E5E4',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="estimated" name="Planned" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual / Committed" fill="#7C5EB6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expenses Table & Management */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Expense Log & Contracts
            </h3>
            <p className="text-xs text-stone-500">
              {event.expenses.length} itemized celebration commitments
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-300" />
            <span>Add New Expense</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategoryFilter === cat
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table of expenses */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Title & Category</th>
                <th className="py-3 px-3">Estimated</th>
                <th className="py-3 px-3">Actual Cost</th>
                <th className="py-3 px-3">Paid / Status</th>
                <th className="py-3 px-3">Notes</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-stone-900">{exp.title}</p>
                    <span
                      className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#78716C' }}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-stone-600 font-medium">
                    {formatINR(exp.estimatedCost)}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-stone-900">
                    {formatINR(exp.actualCost)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        exp.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exp.status === 'Partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {exp.status === 'Paid' && <Check className="w-3 h-3" />}
                      {exp.status} ({formatINR(exp.paidAmount)})
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-stone-500 max-w-xs truncate">
                    {exp.notes || '—'}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(exp)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Edit Expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingExpense ? 'Edit Expense Record' : 'Record Celebration Expense'}
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Expense Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandap Floral Architecture or Wedding Cake"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-purple-600 text-xs outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as BudgetCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:border-purple-600 text-xs outline-hidden"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:border-purple-600 text-xs outline-hidden"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial Advance</option>
                    <option value="Paid">Fully Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Estimated (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formEstimatedCost}
                    onChange={(e) => setFormEstimatedCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Actual / Agreed (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formActualCost}
                    onChange={(e) => setFormActualCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Paid Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formPaidAmount}
                    onChange={(e) => setFormPaidAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Notes & Vendor Inclusions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 50% advance disbursed, remaining balance due on setup day"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
