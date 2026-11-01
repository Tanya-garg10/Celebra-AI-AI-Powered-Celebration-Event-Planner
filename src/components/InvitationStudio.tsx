import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  RefreshCw,
  Palette,
  Eye,
  FileText
} from 'lucide-react';
import { CelebrationEvent, InvitationDesign, InvitationStyle } from '../types.ts';
import { formatShortDate } from '../utils/formatters.ts';

interface InvitationStudioProps {
  event: CelebrationEvent;
  onUpdateInvitation: (design: InvitationDesign) => void;
}

export const InvitationStudio: React.FC<InvitationStudioProps> = ({
  event,
  onUpdateInvitation,
}) => {
  const [style, setStyle] = useState<InvitationStyle>(
    event.invitation?.style || 'Royal Formal'
  );
  const [headline, setHeadline] = useState(
    event.invitation?.headline || (event.eventType === 'Wedding' ? 'Shree Ganeshay Namah' : 'You Are Cordially Invited')
  );
  const [hostLine, setHostLine] = useState(
    event.invitation?.hostLine || `Join us to celebrate the joyous milestone of ${event.name}`
  );
  const [eventDetails, setEventDetails] = useState(
    event.invitation?.eventDetails || `${formatShortDate(event.date)} • ${event.location}`
  );
  const [poeticQuote, setPoeticQuote] = useState(
    event.invitation?.poeticQuote || 'Your presence will add warmth and grace to our celebrations.'
  );
  const [rsvpContact, setRsvpContact] = useState(
    event.invitation?.rsvpContact || 'Please RSVP by phone or WhatsApp to +91 98200 12345'
  );
  const [dressCodeNote, setDressCodeNote] = useState(
    event.invitation?.dressCodeNote || 'Celebration Indian Festive / Smart Elegant'
  );
  const [bgChoice, setBgChoice] = useState<string>(
    event.invitation?.colorTheme.bg || '#FAF8F5'
  );
  const [accentChoice, setAccentChoice] = useState<string>(
    event.invitation?.colorTheme.accent || '#7C5EB6'
  );

  const [copiedText, setCopiedText] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const handleStyleChange = (newStyle: InvitationStyle) => {
    setStyle(newStyle);
    if (newStyle === 'Royal Formal') {
      setHeadline('Shree Ganeshay Namah');
      setHostLine(`With profound joy and blessings of our family, we request the honor of your presence at`);
      setPoeticQuote('Together in love and heritage, we begin a new chapter of lifetime memories.');
      setDressCodeNote('Royal Indian Festive Attire • Traditional Safas provided upon arrival');
      setBgChoice('#FAF8F5');
      setAccentChoice('#D4AF37');
    } else if (newStyle === 'Modern Chic') {
      setHeadline('Save The Date');
      setHostLine(`Good times, starry nights, and great friends. Join us to celebrate`);
      setPoeticQuote('Here’s to another year of unforgettable adventures and laughter.');
      setDressCodeNote('Cocktail Chic • Dress to Celebrate');
      setBgChoice('#111827');
      setAccentChoice('#7C5EB6');
    } else if (newStyle === 'Traditional Cultural') {
      setHeadline('Subhamastu • Shubh Vivaah');
      setHostLine(`Surrounded by tradition, Vedic chants, and familial warmth, we invite you to`);
      setPoeticQuote('As two sacred families unite in auspicious matrimony, bless our union.');
      setDressCodeNote('Traditional Silk Sarees & Kurta Pajamas');
      setBgChoice('#FFFBEB');
      setAccentChoice('#DC2626');
    } else if (newStyle === 'Fun & Playful') {
      setHeadline('Let the Celebrations Begin!');
      setHostLine(`The drinks are cold, the music is loud, and we need YOU to celebrate`);
      setPoeticQuote('Come for the food, stay for the dance-offs!');
      setDressCodeNote('Comfortable Festive • Ready to Dance');
      setBgChoice('#FDF4FF');
      setAccentChoice('#EC4899');
    }
  };

  const handleSaveDesign = () => {
    const design: InvitationDesign = {
      style,
      headline,
      hostLine,
      eventDetails,
      poeticQuote,
      rsvpContact,
      dressCodeNote,
      colorTheme: {
        bg: bgChoice,
        text: bgChoice === '#111827' ? '#FAF8F5' : '#1C1917',
        accent: accentChoice,
        border: accentChoice
      },
      fontStyle: style === 'Modern Chic' ? 'sans' : 'serif'
    };
    onUpdateInvitation(design);
    alert('Invitation design saved to your celebration workspace!');
  };

  const fullInvitationText = `✨ ${headline} ✨

${hostLine}
🎊 ${event.name} 🎊

📅 ${eventDetails}
📍 Venue: ${event.location}

"${poeticQuote}"

👔 Dress Code: ${dressCodeNote}
💌 ${rsvpContact}

Celebration planned with Celebra AI.`;

  const whatsAppText = `🎉 *${headline}*

${hostLine} *${event.name}*!

📅 *Date & Venue*: ${eventDetails}
✨ "${poeticQuote}"
👔 *Dress Code*: ${dressCodeNote}

👉 *Please RSVP*: ${rsvpContact}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullInvitationText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsAppText);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  const isDarkBg = bgChoice === '#111827';

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              AI Invitation Studio & RSVP Generator
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Generate digital card designs and ready-to-share WhatsApp invitations in multiple copywriting tones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveDesign}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Save Card Design
          </button>
        </div>
      </div>

      {/* Style Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(['Royal Formal', 'Modern Chic', 'Traditional Cultural', 'Fun & Playful'] as InvitationStyle[]).map((st) => (
          <button
            key={st}
            onClick={() => handleStyleChange(st)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              style === st
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {st} Style
          </button>
        ))}
      </div>

      {/* 2-Column: Card Design Live Preview vs Copy Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Live Digital Card Graphic Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Live Digital Card Preview
            </span>

            {/* Background Color Swatches */}
            <div className="flex items-center gap-1.5">
              {['#FAF8F5', '#FFFBEB', '#111827', '#FDF4FF'].map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBgChoice(bg)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                    bgChoice === bg ? 'scale-110 border-purple-600' : 'border-stone-300'
                  }`}
                  style={{ backgroundColor: bg }}
                  title="Card Background"
                />
              ))}
            </div>
          </div>

          {/* Realistic Card Container */}
          <div
            style={{ backgroundColor: bgChoice }}
            className={`p-8 sm:p-10 rounded-3xl border-4 shadow-xl transition-all relative overflow-hidden text-center min-h-[460px] flex flex-col justify-between`}
          >
            {/* Elegant Border Frame */}
            <div
              className="absolute inset-3 border-2 rounded-2xl pointer-events-none opacity-60"
              style={{ borderColor: accentChoice }}
            />

            {/* Corner Decorative Dots */}
            <span className="absolute top-5 left-5 w-2 h-2 rounded-full" style={{ backgroundColor: accentChoice }} />
            <span className="absolute top-5 right-5 w-2 h-2 rounded-full" style={{ backgroundColor: accentChoice }} />
            <span className="absolute bottom-5 left-5 w-2 h-2 rounded-full" style={{ backgroundColor: accentChoice }} />
            <span className="absolute bottom-5 right-5 w-2 h-2 rounded-full" style={{ backgroundColor: accentChoice }} />

            {/* Header / Crest */}
            <div className="pt-2">
              <span
                className="font-serif tracking-widest uppercase text-xs font-bold block"
                style={{ color: accentChoice }}
              >
                {headline}
              </span>
              <p
                className={`text-xs mt-3 max-w-sm mx-auto leading-relaxed ${
                  isDarkBg ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {hostLine}
              </p>
            </div>

            {/* Central Celebration Title */}
            <div className="py-4">
              <h2
                className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isDarkBg ? 'text-white' : 'text-stone-900'
                }`}
              >
                {event.name}
              </h2>
              <div
                className="w-16 h-0.5 mx-auto my-3 rounded-full"
                style={{ backgroundColor: accentChoice }}
              />
              <p
                className={`text-xs font-serif italic ${
                  isDarkBg ? 'text-purple-200' : 'text-purple-900'
                }`}
              >
                &ldquo;{poeticQuote}&rdquo;
              </p>
            </div>

            {/* Event Logistics & RSVP Footer */}
            <div className="space-y-2 pb-2">
              <p
                className={`text-xs font-semibold ${
                  isDarkBg ? 'text-stone-200' : 'text-stone-800'
                }`}
              >
                {eventDetails}
              </p>
              <p
                className={`text-[11px] ${
                  isDarkBg ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                {dressCodeNote}
              </p>
              <p
                className="text-[11px] font-bold mt-2"
                style={{ color: accentChoice }}
              >
                {rsvpContact}
              </p>
            </div>
          </div>

          {/* 1-Click Sharing Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyWhatsApp}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {copiedWhatsApp ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedWhatsApp ? 'WhatsApp Text Copied!' : 'Copy WhatsApp Ready Text'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Full Text</span>
            </button>
          </div>
        </div>

        {/* Copywriting & Detail Editor */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4">
          <h4 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-700" />
            <span>Customize Invitation Content</span>
          </h4>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Top Headline / Auspicious Blessing
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-hidden font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Host Line / Warm Invitation Statement
            </label>
            <input
              type="text"
              value={hostLine}
              onChange={(e) => setHostLine(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Event Details & Timing
            </label>
            <textarea
              rows={2}
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Poetic Quote or Tagline
            </label>
            <input
              type="text"
              value={poeticQuote}
              onChange={(e) => setPoeticQuote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-hidden font-serif italic"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Dress Code Note
              </label>
              <input
                type="text"
                value={dressCodeNote}
                onChange={(e) => setDressCodeNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                RSVP Contact Phone / Link
              </label>
              <input
                type="text"
                value={rsvpContact}
                onChange={(e) => setRsvpContact(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveDesign}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Update Invitation Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
