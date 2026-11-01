import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  PlusCircle,
  Trash2,
  Share2,
  Check,
  Download,
  Shirt,
  Flower2,
  SunMedium,
  Layers,
  Heart,
  X,
  Loader2
} from 'lucide-react';
import { CelebrationEvent, EventMoodboard } from '../types.ts';

interface MoodboardGeneratorProps {
  event: CelebrationEvent;
  onUpdateMoodboards: (moodboards: EventMoodboard[]) => void;
}

export const MoodboardGenerator: React.FC<MoodboardGeneratorProps> = ({
  event,
  onUpdateMoodboards,
}) => {
  const [moodboards, setMoodboards] = useState<EventMoodboard[]>(
    event.moodboards && event.moodboards.length > 0 ? event.moodboards : []
  );
  const [activeBoardId, setActiveBoardId] = useState<string>(
    moodboards[0]?.id || ''
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedBoardId, setCopiedBoardId] = useState<string | null>(null);

  // Form for custom/edited moodboard
  const [formTitle, setFormTitle] = useState('');
  const [formVibe, setFormVibe] = useState('');
  const [formDecorStyle, setFormDecorStyle] = useState('');
  const [formFloral, setFormFloral] = useState('');
  const [formLighting, setFormLighting] = useState('');
  const [formHostOutfit, setFormHostOutfit] = useState('');
  const [formGuestOutfit, setFormGuestOutfit] = useState('');
  const [formDressCode, setFormDressCode] = useState('');

  const activeBoard = moodboards.find((b) => b.id === activeBoardId) || moodboards[0];

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    // Simulate generation with intelligent aesthetic synthesis based on event context
    setTimeout(() => {
      const isWedding = event.eventType === 'Wedding';
      const isBirthday = event.eventType === 'Birthday';

      const generated: EventMoodboard = {
        id: `mb-${Date.now()}`,
        title: isWedding
          ? 'Enchanted Sylvan Rose & Champagne'
          : isBirthday
          ? 'Retro Neon Starlight Disco'
          : 'Modern Minimal Botanical Luxe',
        vibe: isWedding
          ? 'Ethereal Romance & Warm Candlelight'
          : isBirthday
          ? 'Electric Euphoria & Retro Chic'
          : 'Organic Contemporary Elegance',
        colorPalette: isWedding
          ? [
              { name: 'Dusty Rose', hex: '#E0A899', usage: 'Floral drapes & stationery' },
              { name: 'Champagne Gold', hex: '#F3E5AB', usage: 'Cutlery & fairy glow' },
              { name: 'Deep Sage', hex: '#587B6D', usage: 'Eucalyptus botanical arches' },
              { name: 'Warm Cream', hex: '#FFFDF9', usage: 'Table runners & linen' }
            ]
          : [
              { name: 'Electric Violet', hex: '#7C3AED', usage: 'Bar accent lighting' },
              { name: 'Sunset Coral', hex: '#FB7185', usage: 'Neon signs & flower clouds' },
              { name: 'Midnight Onyx', hex: '#0F172A', usage: 'Lounge furniture backdrop' },
              { name: 'Chrome Silver', hex: '#CBD5E1', usage: 'Disco mirror balls' }
            ],
        decorStyle: isWedding
          ? 'Suspended wisteria vines, floating hurricane candles, scalloped linen runners, and ivory archways.'
          : 'Cluster of multi-size mirror balls, geometric acrylic bar pedestals, and LED neon contour quote frames.',
        floralConcept: isWedding
          ? 'English garden roses, white hydrangeas, trailing jasmine, and dried eucalyptus.'
          : 'Ombre baby breath clouds tinted in soft purple and blush, paired with tropical monstera leaves.',
        lightingVibe: isWedding
          ? '2700K warm-amber fairy-light ceiling curtain with low flickering table votives.'
          : 'Dynamic color-wash LED beams, glowing cocktail bar counters, and retro neon fixtures.',
        outfitTheme: {
          host: isWedding
            ? 'Pale champagne sherwani with tonal embroidery & rose-blush bridal lehenga.'
            : 'Sleek black tailored jacket with metallic thread or high-slit cocktail gown.',
          guests: isWedding
            ? 'Pastel ethnic festive: Peach, mint, blush, powder blue, and champagne.'
            : 'Cocktail chic or retro glam with metallic accessories.',
          dressCode: isWedding ? 'Pastel Royal Festive' : 'Cocktail Glam'
        },
        fabricTextures: isWedding
          ? ['Raw Organza', 'Mulberry Silk', 'Washed Linen', 'Hammered Brass']
          : ['Liquid Satin', 'Crushed Velvet', 'Reflective Acrylic', 'Polished Chrome'],
        inspirationNotes: [
          'Create a seamless transition from golden hour sunset photography to candlelit banquet.',
          'Position low tabletop arrangements so guests can converse effortlessly across tables.'
        ],
        createdAt: new Date().toISOString()
      };

      const updated = [generated, ...moodboards];
      setMoodboards(updated);
      setActiveBoardId(generated.id);
      onUpdateMoodboards(updated);
      setIsGenerating(false);
    }, 700);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this saved moodboard?')) {
      const updated = moodboards.filter((b) => b.id !== id);
      setMoodboards(updated);
      setActiveBoardId(updated[0]?.id || '');
      onUpdateMoodboards(updated);
    }
  };

  const handleShare = (board: EventMoodboard) => {
    const text = `🎨 Celebra AI Moodboard: ${board.title}\nVibe: ${board.vibe}\nDress Code: ${board.outfitTheme.dressCode}\nPalette: ${board.colorPalette.map((c) => c.name).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedBoardId(board.id);
    setTimeout(() => setCopiedBoardId(null), 2000);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              AI Event Moodboard & Aesthetic Visualizer
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Curate and save cohesive visual directions covering decor, color palettes, floral concepts, lighting, and guest dress codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Crafting Moodboard...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Generate New Moodboard with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Moodboard Selector Tabs */}
      {moodboards.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {moodboards.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBoardId(b.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeBoard?.id === b.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.colorPalette[0]?.hex || '#7C5EB6' }} />
              <span>{b.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Moodboard Showcase */}
      {activeBoard ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-7">
          {/* Top Title & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                {activeBoard.vibe}
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1.5">
                {activeBoard.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(activeBoard)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedBoardId === activeBoard.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Board</span>
                  </>
                )}
              </button>
              {moodboards.length > 1 && (
                <button
                  onClick={() => handleDelete(activeBoard.id)}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Moodboard"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Color Palette Grid */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Curated Color Swatches & Material Usage
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {activeBoard.colorPalette.map((col, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex items-center gap-3"
                >
                  <div
                    className="w-11 h-11 rounded-xl shadow-xs border border-stone-300 shrink-0"
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

          {/* Aesthetic Pillars: Decor, Floral, Lighting */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Decor Architecture */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-purple-900">
                  <Layers className="w-4 h-4" />
                  <h4 className="font-serif text-sm font-bold">Decor & Architecture</h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  {activeBoard.decorStyle}
                </p>
              </div>
            </div>

            {/* Floral Concept */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-rose-900">
                  <Flower2 className="w-4 h-4" />
                  <h4 className="font-serif text-sm font-bold">Botanical & Florals</h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  {activeBoard.floralConcept}
                </p>
              </div>
            </div>

            {/* Lighting Vibe */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-amber-900">
                  <SunMedium className="w-4 h-4" />
                  <h4 className="font-serif text-sm font-bold">Ambient Illumination</h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  {activeBoard.lightingVibe}
                </p>
              </div>
            </div>
          </div>

          {/* Outfit Recommendations Strip */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900">
                <Shirt className="w-4 h-4 text-purple-700" />
                <h4 className="font-serif text-sm font-bold">Attire & Dress Code Guidelines</h4>
              </div>
              <span className="text-xs font-bold text-stone-800 bg-white px-2.5 py-0.5 rounded-md border border-stone-200">
                Code: {activeBoard.outfitTheme.dressCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <p className="font-bold text-stone-800 mb-1">Host & Immediate Family:</p>
                <p className="text-stone-600 leading-relaxed">{activeBoard.outfitTheme.host}</p>
              </div>
              <div>
                <p className="font-bold text-stone-800 mb-1">Guests & Attendees:</p>
                <p className="text-stone-600 leading-relaxed">{activeBoard.outfitTheme.guests}</p>
              </div>
            </div>
          </div>

          {/* Fabric Textures & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                Recommended Fabric Textures
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeBoard.fabricTextures.map((tex, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                  >
                    {tex}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                Stylist Notes & Staging Tips
              </p>
              <ul className="space-y-1 text-xs text-stone-600">
                {activeBoard.inspirationNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-600">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center text-xs text-stone-500">
          No moodboard generated yet. Click &ldquo;Generate New Moodboard with AI&rdquo; to begin.
        </div>
      )}
    </div>
  );
};
