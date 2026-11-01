import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Palette,
  Lightbulb,
  Send,
  Utensils,
  Music,
  Gift,
  Smile,
  Loader2
} from 'lucide-react';
import { CelebrationEvent, GeneratedIdea } from '../types.ts';
import { generateIdeasAPI } from '../services/api.ts';
import { renderInline } from './FormattedMarkdown.tsx';

interface IdeaGeneratorProps {
  event: CelebrationEvent;
}

const CATEGORIES = [
  { id: 'themes', label: 'Unique Themes', icon: Palette, desc: 'Cohesive aesthetic concepts & color stories' },
  { id: 'decor', label: 'Decoration & Lighting', icon: Lightbulb, desc: 'Statement backdrops, florals & lighting' },
  { id: 'invitations', label: 'Invitations & Copy', icon: Send, desc: 'Bespoke messages, poetic quotes & WhatsApp text' },
  { id: 'menu', label: 'Culinary & Cocktails', icon: Utensils, desc: 'Interactive chaat counters, drinks & desserts' },
  { id: 'entertainment', label: 'Games & Entertainment', icon: Music, desc: 'Engaging host activities & ceremonial moments' },
  { id: 'gifts', label: 'Return Gifts & Favors', icon: Gift, desc: 'Thoughtful, eco-conscious guest keepsakes' },
  { id: 'surprises', label: 'Host & Guest Surprises', icon: Smile, desc: 'Emotional tributes, sparklers & memory twists' }
];

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ event }) => {
  const [activeCategory, setActiveCategory] = useState<string>('themes');
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchIdeas = async (cat: string) => {
    setIsLoading(true);
    try {
      const response = await generateIdeasAPI({
        category: cat,
        eventContext: {
          name: event.name,
          eventType: event.eventType,
          location: event.location,
          guestCount: event.guestCount,
          budget: event.budget,
          themePreference: event.themePreference
        }
      });
      if (response?.ideas && response.ideas.length > 0) {
        setIdeas(response.ideas);
      }
    } catch (err) {
      console.error('Failed to load ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas(activeCategory);
  }, [activeCategory, event.id]);

  const handleCopy = (idea: GeneratedIdea, idx: number) => {
    const text = `💡 ${idea.title}\n${idea.description}\n\nWhy It Works: ${idea.whyItWorks}\nImplementation: ${idea.implementationTip}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Personalized Idea & Inspiration Generator
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Gemini AI generates distinctive, budget-conscious ideas tuned specifically to {event.name} ({event.location}).
          </p>
        </div>

        <button
          onClick={() => fetchIdeas(activeCategory)}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          <span>Generate New Concepts</span>
        </button>
      </div>

      {/* Category Pills Strip */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white border border-stone-200/90 text-stone-700 hover:border-purple-300 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ideas Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="text-xs font-bold text-stone-800">
            Brainstorming creative celebration concepts with Gemini...
          </p>
          <p className="text-[11px] text-stone-500">
            Tailoring for ₹{event.budget.toLocaleString('en-IN')} budget & {event.guestCount} guests
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ideas.map((idea, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      idea.budgetRating === 'Low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : idea.budgetRating === 'Medium'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Budget: {idea.budgetRating}
                  </span>

                  <button
                    onClick={() => handleCopy(idea, idx)}
                    className="text-stone-400 hover:text-stone-800 transition-colors p-1 cursor-pointer"
                    title="Copy concept"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <h4 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                  {idea.title}
                </h4>

                <p className="text-xs text-stone-700 mt-2 leading-relaxed">
                  {renderInline(idea.description)}
                </p>

                {idea.whyItWorks && (
                  <div className="mt-4 p-3 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs">
                    <span className="font-bold text-purple-900">Why Guests Love It: </span>
                    <span className="text-stone-700">{renderInline(idea.whyItWorks)}</span>
                  </div>
                )}
              </div>

              {idea.implementationTip && (
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-700">Execution Tip: </span>
                  <span>{renderInline(idea.implementationTip)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
