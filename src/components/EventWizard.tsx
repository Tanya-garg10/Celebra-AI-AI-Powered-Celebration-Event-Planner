import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Clock,
  Palette,
  Utensils,
  Building,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CelebrationEvent,
  EventType,
  FoodPreference,
  VenuePreference
} from '../types.ts';
import { formatINR } from '../utils/formatters.ts';
import { generateEventPlanAPI } from '../services/api.ts';

interface EventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: CelebrationEvent) => void;
}

const EVENT_TYPES: { type: EventType; label: string; icon: string }[] = [
  { type: 'Wedding', label: 'Wedding', icon: '💍' },
  { type: 'Birthday', label: 'Birthday', icon: '🎂' },
  { type: 'Anniversary', label: 'Anniversary', icon: '🥂' },
  { type: 'College Event', label: 'College Fest', icon: '🎓' },
  { type: 'Community Event', label: 'Community Gala', icon: '🪔' },
  { type: 'Other', label: 'Custom Celebration', icon: '✨' }
];

const THEME_PRESETS = [
  {
    name: 'Royal Ivory & Burnished Gold',
    colors: ['#FAF8F5', '#E59866', '#D4AF37'],
    desc: 'Timeless palace aesthetic with warm marigold accents.'
  },
  {
    name: 'Sage Botanical & Lavender',
    colors: ['#6B9080', '#EDE9FE', '#FAF8F5'],
    desc: 'Refreshing eucalyptus greens, blooming lavender, and natural linens.'
  },
  {
    name: 'Midnight Celestial & Glow',
    colors: ['#111827', '#7C5EB6', '#F97352'],
    desc: 'Deep evening tones with neon accents and starlight canopy.'
  },
  {
    name: 'Sunset Peach & Rose Blush',
    colors: ['#F9A074', '#FDEEE9', '#D97706'],
    desc: 'Warm golden-hour hues, pastel roses, and terracotta textures.'
  },
  {
    name: 'Minimal Modern Monochrome',
    colors: ['#1C1917', '#78716C', '#FFFFFF'],
    desc: 'High-contrast architectural chic with warm halogen accentuation.'
  }
];

const PRIORITY_OPTIONS = [
  'Culinary Excellence & Live Counters',
  'Visual Decor & Photogenic Backdrops',
  'Cinematic Photography & Highlight Reels',
  'Live Music, DJ & Entertainment',
  'Elderly & Guest Hospitality Comfort',
  'Eco-Friendly & Zero-Waste Planning'
];

export const EventWizard: React.FC<EventWizardProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const [guestCount, setGuestCount] = useState<number>(100);
  const [budget, setBudget] = useState<number>(300000);
  const [duration, setDuration] = useState<string>('1 Evening (6 Hours)');

  const [venuePreference, setVenuePreference] = useState<VenuePreference>('Outdoor');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('Both');
  const [themePreference, setThemePreference] = useState<string>('Royal Ivory & Burnished Gold');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Culinary Excellence & Live Counters',
    'Visual Decor & Photogenic Backdrops'
  ]);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');

  if (!isOpen) return null;

  const handlePriorityToggle = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!name.trim()) {
        setErrorMessage('Please provide a name for your celebration.');
        return;
      }
      if (!location.trim()) {
        setErrorMessage('Please specify the city or venue destination.');
        return;
      }
    }
    if (step === 2) {
      if (budget <= 0) {
        setErrorMessage('Please set a valid budget amount in INR.');
        return;
      }
      if (guestCount <= 0) {
        setErrorMessage('Expected guests must be at least 1.');
        return;
      }
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await generateEventPlanAPI({
        eventType,
        name: name.trim(),
        date,
        location: location.trim(),
        guestCount,
        budget,
        duration,
        themePreference,
        venuePreference,
        foodPreference,
        specialRequirements: specialRequirements.trim(),
        priorities: selectedPriorities
      });

      const aiPlan = response.plan;

      // Automatically construct starter expenses from AI breakdown
      const initialExpenses = aiPlan.costBreakdown.map((item, index) => ({
        id: `gen-exp-${Date.now()}-${index}`,
        category: item.category,
        title: `${item.category} Contract & Arrangements`,
        estimatedCost: item.estimatedAmount,
        actualCost: item.estimatedAmount,
        paidAmount: 0,
        status: 'Pending' as const,
        notes: item.notes,
        date: date || new Date().toISOString().split('T')[0]
      }));

      // Automatically construct starter tasks from AI timeline
      const initialTasks = aiPlan.preparationTimeline.map((item, index) => ({
        id: `gen-tsk-${Date.now()}-${index}`,
        name: item.task,
        description: `Execute milestone for ${item.phase}`,
        priority: item.priority,
        deadline: date || new Date().toISOString().split('T')[0],
        status: 'Pending' as const,
        phase: item.phase
      }));

      // Create new event instance
      const newEvent: CelebrationEvent = {
        id: `evt-${Date.now()}`,
        name: name.trim(),
        eventType,
        date: date || '2026-12-25',
        location: location.trim(),
        guestCount,
        budget,
        duration,
        themePreference,
        venuePreference,
        foodPreference,
        specialRequirements: specialRequirements.trim(),
        priorities: selectedPriorities,
        createdAt: new Date().toISOString(),
        aiPlan,
        expenses: initialExpenses,
        tasks: initialTasks,
        vendors: [],
        guests: []
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }

      onEventCreated(newEvent);
      onClose();
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMessage('Could not generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with progress */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                Step {step} of 4
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {step === 1 && 'Celebration Essentials'}
                {step === 2 && 'Scale & Budget'}
                {step === 3 && 'Aesthetic & Hospitality'}
                {step === 4 && 'Review & Generate'}
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-stone-900 mt-1">
              Plan Your Celebration with Celebra AI
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 rounded-full hover:bg-stone-200/60 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1">
          <div
            className="bg-purple-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-left space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Essentials */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  1. Select Event Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EVENT_TYPES.map((et) => (
                    <button
                      key={et.type}
                      type="button"
                      onClick={() => setEventType(et.type)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        eventType === et.type
                          ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-bold shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-xl">{et.icon}</span>
                      <span className="text-xs truncate">{et.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  2. Celebration Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav & Meera's Wedding or Maya's 25th Sunset Birthday"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm outline-hidden transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    City or Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Udaipur, Mumbai, Goa, Bengaluru"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Scale & Budget */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Budget INR */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-stone-400" />
                    Total Available Budget (INR)
                  </label>
                  <span className="font-serif text-lg font-bold text-purple-900">
                    {formatINR(budget)}
                  </span>
                </div>

                <input
                  type="number"
                  step="10000"
                  min="20000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-purple-500 text-sm font-semibold outline-hidden"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {[50000, 150000, 300000, 500000, 1000000, 2500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBudget(amt)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        budget === amt
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    Expected Guest Count
                  </label>
                  <span className="font-serif text-lg font-bold text-stone-900">
                    {guestCount} Guests
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="5"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-center"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  Event Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Evening (4-6 Hours)', 'Full Day', '2 Days (Multi-Ritual)', '3+ Days Destination'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        duration === dur
                          ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Style & Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Venue & Food Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-stone-400" />
                    Venue Preference
                  </label>
                  <div className="flex gap-2">
                    {(['Outdoor', 'Indoor', 'Flexible'] as VenuePreference[]).map((vp) => (
                      <button
                        key={vp}
                        type="button"
                        onClick={() => setVenuePreference(vp)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                          venuePreference === vp
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {vp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-stone-400" />
                    Catering Format
                  </label>
                  <div className="flex gap-2">
                    {(['Vegetarian', 'Non-vegetarian', 'Both'] as FoodPreference[]).map((fp) => (
                      <button
                        key={fp}
                        type="button"
                        onClick={() => setFoodPreference(fp)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                          foodPreference === fp
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {fp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme & Palette Presets */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-stone-400" />
                  Theme & Aesthetic Palette
                </label>
                <div className="space-y-2">
                  {THEME_PRESETS.map((th) => (
                    <button
                      key={th.name}
                      type="button"
                      onClick={() => setThemePreference(th.name)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        themePreference === th.name
                          ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-stone-900">{th.name}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{th.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {th.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-full border border-stone-200"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Planning Priorities */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Top Planning Priorities (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRIORITY_OPTIONS.map((pri) => {
                    const isSelected = selectedPriorities.includes(pri);
                    return (
                      <button
                        key={pri}
                        type="button"
                        onClick={() => handlePriorityToggle(pri)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{pri}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Special Instructions or Personal Wishes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Jain food section required, acoustic live band during sunset, surprise video tribute for the host..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-purple-500 text-xs outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Generate */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 border border-purple-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <h4 className="font-serif text-sm font-bold text-purple-950">
                    Ready to Architect Your Celebration Blueprint
                  </h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  Celebra AI will analyze your ₹{budget.toLocaleString('en-IN')} budget, {guestCount} guest scale, and aesthetic preferences using Google Gemini to construct an end-to-end plan, category budget breakdown, day-of schedule, and milestone checklist.
                </p>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Celebration</p>
                  <p className="text-xs font-bold text-stone-900 truncate mt-0.5">{name || 'Celebration'}</p>
                  <p className="text-[10px] text-stone-500">{eventType}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Target Budget</p>
                  <p className="text-xs font-bold text-purple-900 mt-0.5">{formatINR(budget)}</p>
                  <p className="text-[10px] text-stone-500">Approx. {formatINR(Math.round(budget / guestCount))} / guest</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Guests & Scale</p>
                  <p className="text-xs font-bold text-stone-900 mt-0.5">{guestCount} Guests</p>
                  <p className="text-[10px] text-stone-500">{duration}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Location & Date</p>
                  <p className="text-xs font-bold text-stone-900 truncate mt-0.5">{location}</p>
                  <p className="text-[10px] text-stone-500">{date || 'Upcoming'}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Aesthetic Theme</p>
                  <p className="text-xs font-bold text-stone-900 truncate mt-0.5">{themePreference}</p>
                  <p className="text-[10px] text-stone-500">{venuePreference} Venue</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Catering</p>
                  <p className="text-xs font-bold text-stone-900 mt-0.5">{foodPreference}</p>
                  <p className="text-[10px] text-stone-500">{selectedPriorities.length} Priorities</p>
                </div>
              </div>

              {specialRequirements && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                  <span className="font-bold text-stone-700">Special Notes: </span>
                  <span className="text-stone-600">{specialRequirements}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-100 bg-[#FAF8F5] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-rose-600 hover:from-purple-800 hover:to-rose-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Celebration Masterplan with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate Event Plan with Gemini</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
