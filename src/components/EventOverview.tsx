import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Printer,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Clock,
  Palette,
  Utensils,
  Music,
  Gift,
  Building,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { AIPlan, CelebrationEvent } from '../types.ts';
import { formatINR, formatShortDate, getDaysRemaining } from '../utils/formatters.ts';
import { generateEventPlanAPI } from '../services/api.ts';

interface EventOverviewProps {
  event: CelebrationEvent;
  onUpdateEventPlan: (updatedPlan: AIPlan) => void;
  onNavigateToTab: (tab: string) => void;
}

export const EventOverview: React.FC<EventOverviewProps> = ({
  event,
  onUpdateEventPlan,
  onNavigateToTab,
}) => {
  const [planningMode, setPlanningMode] = useState<any>(
    event.aiPlan?.planningMode || 'Balanced'
  );
  const [editingConcept, setEditingConcept] = useState(false);
  const [conceptText, setConceptText] = useState(event.aiPlan?.overview.concept || '');
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const plan = event.aiPlan;
  const countdown = getDaysRemaining(event.date);

  const handlePlanningModeChange = (mode: 'Budget' | 'Balanced' | 'Premium') => {
    setPlanningMode(mode);
    if (plan) {
      onUpdateEventPlan({
        ...plan,
        planningMode: mode
      });
    }
  };

  const handleSaveConcept = () => {
    if (plan) {
      onUpdateEventPlan({
        ...plan,
        overview: {
          ...plan.overview,
          concept: conceptText
        }
      });
      setEditingConcept(false);
    }
  };

  const handleRegenerateSection = (section: 'theme' | 'catering' | 'entertainment' | 'schedule') => {
    setRegeneratingSection(section);
    setTimeout(() => {
      if (!plan) return;
      if (section === 'catering') {
        const altCatering = {
          style: 'Interactive royal live stations & 4-course curated feast',
          welcomeDrinks: ['Kesariya Thandai with Almond Flakes', 'Spiced Jamun Fizz'],
          appetizers: ['Smoked Truffle Malai Paneer', 'Crispy Water Chestnut in Sweet Plum Glaze', 'Galouti Tarts on Crispy Naan Points'],
          mains: ['Paneer Makhani with Sun-Dried Fenugreek', 'Slow-Simmered Dal Peshawari', 'Dum Subz Biryani with Anar Raita', 'Assorted Artisan Breads'],
          desserts: ['Hot Jalebi with Kesar Rabri', 'Baked Gulab Jamun with Pistachio Cream'],
          specialNotes: ['Segregated Jain & vegan live counters', 'Allergen cards on all dishes']
        };
        onUpdateEventPlan({ ...plan, catering: altCatering as any });
      } else if (section === 'theme') {
        const altTheme = {
          name: 'Royal Ivory, Sage & Burnished Gold',
          description: 'A stately balance of organic greens, golden marigold clusters, and warm brass urlis.',
          colorPalette: [
            { name: 'Warm Ivory', hex: '#FAF8F5', usage: 'Sheer ceiling drapes' },
            { name: 'Saffron Gold', hex: '#F59E0B', usage: 'Fresh marigold torans' },
            { name: 'Emerald Sage', hex: '#059669', usage: 'Botanical table foliage' },
            { name: 'Burnished Brass', hex: '#D97706', usage: 'Urli candle holders' }
          ],
          decorConcepts: [
            { zone: 'Entrance Gate', description: 'Ten-foot arched floral toran with 10,000 fresh marigolds.' },
            { zone: 'Focal Mandap / Stage', description: 'Carved wooden pavilion flanked by ivory chiffon and warm fairy canopies.' },
            { zone: 'Dining Area', description: 'Low brass urlis with floating candles and raw linen runners.' }
          ],
          lighting: '2400K warm incandescent glow with amber perimeter uplighters.'
        };
        onUpdateEventPlan({ ...plan, theme: altTheme as any });
      } else if (section === 'entertainment') {
        const altEntertainment = {
          musicStyle: 'Acoustic classical fusion transitioning to high-energy folk DJ set',
          activities: [
            { title: 'Interactive Couple / Host Trivia', description: 'Fun mobile-assisted quiz with hilarious personalized questions.' },
            { title: 'Artisan Lac Bangle Maker', description: 'Live craftsman crafting bangles for guests as keepsakes.' }
          ],
          ceremonialMoments: ['Grand procession arrival with dholak', 'Varmala cold sparkler celebration', 'Family midnight cake toast']
        };
        onUpdateEventPlan({ ...plan, entertainment: altEntertainment as any });
      }
      setRegeneratingSection(null);
    }, 500);
  };

  const handleRegenerate = async () => {
    if (!window.confirm('Regenerate the entire AI plan using Gemini 3.8 Flash?')) return;
    setIsRegenerating(true);
    try {
      const response = await generateEventPlanAPI({
        eventType: event.eventType,
        name: event.name,
        date: event.date,
        location: event.location,
        guestCount: event.guestCount,
        budget: event.budget,
        duration: event.duration,
        themePreference: event.themePreference,
        venuePreference: event.venuePreference,
        foodPreference: event.foodPreference,
        specialRequirements: event.specialRequirements,
        priorities: event.priorities
      });

      if (response?.plan) {
        onUpdateEventPlan(response.plan);
      }
    } catch (err) {
      alert('Failed to regenerate plan. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopySummary = () => {
    if (!plan) return;
    const summaryText = `🎉 ${event.name} - Celebra AI Plan Summary
Date: ${formatShortDate(event.date)} (${countdown.label})
Location: ${event.location}
Guest Count: ${event.guestCount} | Budget: ${formatINR(event.budget)}

✨ Concept:
${plan.overview.concept}

🎨 Theme: ${plan.theme.name}
Colors: ${plan.theme.colorPalette.map((c) => c.name).join(', ')}

🍽️ Catering Highlights:
Appetizers: ${plan.catering.appetizers.join(', ')}
Mains: ${plan.catering.mains.join(', ')}

Generated with Celebra AI.`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSection('summary');
    setTimeout(() => setCopiedSection(null), 2500);
  };

  if (!plan) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs">
        <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3" />
        <h3 className="font-serif text-xl font-bold text-stone-900">
          No AI Plan Generated Yet
        </h3>
        <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto">
          Generate an end-to-end celebration concept, timeline, catering menu, and decor palette powered by Google Gemini.
        </p>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="mt-5 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          {isRegenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-200" />
          )}
          <span>Generate Plan Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-purple-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-semibold">
                {event.eventType}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold">
                {countdown.label}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-stone-300 text-xs">
                {formatShortDate(event.date)}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {event.name}
            </h1>

            <p className="font-serif italic text-purple-200 text-sm sm:text-base mt-1">
              &ldquo;{plan.overview.tagline}&rdquo;
            </p>

            {/* Quick stats strip */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-300" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-300" />
                <span>{event.guestCount} Guests Expected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-bold text-amber-300">{formatINR(event.budget)} Budget</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>{event.duration}</span>
              </div>
            </div>

            {/* Planning Mode Selector */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
              <span className="text-stone-300 font-semibold">Planning Mode:</span>
              {(['Budget', 'Balanced', 'Premium'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handlePlanningModeChange(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    planningMode === m
                      ? 'bg-purple-500 text-white shadow-xs'
                      : 'bg-white/10 text-stone-300 hover:bg-white/20'
                  }`}
                >
                  {m} Mode
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer"
            >
              {copiedSection === 'summary' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Plan</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>

            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {isRegenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>Regenerate with Gemini</span>
            </button>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Concept & Vibe Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-700" />
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Overarching Celebration Concept
          </h3>
          <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800">
            {plan.overview.vibe}
          </span>
        </div>

        <p className="text-sm text-stone-700 leading-relaxed font-normal">
          {plan.overview.concept}
        </p>

        {/* Key Highlights */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plan.overview.keyHighlights.map((hl, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/70 flex items-start gap-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-stone-800 font-medium leading-snug">
                {hl}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Theme & Decor Visual Direction */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Aesthetic Theme & Decor Architecture
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700 px-3 py-1 rounded-full bg-stone-100">
              {plan.theme.name}
            </span>
            <button
              onClick={() => handleRegenerateSection('theme')}
              disabled={regeneratingSection === 'theme'}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-purple-50 text-purple-800 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${regeneratingSection === 'theme' ? 'animate-spin' : ''}`} />
              <span>Regenerate Theme</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          {plan.theme.description}
        </p>

        {/* Color Palette Swatches */}
        <div className="mt-5">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2.5">
            Curated Color Swatches & Material Usage
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {plan.theme.colorPalette.map((col, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl border border-stone-300 shadow-xs shrink-0"
                  style={{ backgroundColor: col.hex }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">{col.name}</p>
                  <p className="text-[11px] font-mono text-stone-500 uppercase">{col.hex}</p>
                  <p className="text-[10px] text-stone-600 truncate mt-0.5">{col.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone-by-Zone Decor Concepts */}
        <div className="mt-6">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2.5">
            Zonal Styling & Focal Points
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {plan.theme.decorConcepts.map((zone, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70"
              >
                <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  {zone.zone}
                </h4>
                <p className="text-xs text-stone-700 mt-1.5 leading-relaxed font-normal">
                  {zone.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Lighting Strategy */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs">
          <span className="font-bold text-amber-900">✨ Ambient Lighting Strategy: </span>
          <span className="text-stone-700">{plan.theme.lighting}</span>
        </div>
      </div>

      {/* 2-Column: Venue & Catering */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Venue Recommendations */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-5 h-5 text-emerald-700" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Venue Blueprint
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 mb-4">
              <p className="text-[11px] font-semibold text-stone-500 uppercase">
                Recommended Venue Style
              </p>
              <p className="text-sm font-bold text-stone-900 mt-0.5">
                {plan.venue.typeRecommendation}
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Target Capacity: <span className="font-semibold">{plan.venue.idealCapacity}</span>
              </p>
            </div>

            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Key Site Considerations
            </p>
            <ul className="space-y-2 text-xs text-stone-700 mb-4">
              {plan.venue.keyConsiderations.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Search Keywords for Venue Hunting
            </p>
            <div className="flex flex-wrap gap-1.5">
              {plan.venue.searchKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('vendors')}
            className="mt-6 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Manage Venue Vendors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Catering & Food Menu */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Curated Culinary Menu
                </h3>
              </div>
              <button
                onClick={() => handleRegenerateSection('catering')}
                disabled={regeneratingSection === 'catering'}
                className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Regenerate catering recommendations"
              >
                <Sparkles className={`w-3 h-3 ${regeneratingSection === 'catering' ? 'animate-spin' : ''}`} />
                <span>{regeneratingSection === 'catering' ? 'Updating...' : 'Regen Menu'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4 font-medium">
              Style: <span className="text-stone-900 font-bold">{plan.catering.style}</span>
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider text-purple-900">
                  Welcome Drinks & Coolers
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {plan.catering.welcomeDrinks.map((d, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider text-rose-900">
                  Pass-around Appetizers
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {plan.catering.appetizers.map((a, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-900 font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider text-amber-900">
                  Signature Main Courses
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {plan.catering.mains.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider text-emerald-900">
                  Artisanal Desserts
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {plan.catering.desserts.map((ds, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-medium">
                      {ds}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Special: {event.foodPreference} format</span>
            <button
              onClick={() => onNavigateToTab('budget')}
              className="font-bold text-purple-700 hover:text-purple-900 cursor-pointer flex items-center gap-1"
            >
              <span>View Catering Costs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Entertainment & Guest Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entertainment */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-indigo-600" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Entertainment & Flow
              </h3>
            </div>
            <button
              onClick={() => handleRegenerateSection('entertainment')}
              disabled={regeneratingSection === 'entertainment'}
              className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              title="Regenerate entertainment lineup"
            >
              <Sparkles className={`w-3 h-3 ${regeneratingSection === 'entertainment' ? 'animate-spin' : ''}`} />
              <span>{regeneratingSection === 'entertainment' ? 'Updating...' : 'Regen Flow'}</span>
            </button>
          </div>

          <p className="text-xs text-stone-600 mb-4">
            Music Direction: <span className="text-stone-900 font-semibold">{plan.entertainment.musicStyle}</span>
          </p>

          <div className="space-y-3">
            {plan.entertainment.activities.map((act, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs">
                <p className="font-bold text-stone-900">{act.title}</p>
                <p className="text-stone-600 mt-1">{act.description}</p>
              </div>
            ))}

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs">
              <p className="font-bold text-indigo-950 mb-1">Ceremonial Moments</p>
              <ul className="list-disc list-inside text-indigo-900 space-y-0.5">
                {plan.entertainment.ceremonialMoments.map((cm, i) => (
                  <li key={i}>{cm}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Guest Experience & Favors */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-rose-500" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Guest Hospitality & Keepsakes
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <p className="text-[10px] font-bold text-stone-400 uppercase">Welcome Keepsake</p>
                <p className="font-semibold text-stone-900 mt-1">{plan.guestExperience.welcomeFavor}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <p className="text-[10px] font-bold text-stone-400 uppercase">Interactive Guest Touchpoints</p>
                <ul className="list-disc list-inside text-stone-700 mt-1 space-y-1">
                  {plan.guestExperience.interactiveTouchpoints.map((tp, i) => (
                    <li key={i}>{tp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/70">
                <p className="text-[10px] font-bold text-rose-800 uppercase">Parting Return Gift Idea</p>
                <p className="font-bold text-stone-900 mt-1">{plan.guestExperience.returnGiftIdea}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('guests')}
            className="mt-6 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Manage Guest RSVPs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hourly Run-of-Show Schedule */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Celebration Day Schedule (Run-of-Show)
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {plan.eventDaySchedule.length} milestones planned
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {plan.eventDaySchedule.map((item, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-mono text-xs font-bold shrink-0">
                  {item.time}
                </span>
                <span className="text-xs font-bold text-stone-900">{item.activity}</span>
              </div>
              <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                Lead: {item.responsible}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preparation Timeline Milestones */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Preparation Timeline
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('timeline')}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Task Checklist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {plan.preparationTimeline.map((ml, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                    {ml.phase}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      ml.priority === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {ml.priority} Priority
                  </span>
                </div>
                <p className="text-xs font-semibold text-stone-900 leading-snug">
                  {ml.task}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
