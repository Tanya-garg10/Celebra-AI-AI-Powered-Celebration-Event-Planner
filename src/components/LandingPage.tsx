import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  PieChart,
  Users,
  ShieldCheck,
  HeartHandshake,
  Bot,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Quote
} from 'lucide-react';
import { CelebrationEvent } from '../types.ts';
import { formatINR } from '../utils/formatters.ts';

interface LandingPageProps {
  onPlanEvent: () => void;
  onExploreDemo: (eventId?: string) => void;
  featuredEvents: CelebrationEvent[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onPlanEvent,
  onExploreDemo,
  featuredEvents,
}) => {
  const weddingSample = featuredEvents.find((e) => e.eventType === 'Wedding') || featuredEvents[0];
  const bdaySample = featuredEvents.find((e) => e.eventType === 'Birthday') || featuredEvents[1];

  const categories = [
    {
      type: 'Weddings',
      subtitle: 'Palace, Beach & Royal Mandaps',
      icon: '💍',
      tag: 'Most Popular',
      color: 'from-amber-500/10 to-rose-500/10',
      border: 'border-amber-200/60',
      description: 'End-to-end multi-day ceremony timelines, catering feasts, and decor themes.'
    },
    {
      type: 'Milestone Birthdays',
      subtitle: 'From 1st to 50th Rooftop Bashes',
      icon: '🎂',
      tag: 'Trending',
      color: 'from-purple-500/10 to-indigo-500/10',
      border: 'border-purple-200/60',
      description: 'Themed concepts, mixology, custom cake designs, and guest surprises.'
    },
    {
      type: 'Anniversaries',
      subtitle: 'Silver, Golden & Intimate Dinners',
      icon: '🥂',
      tag: 'Romantic',
      color: 'from-rose-500/10 to-pink-500/10',
      border: 'border-rose-200/60',
      description: 'Curated dining, nostalgic memory walls, and heartfelt tribute moments.'
    },
    {
      type: 'College Festivals',
      subtitle: 'Cultural Nights, Convocations & Fests',
      icon: '🎓',
      tag: 'High Energy',
      color: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-200/60',
      description: 'Multi-stage logistics, artist booking budget models, and student security.'
    },
    {
      type: 'Community Events',
      subtitle: 'Festivals, Society Galas & Charity',
      icon: '🪔',
      tag: 'Cultural',
      color: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-200/60',
      description: 'Prasadam catering, stage performances, seating setups, and crowd flow.'
    },
    {
      type: 'Corporate Galas',
      subtitle: 'Annual Days, Awards & Product Launches',
      icon: '✨',
      tag: 'Premium',
      color: 'from-stone-500/10 to-slate-500/10',
      border: 'border-stone-200/60',
      description: 'Keynote staging, audio-visual engineering, and executive hospitality.'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'GenAI Master Event Plan',
      description:
        'Turns simple inputs (guest count, budget, city, theme) into a complete celebration concept, decor breakdown, and run-of-show schedule.'
    },
    {
      icon: PieChart,
      title: 'Smart Budget Optimizer',
      description:
        'Category-wise allocation charts for Venue, Catering, Decor and more. Featherless AI identifies overruns and provides actionable, high-impact savings.'
    },
    {
      icon: Clock,
      title: 'Auto-Timeline & Task Checklist',
      description:
        'Phased milestones from 6 weeks prior to the final celebration day. Prioritize tasks, track deadlines, and eliminate last-minute chaos.'
    },
    {
      icon: Users,
      title: 'Vendor Hub & Comparison',
      description:
        'Track bookings, payment schedules, quotes, and notes for caterers, decorators, photographers, and entertainers in one place.'
    },
    {
      icon: ShieldCheck,
      title: 'RSVP & Guest Diet Management',
      description:
        'Effortlessly monitor confirmed, pending, and declined attendees with dietary preferences (Vegetarian, Jain, Vegan, Kids).'
    },
    {
      icon: Bot,
      title: '24/7 Celebration Assistant',
      description:
        'Context-aware AI conversational companion ready to suggest vegetarian menus, low-cost decor hacks, and guest icebreakers.'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Share Your Celebration Vision',
      desc: 'Enter your event type, date, city, expected guest count, and available budget in INR. Select preferred themes and dietary preferences.'
    },
    {
      num: '02',
      title: 'Featherless AI Crafts Your Blueprint',
      desc: 'Within seconds, Celebra AI generates personalized decor palettes, realistic budget distribution, day-of schedules, and curated menus.'
    },
    {
      num: '03',
      title: 'Manage, Customize & Celebrate',
      desc: 'Use the interactive workspace to log expenses, check off tasks, coordinate vendors, track RSVPs, and generate creative ideas.'
    }
  ];

  const testimonials = [
    {
      quote:
        'Celebra AI saved us ₹85,000 on our Udaipur palace wedding decor by suggesting seasonal marigold drapes over imported flowers. The day-of timeline kept everything running like clockwork!',
      author: 'Meera & Aarav Singhania',
      role: 'Palace Wedding Hosts',
      event: '200 Guests • Udaipur',
      rating: 5
    },
    {
      quote:
        'Planning a 30th rooftop birthday in Mumbai usually takes 3 weeks of phone calls. Celebra AI gave me the signature cocktail names, neon aesthetic, and music rundown in one click!',
      author: 'Rohan Deshmukh',
      role: 'Birthday Host',
      event: '50 Guests • Bandra Mumbai',
      rating: 5
    },
    {
      quote:
        'Our college festival committee had a tight budget of ₹4 Lakhs. Celebra AI’s budget optimizer helped us reallocate funds to book a fantastic indie fusion band without overshooting.',
      author: 'Priya Nambiar',
      role: 'Cultural Secretary',
      event: 'College Fest • Bangalore',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28">
        {/* Subtle decorative glow spots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-200/40 via-peach-200/30 to-rose-200/40 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200/70 text-purple-900 text-xs font-semibold mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Next-Generation Celebration Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
              Big Moments Deserve <br />
              <span className="italic font-normal bg-gradient-to-r from-purple-800 via-rose-700 to-amber-700 bg-clip-text text-transparent">
                Perfect Planning.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-lg sm:text-xl text-stone-600 font-normal leading-relaxed">
              From dream weddings to unforgettable birthdays, let AI handle the
              planning while you enjoy the celebration.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onPlanEvent}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all group cursor-pointer"
              >
                <span>Plan My Event Free</span>
                <ArrowRight className="w-4 h-4 text-rose-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onExploreDemo(weddingSample?.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm shadow-xs hover:border-purple-300 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Explore Live Wedding Showcase</span>
              </button>
            </div>

            {/* Social proof tag */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-stone-500">
              <span className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </span>
              <span className="font-medium text-stone-700">
                Empowering flawless celebrations
              </span>
              <span>•</span>
              <span>100% Free Interactive Workspace</span>
            </div>
          </div>

          {/* Hero Visual Card / Interactive Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-7 shadow-xl shadow-stone-900/5 border border-stone-200/90 relative overflow-hidden">
              {/* Header preview row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-xl shadow-xs">
                    💍
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Live Plan Preview
                      </span>
                      <span className="text-xs text-stone-400">Dec 18, 2026</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Aarav & Meera&apos;s Regal Palace Wedding
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onExploreDemo(weddingSample?.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Interactive Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5 text-left">
                {/* Stat 1: Budget */}
                <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-100">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Total Budget
                  </p>
                  <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {formatINR(weddingSample?.budget || 1200000)}
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Allocated across 8 categories
                  </p>
                </div>

                {/* Stat 2: Guest Count */}
                <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-100">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Expected Guests
                  </p>
                  <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {weddingSample?.guestCount || 200} Pax
                  </p>
                  <p className="text-xs text-purple-700 font-medium mt-1">
                    Udaipur Lakeside Haveli
                  </p>
                </div>

                {/* Stat 3: AI Theme */}
                <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-100 md:col-span-2">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    AI Curated Palette & Theme
                  </p>
                  <p className="font-serif text-base font-bold text-stone-900 mt-1">
                    {weddingSample?.aiPlan?.theme.name || 'Regal Ivory & Burnished Gold'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {weddingSample?.aiPlan?.theme.colorPalette.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-stone-200/60 shadow-2xs">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[11px] font-medium text-stone-700">
                          {c.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample AI concept quote */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50/70 via-rose-50/40 to-amber-50/60 border border-purple-100 text-left">
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  <span className="font-bold text-purple-900">Concept Vision: </span>
                  &ldquo;{weddingSample?.aiPlan?.overview.concept}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[#F5F2EB]/50 border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Celebrations for Every Cherished Milestone
            </h2>
            <p className="mt-3 text-sm text-stone-600">
              Celebra AI tailors venue styles, budget ratios, catering formats, and cultural rituals to your specific event genre.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-white border ${cat.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-2xl">
                      {cat.icon}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                      {cat.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {cat.type}
                  </h3>
                  <p className="text-xs font-semibold text-purple-800 mt-0.5">
                    {cat.subtitle}
                  </p>
                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100">
                  <button
                    onClick={onPlanEvent}
                    className="text-xs font-bold text-stone-800 hover:text-purple-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Plan {cat.type} with AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100/70 px-3 py-1 rounded-full">
            Intelligent Event Engineering
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-3">
            Everything You Need for a Seamless Celebration
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            A unified suite designed to eliminate guesswork, streamline vendor negotiations, and deliver awe-inspiring hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-800 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {feat.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#F5F2EB]/60 border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              How Celebra AI Works
            </h2>
            <p className="mt-3 text-sm text-stone-600">
              Transform an abstract celebration idea into an executed masterpiece in three effortless stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, i) => (
              <div
                key={i}
                className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs relative"
              >
                <span className="font-serif text-3xl font-extrabold text-purple-200 block mb-2">
                  {st.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {st.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2.5 leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onPlanEvent}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Launch Event Creation Wizard</span>
              <ArrowRight className="w-4 h-4 text-rose-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Celebra AI */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100/70 px-3 py-1 rounded-full">
              The Celebra AI Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-3 leading-snug">
              Why Hosts & Event Planners Choose Us Over Generic Spreadsheets
            </h2>
            <p className="mt-4 text-sm text-stone-600 leading-relaxed font-normal">
              Traditional event planning is fragmented across chaotic WhatsApp groups, lost PDF estimates, and surprise budget overshoots. Celebra AI centralizes your celebration intelligence in one graceful workspace.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Saves Up To 25% on Avoidable Expenses
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Featherless AI detects unnecessary decor rentals and excessive food plate buffers, suggesting smart swaps that protect your pocket without compromising elegance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Culturally Nuanced & Hyper-Local
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Tailored for Indian and multicultural celebrations—from Pheras and Sangeets to Jain dietary requirements and festive regional delicacies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Zero Setup Fee & Instant Access
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    No sign-up barriers, no hidden credit cards. Start planning immediately with client-side browser persistence and exportable JSON backups.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Card Highlight: 30th Birthday Showcase */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-lg text-left">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎂</span>
                <div>
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                    Milestone Showcase
                  </span>
                  <h4 className="font-serif text-base font-bold text-stone-900">
                    {bdaySample?.name || "Rohan's 30th Rooftop Soirée"}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => onExploreDemo(bdaySample?.id)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
              >
                View Plan →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Budget Optimization:</span>
                <span className="font-bold text-emerald-700">₹1,50,000 (100% on target)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Guest Count:</span>
                <span className="font-semibold text-stone-800">50 close friends</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Special Highlights:</span>
                <span className="font-semibold text-stone-800">Acoustic set, signature mixology</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-600 italic">
                &ldquo;{bdaySample?.aiPlan?.overview.concept}&rdquo;
              </div>
            </div>

            <button
              onClick={() => onExploreDemo(bdaySample?.id)}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs border border-purple-200/80 transition-colors cursor-pointer"
            >
              Open Rohan&apos;s Birthday Workspace
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#F5F2EB]/50 border-t border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full uppercase tracking-wider">
              Sample User Feedback
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-3">
              Loved by Hosts, Couples & Event Organizers
            </h2>
            <p className="mt-2 text-xs text-stone-500">
              (Illustrative sample testimonials from early community users)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-500 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-900">{t.author}</p>
                    <p className="text-[11px] text-stone-500">{t.role}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
                    {t.event}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-14 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-rose-400 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                </div>
                <span className="font-serif text-xl font-bold text-white tracking-tight">
                  Celebra AI
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                Your Celebration, Perfectly Planned. The GenAI-powered event management workspace for weddings, birthdays, anniversaries, and community gatherings.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Event Tools
              </h5>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><button onClick={onPlanEvent} className="hover:text-white transition-colors cursor-pointer">AI Master Planner</button></li>
                <li><button onClick={() => onExploreDemo(weddingSample?.id)} className="hover:text-white transition-colors cursor-pointer">Smart Budget Optimizer</button></li>
                <li><button onClick={() => onExploreDemo(weddingSample?.id)} className="hover:text-white transition-colors cursor-pointer">Interactive Run-of-Show</button></li>
                <li><button onClick={() => onExploreDemo(weddingSample?.id)} className="hover:text-white transition-colors cursor-pointer">Vendor Directory</button></li>
              </ul>
            </div>

            {/* Celebrations */}
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Celebrations
              </h5>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><span className="text-stone-400">Royal Palace Weddings</span></li>
                <li><span className="text-stone-400">Milestone Birthday Bashes</span></li>
                <li><span className="text-stone-400">Silver & Golden Anniversaries</span></li>
                <li><span className="text-stone-400">College Cultural Festivals</span></li>
              </ul>
            </div>

            {/* Contact & Info */}
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Get In Touch
              </h5>
              <p className="text-xs text-stone-400 leading-relaxed mb-3">
                Have questions or partnership ideas for festival vendor directories?
              </p>
              <p className="text-xs font-medium text-stone-300">
                hello@celebra-ai.studio
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Bangalore • Mumbai • New Delhi
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
            <p>© {new Date().getFullYear()} Celebra AI. All rights reserved. Powered by Featherless AI.</p>
            <p>Demo & Evaluation Edition with Offline Client Resilience.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
