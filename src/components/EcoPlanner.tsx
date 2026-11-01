import React, { useState } from 'react';
import {
  Leaf,
  Sparkles,
  CheckCircle2,
  Circle,
  TrendingUp,
  Recycle,
  HeartHandshake,
  Award,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CelebrationEvent, EcoAudit, EcoPillar } from '../types.ts';

interface EcoPlannerProps {
  event: CelebrationEvent;
  onUpdateEcoAudit: (audit: EcoAudit) => void;
}

const DEFAULT_ECO_PILLARS: EcoPillar[] = [
  {
    id: 'eco-1',
    title: 'Zero Single-Use Plastic Water & Cutlery',
    currentChoice: 'Plastic water bottles & foam plates',
    ecoAlternative: 'Heritage brass goblets, terracotta kulhads & copper urn dispensers',
    impactSaving: 'Eliminates 1,200 plastic bottles & 45kg microplastic waste',
    adopted: true
  },
  {
    id: 'eco-2',
    title: 'Locally Sourced Seasonal Florals',
    currentChoice: 'Exotic air-freighted Dutch hydrangeas & orchids',
    ecoAlternative: 'Locally harvested marigolds, mogra, jasmine & potted palms',
    impactSaving: 'Reduces floral supply chain emissions by 80%',
    adopted: true
  },
  {
    id: 'eco-3',
    title: 'Surplus Food Recovery Partnership',
    currentChoice: 'Standard hotel buffet discard',
    ecoAlternative: 'Tied with local food rescue NGO (Robin Hood Army) for verified hygienic distribution',
    impactSaving: 'Feeds 120+ underprivileged individuals with 0 food wasted',
    adopted: true
  },
  {
    id: 'eco-4',
    title: 'Eco-Friendly Plantable Stationery',
    currentChoice: 'Plastic-laminated gloss paper boxes',
    ecoAlternative: 'Handmade cotton seed-paper cards with embedded basil/wildflower seeds',
    impactSaving: 'Saves 40kg virgin paper; cards bloom into plants post-event',
    adopted: true
  },
  {
    id: 'eco-5',
    title: 'Low-Wattage Warm LED & Solar Illumination',
    currentChoice: 'High-heat incandescent halogen floods',
    ecoAlternative: '2400K LED fairy light strings & solar battery backup banks',
    impactSaving: 'Saves 65% kilowatt electricity during evening ceremony',
    adopted: false
  },
  {
    id: 'eco-6',
    title: 'Living Potted Plant Guest Favors',
    currentChoice: 'Plastic-wrapped synthetic return gift novelties',
    ecoAlternative: 'Miniature potted jade/succulent plants in terracotta pots',
    impactSaving: 'Zero packaging waste; creates long-lasting carbon sequestering keepsake',
    adopted: false
  }
];

export const EcoPlanner: React.FC<EcoPlannerProps> = ({
  event,
  onUpdateEcoAudit,
}) => {
  const currentAudit = event.ecoAudit || {
    sustainabilityScore: 75,
    carbonOffsetKg: 280,
    wasteDivertedKg: 420,
    pillars: DEFAULT_ECO_PILLARS
  };

  const [pillars, setPillars] = useState<EcoPillar[]>(
    currentAudit.pillars && currentAudit.pillars.length > 0
      ? currentAudit.pillars
      : DEFAULT_ECO_PILLARS
  );

  // Recalculate score dynamically based on adopted pillars
  const adoptedCount = pillars.filter((p) => p.adopted).length;
  const score = Math.round((adoptedCount / pillars.length) * 100);
  const carbonOffset = adoptedCount * 65;
  const wasteDiverted = adoptedCount * 90;

  const handleTogglePillar = (id: string) => {
    const updated = pillars.map((p) => (p.id === id ? { ...p, adopted: !p.adopted } : p));
    setPillars(updated);
    const newAdoptedCount = updated.filter((p) => p.adopted).length;
    const newScore = Math.round((newAdoptedCount / updated.length) * 100);

    onUpdateEcoAudit({
      sustainabilityScore: newScore,
      pillars: updated,
      carbonOffsetKg: newAdoptedCount * 65,
      wasteDivertedKg: newAdoptedCount * 90
    });
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Eco-Friendly & Sustainable Celebration Planner
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Calculate your celebration&apos;s environmental impact, reduce single-use plastic, and eliminate food waste with thoughtful swaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Green Score: {score}%</span>
          </span>
        </div>
      </div>

      {/* Sustainability KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Score Card */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Sustainability Rating
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-3xl font-bold text-emerald-700">{score}%</span>
              <span className="text-xs text-stone-500">
                {score >= 80 ? 'Certified Green' : score >= 60 ? 'Eco Conscious' : 'Standard'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {adoptedCount} of {pillars.length} eco initiatives active
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Leaf className="w-7 h-7" />
          </div>
        </div>

        {/* Carbon Offset */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Carbon Footprint Offset
            </span>
            <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
              ~{carbonOffset} kg CO₂
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Via local sourcing & LED fixtures
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>

        {/* Waste Diverted */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Landfill Waste Diverted
            </span>
            <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
              ~{wasteDiverted} kg
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Recycled & donated food surplus
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Recycle className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Sustainable Swaps Checklist */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4">
        <h4 className="font-serif text-base font-bold text-stone-900">
          Sustainable Event Practices (Toggle to Adopt & Boost Score)
        </h4>

        <div className="divide-y divide-stone-100">
          {pillars.map((item) => (
            <div
              key={item.id}
              onClick={() => handleTogglePillar(item.id)}
              className="py-4 flex items-start gap-4 cursor-pointer group hover:bg-stone-50/50 rounded-2xl px-2 transition-colors"
            >
              <div className="mt-1 shrink-0">
                {item.adopted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300 group-hover:text-purple-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className={`text-xs font-bold ${item.adopted ? 'text-stone-900' : 'text-stone-600'}`}>
                    {item.title}
                  </h5>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.adopted ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {item.adopted ? 'Adopted' : 'Click to Adopt'}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Traditional Practice</span>
                    <span className="text-stone-600 mt-0.5 block">{item.currentChoice}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">Eco-Friendly Alternative</span>
                    <span className="text-emerald-950 font-semibold mt-0.5 block">{item.ecoAlternative}</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{item.impactSaving}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
