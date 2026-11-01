import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.FEATHERLESS_API_KEY;
let aiClient: OpenAI | null = null;
let featherlessVerified = false;

if (apiKey && apiKey !== 'MY_FEATHERLESS_API_KEY' && apiKey.trim() !== '') {
  try {
    const candidateClient = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.featherless.ai/v1'
    });
    // Verify once asynchronously on boot without throwing uncaught errors
    candidateClient.chat.completions.create({
      model: 'MiniMaxAI/MiniMax-M3.1-Flash',
      messages: [{ role: 'user', content: 'Ping' }],
      max_tokens: 10
    }).then(() => {
      aiClient = candidateClient;
      featherlessVerified = true;
      console.log('Featherless API verified and active.');
    }).catch((_err) => {
      aiClient = null;
      featherlessVerified = false;
      console.log('Featherless API key is invalid or quota exceeded. Activated Curated Celebration Engine (Demo Mode).');
    });
  } catch (err) {
    aiClient = null;
    featherlessVerified = false;
  }
}

// Status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    featherlessAvailable: featherlessVerified,
    model: featherlessVerified ? 'MiniMaxAI/MiniMax-M3.1-Flash' : 'curated-celebration-engine',
    mode: featherlessVerified ? 'Live Featherless AI' : 'Curated Celebration Engine (Demo Mode)',
    timestamp: new Date().toISOString()
  });
});

// Helper for clean JSON extraction from AI response
function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to find code block
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (err2) {
        // Continue
      }
    }
    // Try to find { ... }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch (err3) {
        // Continue
      }
    }
    throw new Error('Failed to parse AI output as JSON: ' + text.slice(0, 100));
  }
}

// 1. AI Event Plan Generation
app.post('/api/ai/plan', async (req: Request, res: Response) => {
  const {
    eventType,
    name,
    date,
    location,
    guestCount,
    budget,
    duration,
    themePreference,
    venuePreference,
    foodPreference,
    specialRequirements,
    priorities
  } = req.body;

  const budgetNum = Number(budget) || 200000;
  const guestsNum = Number(guestCount) || 50;

  if (aiClient && featherlessVerified) {
    try {
      const prompt = `You are Celebra AI, a world-class luxury celebration and event planning expert.
Create a comprehensive, highly personalized, and culturally nuanced event plan for:
Event Name: "${name || 'My Celebration'}"
Event Type: ${eventType}
Date: ${date || 'Upcoming'}
Location/City: ${location || 'India'}
Guest Count: ${guestsNum} guests
Budget: ₹${budgetNum.toLocaleString('en-IN')} INR
Duration: ${duration || '1 Day'}
Venue Preference: ${venuePreference || 'Flexible'}
Food Preference: ${foodPreference || 'Both'}
Theme & Color Palette: ${themePreference || 'Modern Elegant'}
Priorities: ${Array.isArray(priorities) ? priorities.join(', ') : (priorities || 'Hospitality and Aesthetic')}
Special Requirements: ${specialRequirements || 'None specified'}

Output ONLY a valid JSON object with the exact following schema (no preamble, no markdown surrounding the JSON):
{
  "overview": {
    "concept": "Engaging 2-3 sentence overarching creative concept",
    "tagline": "A poetic 4-7 word tagline for this specific event",
    "vibe": "3-4 sensory adjectives e.g. Regal, Intimate, Joyous",
    "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"]
  },
  "theme": {
    "name": "Creative Theme Name",
    "description": "Why this theme fits the host and guests",
    "colorPalette": [
      {"name": "Color Name", "hex": "#hexcode", "usage": "e.g. Primary drapes & invitations"},
      {"name": "Color Name 2", "hex": "#hexcode", "usage": "e.g. Floral accents"},
      {"name": "Color Name 3", "hex": "#hexcode", "usage": "e.g. Table linens and stationery"},
      {"name": "Color Name 4", "hex": "#hexcode", "usage": "e.g. Ambient lighting & metallic sheen"}
    ],
    "decorConcepts": [
      {"zone": "Entrance & Welcome", "description": "Specific decor, floral arch, signage"},
      {"zone": "Main Stage / Focal Point", "description": "Backdrop styling, lighting, seating"},
      {"zone": "Dining & Tablescapes", "description": "Centerpieces, cutlery, runner details"},
      {"zone": "Photo Opportunity / Lounge", "description": "Interactive photo corner styling"}
    ],
    "lighting": "Specific lighting recommendation (fairy lights, warm amber washes, gobos, uplighting)"
  },
  "venue": {
    "typeRecommendation": "Best suited venue type e.g. Heritage Haveli lawn or Banquet Ballroom",
    "idealCapacity": "e.g. 80-120 pax",
    "searchKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
    "keyConsiderations": ["Consideration 1", "Consideration 2", "Consideration 3"]
  },
  "catering": {
    "style": "e.g. Plated dinner / Royal Buffet / Interactive Live Counters",
    "welcomeDrinks": ["Drink 1", "Drink 2"],
    "appetizers": ["Appetizer 1", "Appetizer 2", "Appetizer 3"],
    "mains": ["Signature Main 1", "Signature Main 2", "Signature Main 3"],
    "desserts": ["Dessert 1", "Dessert 2"],
    "specialNotes": "Dietary or seasonal pairing suggestion"
  },
  "entertainment": {
    "musicStyle": "e.g. Acoustic Live Trio transitioning to DJ Bollywood & Retro Pop",
    "activities": [
      {"title": "Activity 1", "description": "How it engages guests"},
      {"title": "Activity 2", "description": "How it engages guests"}
    ],
    "ceremonialMoments": ["Moment 1 (e.g. Grand Toast)", "Moment 2 (e.g. Cake or Sangeet dance)"]
  },
  "guestExperience": {
    "welcomeFavor": "Thoughtful keepsake or welcome gift idea",
    "interactiveTouchpoints": ["Touchpoint 1", "Touchpoint 2"],
    "returnGiftIdea": "Memorable parting gift tailored to budget"
  },
  "costBreakdown": [
    {"category": "Venue", "allocatedPercentage": 25, "estimatedAmount": 50000, "notes": "Rental and basic setup"},
    {"category": "Catering", "allocatedPercentage": 35, "estimatedAmount": 70000, "notes": "Food and beverage per plate"},
    {"category": "Decoration", "allocatedPercentage": 15, "estimatedAmount": 30000, "notes": "Florals, stage, lighting"},
    {"category": "Photography", "allocatedPercentage": 10, "estimatedAmount": 20000, "notes": "Candid photos and highlight reel"},
    {"category": "Entertainment", "allocatedPercentage": 6, "estimatedAmount": 12000, "notes": "Sound, DJ or live performers"},
    {"category": "Invitations", "allocatedPercentage": 2, "estimatedAmount": 4000, "notes": "Digital bespoke video and cards"},
    {"category": "Transportation", "allocatedPercentage": 3, "estimatedAmount": 6000, "notes": "Logistics and guest transfer"},
    {"category": "Miscellaneous", "allocatedPercentage": 4, "estimatedAmount": 8000, "notes": "Contingency buffer"}
  ],
  "eventDaySchedule": [
    {"time": "04:00 PM", "activity": "Vendor Setup & Quality Walkthrough", "responsible": "Event Coordinator / Decor Lead"},
    {"time": "06:00 PM", "activity": "Guest Arrival & Welcome Mocktails", "responsible": "Hospitality Team"},
    {"time": "07:00 PM", "activity": "Opening Ceremony & Welcome Address", "responsible": "Host / Emcee"},
    {"time": "08:00 PM", "activity": "Live Performance & Photo Sessions", "responsible": "Photographer & DJ"},
    {"time": "09:00 PM", "activity": "Royal Dinner Buffet Opens", "responsible": "Catering Manager"},
    {"time": "10:30 PM", "activity": "Closing Celebration & Return Gifts", "responsible": "Hosts"}
  ],
  "preparationTimeline": [
    {"phase": "4-6 Weeks Prior", "task": "Lock venue booking and draft guest list", "priority": "High"},
    {"phase": "3 Weeks Prior", "task": "Finalize catering menu and book photographer", "priority": "High"},
    {"phase": "2 Weeks Prior", "task": "Send invitations & track RSVPs", "priority": "Medium"},
    {"phase": "1 Week Prior", "task": "Confirm decor mockups, sound setup, and playlist", "priority": "High"},
    {"phase": "2 Days Prior", "task": "Assemble favors and prepare vendor emergency contacts", "priority": "Medium"},
    {"phase": "Event Day", "task": "Morning walkthrough & final milestone execution", "priority": "High"}
  ]
}
Make sure the estimated amounts in costBreakdown sum exactly to approximately ₹${budgetNum}. Return strictly valid JSON.`;

      const response = await aiClient.chat.completions.create({
        model: 'MiniMaxAI/MiniMax-M3.1-Flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000
      });

      const responseText = response.choices[0]?.message?.content || '';
      const planData = extractJSON(responseText);
      return res.json({ success: true, source: 'featherless', plan: planData });
    } catch (err: any) {
      console.error('Featherless plan generation error:', err);
      // Fallback to intelligent local template generator
    }
  }

  // Graceful realistic fallback if Featherless key is missing or quota is exceeded
  const fallbackPlan = generateFallbackPlan({
    eventType,
    name,
    date,
    location,
    guestCount: guestsNum,
    budget: budgetNum,
    duration,
    themePreference,
    venuePreference,
    foodPreference,
    specialRequirements,
    priorities
  });

  res.json({
    success: true,
    source: 'curated_engine',
    isDemoFallback: true,
    plan: fallbackPlan
  });
});

// 2. AI Budget Optimization
app.post('/api/ai/optimize-budget', async (req: Request, res: Response) => {
  const { eventName, budget, estimatedCost, actualSpent, categories } = req.body;
  const budgetNum = Number(budget) || 100000;
  const estimatedNum = Number(estimatedCost) || 120000;
  const overrun = Math.max(0, estimatedNum - budgetNum);

  if (aiClient && featherlessVerified) {
    try {
      const prompt = `You are Celebra AI's financial event strategist.
Event: "${eventName || 'Celebration'}"
Allocated Budget: ₹${budgetNum.toLocaleString('en-IN')} INR
Current Estimated Cost: ₹${estimatedNum.toLocaleString('en-IN')} INR
Overrun Amount to Cut: ₹${overrun.toLocaleString('en-IN')} INR
Breakdown of Categories & Spending:
${JSON.stringify(categories, null, 2)}

Identify specific, high-impact, realistic cost-saving adjustments to bring this event under budget without compromising the host's experience or guest hospitality.
Return ONLY valid JSON matching this schema:
{
  "summary": "Brief executive analysis of where the budget leak is happening",
  "targetSavings": ${overrun || Math.round(budgetNum * 0.15)},
  "recommendations": [
    {
      "category": "e.g. Decoration",
      "action": "Specific tactic e.g. Replace exotic imported lilies with vibrant marigold cascades and fairy light canopies",
      "potentialSaving": 15000,
      "impactOnExperience": "Minimal / Enhances warm artisanal charm"
    },
    {
      "category": "e.g. Catering",
      "action": "Specific catering optimization e.g. Reduce dessert counter from 8 varieties to 3 signature crowd-pleasers with live waffle/jalebi station",
      "potentialSaving": 8000,
      "impactOnExperience": "Zero - guests actually prefer fresh hot live items over stale buffets"
    },
    {
      "category": "e.g. Invitations",
      "action": "Switch to bespoke animated WhatsApp video invitation + interactive RSVP portal instead of heavy boxed printouts",
      "potentialSaving": 5000,
      "impactOnExperience": "Positive - modern, eco-friendly, instant RSVP tracking"
    }
  ],
  "smartSwaps": [
    "Swap expensive full-day photographer package for 5-hour peak candid + reel creator",
    "Opt for in-house venue sound and ambient acoustics rather than third-party line-array truss"
  ],
  "contingencyAdvice": "Practical safety buffer tip"
}`;

      const response = await aiClient.chat.completions.create({
        model: 'MiniMaxAI/MiniMax-M3.1-Flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });

      const responseText = response.choices[0]?.message?.content || '';
      const optimization = extractJSON(responseText);
      return res.json({ success: true, source: 'featherless', optimization });
    } catch (err: any) {
      console.error('Featherless budget optimization error:', err);
    }
  }

  // Fallback budget optimization
  const fallbackOptimization = {
    summary: `Your estimated expenditure exceeds the designated target by ₹${overrun.toLocaleString('en-IN')}. By rationalizing floral imports, streamlining live buffet surplus, and adopting digital bespoke stationery, you can comfortably preserve ₹${(overrun || 20000).toLocaleString('en-IN')} without diminishing guest delight.`,
    targetSavings: overrun || 20000,
    recommendations: [
      {
        category: 'Decoration',
        action: 'Replace high-maintenance exotic florals with seasonal Indian blooms, fairy-light drapes, and statement brass urlis with floating candles.',
        potentialSaving: Math.round(overrun * 0.45) || 12000,
        impactOnExperience: 'High visual impact with authentic warm ambiance.'
      },
      {
        category: 'Catering',
        action: 'Curate a focused 3-course signature menu rather than a 45-dish sprawling buffet that generates massive food wastage.',
        potentialSaving: Math.round(overrun * 0.35) || 8000,
        impactOnExperience: 'Guests praise fresher, hotter signature dishes.'
      },
      {
        category: 'Invitations & Favors',
        action: 'Deploy Celebra AI animated WhatsApp cards + personalized edible favors (artisan cookies/dry fruits) over plastic trinkets.',
        potentialSaving: Math.round(overrun * 0.20) || 5000,
        impactOnExperience: 'Modern, highly appreciated, and zero landfill waste.'
      }
    ],
    smartSwaps: [
      'Book a 4-hour peak celebration photography slot instead of redundant 10-hour idle coverage.',
      'Utilize the venue’s architectural lighting features and augment with amber uplighters.'
    ],
    contingencyAdvice: 'Hold a strict 5-8% unallocated reserve in a dedicated digital sub-wallet for last-minute tips and logistics.'
  };

  res.json({ success: true, source: 'curated_engine', isDemoFallback: true, optimization: fallbackOptimization });
});

// 3. AI Celebration Assistant Chatbot
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, eventContext, history } = req.body;

  // Require valid API key - no fallback to demo mode
  if (!aiClient || !featherlessVerified) {
    return res.status(503).json({
      success: false,
      error: 'FEATHERLESS_API_KEY is not configured or invalid. Please set a valid API key to use the chat assistant.',
      source: 'error'
    });
  }

  try {
      const contextSummary = eventContext ? `
Current Event Active Context:
- Name: ${eventContext.name || 'Celebration'}
- Type: ${eventContext.eventType || 'Event'}
- City: ${eventContext.location || 'India'}
- Guests: ${eventContext.guestCount || '50'}
- Budget: ₹${Number(eventContext.budget || 200000).toLocaleString('en-IN')} INR
- Theme: ${eventContext.themePreference || 'Modern'}
- Food: ${eventContext.foodPreference || 'Both'}
` : 'No specific event active.';

      const chatPrompt = `You are Celebra AI's Senior Celebration & Event Planner Assistant.
You give warm, highly practical, creative, and budget-conscious advice for organizing Indian and global celebrations (Weddings, Birthdays, Anniversaries, College Fests, Community Gatherings).
Always provide actionable suggestions with specific cost estimates, menu items, or scheduling details where appropriate.
${contextSummary}

User question: "${message}"

Answer clearly, formatted with concise bullet points, bold accents, and an encouraging tone. Keep the answer structured and easy to read.`;

      const response = await aiClient.chat.completions.create({
        model: 'MiniMaxAI/MiniMax-M3.1-Flash',
        messages: [{ role: 'user', content: chatPrompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      return res.json({
        success: true,
        source: 'featherless',
        reply: response.choices[0]?.message?.content || "I'm delighted to help you make this celebration extraordinary! Could you share a few more specifics?"
      });
  } catch (err: any) {
    console.error('Featherless chat error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate chat response. Please check your API key and try again.',
      source: 'error'
    });
  }
});

// 4. Personalized Idea Generator
app.post('/api/ai/ideas', async (req: Request, res: Response) => {
  const { category, eventContext } = req.body;

  if (aiClient && featherlessVerified) {
    try {
      const prompt = `You are Celebra AI's Creative Director.
Generate 4-5 distinctive, imaginative, and practical ideas for category: "${category}"
Event Context:
- Name: ${eventContext?.name || 'Celebration'}
- Type: ${eventContext?.eventType || 'Event'}
- Location: ${eventContext?.location || 'India'}
- Guests: ${eventContext?.guestCount || 50}
- Budget: ₹${eventContext?.budget || 200000}
- Theme: ${eventContext?.themePreference || 'Modern'}

Return ONLY a JSON array of objects:
[
  {
    "title": "Creative Title",
    "description": "Engaging description of the concept",
    "budgetRating": "Low / Medium / Luxury",
    "whyItWorks": "Psychological or experiential reason why guests will love it",
    "implementationTip": "Quick practical execution tip"
  }
]`;

      const response = await aiClient.chat.completions.create({
        model: 'MiniMaxAI/MiniMax-M3.1-Flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });

      const ideas = extractJSON(response.choices[0]?.message?.content || '[]');
      return res.json({ success: true, source: 'featherless', ideas });
    } catch (err: any) {
      console.error('Featherless ideas error:', err);
    }
  }

  // Fallback ideas generator
  const ideasMap: Record<string, any[]> = {
    themes: [
      {
        title: "Celestial Starlight & Royal Gold",
        description: "Midnight navy blue fabrics punctuated with twinkling fiber-optic canopies, brass constellation centerpieces, and glowing moons.",
        budgetRating: "Medium",
        whyItWorks: "Creates an intimate, magical evening ambiance that flatters photography and elevates mood.",
        implementationTip: "Use warm white fairy lights hung densely behind sheer navy chiffon drapes."
      },
      {
        title: "Sage & Lavender Botanical Haven",
        description: "Soft eucalyptus greens, blooming lavender sprigs, raw linen runners, and terracotta planters filled with fragrant herbs.",
        budgetRating: "Low",
        whyItWorks: "Fresh, relaxing, and highly photogenic without requiring expensive exotic blooms.",
        implementationTip: "Source potted lavender and rosemary from local nurseries that double as guest favors."
      },
      {
        title: "Sunset Peach & Rose Gold Radiance",
        description: "Warm sunset ombré palette transitioning from coral to soft blush, accented with brushed rose-gold candelabras and mirror trays.",
        budgetRating: "Medium",
        whyItWorks: "Brings glowing, flattering warmth to golden-hour photos and gives guests an inviting glow.",
        implementationTip: "Incorporate tinted glassware and amber taper candles on banquet tables."
      },
      {
        title: "Regal Heritage Velvet & Marigold",
        description: "Deep emerald velvet bolsters, cascades of marigold ropes, brass urlis with floating candles, and traditional sitar melodies.",
        budgetRating: "Medium",
        whyItWorks: "Timeless cultural elegance that appeals equally to elder family members and young guests.",
        implementationTip: "Book a local shehnai or sitar player for the initial 90 minutes of guest arrival."
      }
    ],
    decor: [
      {
        title: "Fairy Light Canopy Tunnel",
        description: "An arched entrance walkway created with warm string lights leading guests from the foyer into the main celebration arena.",
        budgetRating: "Low",
        whyItWorks: "Immediate 'wow' factor upon arrival that sets high anticipation for the evening.",
        implementationTip: "Rent commercial light curtain strings with warm 2700K color temperature."
      },
      {
        title: "Live Botanical Photo Monogram Wall",
        description: "Faux boxwood hedge backdrop featuring the host's initials or event crest in glowing neon white or warm gold acrylic.",
        budgetRating: "Medium",
        whyItWorks: "Guarantees every guest takes an Instagram photo, amplifying the celebration memories.",
        implementationTip: "Order a custom laser-cut acrylic neon sign that can later hang in the host's home."
      },
      {
        title: "Floating Candle & Brass Urli Cluster",
        description: "Clusters of antique brass vessels filled with scented rose petals and floating wick candles flanking pathways and staircases.",
        budgetRating: "Low",
        whyItWorks: "Infuses the air with subtle natural fragrance while guiding foot traffic safely and beautifully.",
        implementationTip: "Add 2 drops of pure mogra essential oil to the water in each urli."
      },
      {
        title: "Hanging Floral Chandelier Installation",
        description: "Central suspended floral wreath above the dance floor or main stage, combining cascading amaranthus and hanging tea-lights.",
        budgetRating: "Medium",
        whyItWorks: "Draws eyes upward and makes even standard venue ceilings feel majestic and spacious.",
        implementationTip: "Secure to venue trussing with fireproof clear nylon ties."
      }
    ],
    invitations: [
      {
        title: "Interactive WhatsApp Micro-Video with RSVP Link",
        description: "A 30-second animated video with festive motion graphics, background instrumentals, and a direct one-tap RSVP button.",
        budgetRating: "Low",
        whyItWorks: "98% open rate compared to email, zero printing lead time, and instant guest headcount tracking.",
        implementationTip: "Send along with a polite calendar (.ics) invite link for effortless reminders."
      },
      {
        title: "Seed Paper Plantable Stationery",
        description: "Handmade ivory cotton cards embedded with basil or wildflower seeds, printed with gold foil typography.",
        budgetRating: "Medium",
        whyItWorks: "Guests plant the invitation after the event, creating a living memory that blossoms in their garden.",
        implementationTip: "Include a cute miniature planting instruction tag tied with jute thread."
      },
      {
        title: "Vintage Telegram Style Keepsake",
        description: "Charming retro kraft envelope stamped with wax seal and calligraphed celebration declaration.",
        budgetRating: "Low",
        whyItWorks: "Unique tactile novelty that guests stick on their refrigerator noticeboards.",
        implementationTip: "Use personalized wax seals engraved with the event emblem."
      }
    ],
    menu: [
      {
        title: "Interactive Global Live Chaat & Taco Bar",
        description: "Chefs assembling crispy puchkas with flavored waters (Pomegranate mint, Jaljeera, Hing) alongside Mexican street tacos.",
        budgetRating: "Medium",
        whyItWorks: "Guests love custom culinary theatre and watching hot food prepared to their spice level.",
        implementationTip: "Position live stations away from the entrance to prevent crowd bottlenecking."
      },
      {
        title: "Signature Host Mocktails & Cocktails",
        description: "Two bespoke drinks named after memorable milestones of the hosts, served in smoked glassware with rosemary garnishes.",
        budgetRating: "Low",
        whyItWorks: "Highly personal touch that sparks conversation among guests waiting in line.",
        implementationTip: "Print miniature card menus beside the bar explaining the story behind each drink name."
      },
      {
        title: "Artisanal Dessert Flight & Live Kulfi Stick Counter",
        description: "Matka kulfis carved live into rabri pools with pistachio sprinkles, paired with warm walnut brownies.",
        budgetRating: "Medium",
        whyItWorks: "Satisfies nostalgic cravings while delivering a premium culinary finish.",
        implementationTip: "Offer lactose-free and sugar-free options labeled clearly."
      }
    ],
    surprises: [
      {
        title: "Secret Flash-Mob Video Compilation",
        description: "Short pre-recorded congratulatory messages from distant relatives and childhood friends compiled into a 4-minute tribute.",
        budgetRating: "Low",
        whyItWorks: "Brings emotional tears of joy and connects guests across continents.",
        implementationTip: "Play right before the cake cutting or during dinner when everyone is seated."
      },
      {
        title: "Retro Audio Guestbook Telephone",
        description: "A vintage rotary phone where guests pick up the receiver, hear a recorded welcome from the host, and leave voice messages.",
        budgetRating: "Medium",
        whyItWorks: "Captures laughter, heartfelt blessings, and unfiltered emotion far better than written guestbooks.",
        implementationTip: "Place in a quieter corner with clear instructions and flattering warm lighting."
      },
      {
        title: "Sparkler Grand Exit / First Dance Finale",
        description: "Distribute smokeless long-burning handheld sparklers to all guests to illuminate the couple or host’s grand finale.",
        budgetRating: "Low",
        whyItWorks: "Produces breathtaking photographs and gives every single guest an active part in the highlight moment.",
        implementationTip: "Ensure venue allows cold-flame sparklers and have sand buckets ready for safe disposal."
      }
    ],
    gifts: [
      {
        title: "Artisanal Spice & Organic Forest Honey Box",
        description: "Handcrafted miniature pine boxes containing wild honey jars and single-origin cinnamon or saffron sticks.",
        budgetRating: "Medium",
        whyItWorks: "Wholesome, healthy, long shelf-life, and cherished by families of all ages.",
        implementationTip: "Personalize the wooden lid with laser etching of the celebration date."
      },
      {
        title: "Hand-Poured Soy Wax Scented Candles",
        description: "Custom fragrance (e.g. Amber Sandalwood or Jasmine Blossom) in frosted glass vessels with wooden crackling wicks.",
        budgetRating: "Low",
        whyItWorks: "Guests light the candle at home, rekindling the warm memories of your event.",
        implementationTip: "Include a thank-you matchbox with custom match heads matching the event color palette."
      },
      {
        title: "Potted Lucky Bamboo / Jade Plant",
        description: "Miniature ceramic pot with succulent or jade plant symbolizing growth, abundance, and auspicious beginnings.",
        budgetRating: "Low",
        whyItWorks: "Eco-friendly, long-lasting, and universally beloved.",
        implementationTip: "Add a small care-guide tag tied with ribbon."
      }
    ]
  };

  const ideas = ideasMap[category] || ideasMap['themes'];
  res.json({ success: true, source: 'curated_engine', isDemoFallback: true, ideas });
});

// Fallback plan generator for robust offline/demo execution
function generateFallbackPlan(params: any) {
  const budget = params.budget || 200000;
  const guests = params.guestCount || 50;
  const isWedding = params.eventType?.toLowerCase().includes('wedding');
  const isBirthday = params.eventType?.toLowerCase().includes('birthday');

  return {
    overview: {
      concept: `An impeccably curated ${params.eventType} celebrating ${params.name || 'this milestone'} in ${params.location || 'style'}, blending elevated hospitality, ambient aesthetics, and seamless guest experiences within an optimized budget of ₹${budget.toLocaleString('en-IN')}.`,
      tagline: isWedding ? "Two Souls, One Unforgettable Beginning" : isBirthday ? "Another Year of Joy & Wonder" : "Celebrate The Moments That Matter",
      vibe: "Warm, Sophisticated, Joyful, Welcoming",
      keyHighlights: [
        `Curated bespoke menu catering to ${guests} esteemed guests`,
        "Cohesive visual palette with atmospheric illumination",
        "Interactive memory-making moments and dedicated photo installations",
        "Streamlined vendor orchestration with buffer cost safeguards"
      ]
    },
    theme: {
      name: params.themePreference || "Contemporary Regal Ivory & Sage",
      description: "A timeless balance of organic earthy greens, warm ivory fabrics, and delicate gilded accents that feels lavish yet approachable.",
      colorPalette: [
        { name: "Warm Ivory", hex: "#FAF8F5", usage: "Drapes, table linens, and main backdrop" },
        { name: "Sage Botanical", hex: "#6B9080", usage: "Floral foliage, eucalyptus arches, and menus" },
        { name: "Muted Peach", hex: "#F9A074", usage: "Accent floral blooms and delicate stationery" },
        { name: "Burnished Gold", hex: "#D4AF37", usage: "Candelabras, cutlery, and metallic signage" }
      ],
      decorConcepts: [
        { zone: "Foyer & Welcome Entry", description: "Bespoke welcome easel with calligraphy, flanked by copper urlis with floating candles and fresh rose petals." },
        { zone: "Central Focal Stage", description: "Geometric arched backdrop draped with ivory organza, framed by organic eucalyptus cascades and warm fairy-light cascades." },
        { zone: "Dining Tables & Lounge", description: "Raw linen runners, low floral centerpieces with fragrant mogra and tea-lights, allowing effortless guest conversation." },
        { zone: "Interactive Photo Vignette", description: "Vintage velvet settee in front of an ambient neon quote wall surrounded by potted botanical planters." }
      ],
      lighting: "Soft ambient warm-white (2700K) uplighters, fairy-light overhead canopies, and flickering tabletop votives."
    },
    venue: {
      typeRecommendation: params.venuePreference === 'Outdoor' ? "Open-air Boutique Lawn or Farmhouse" : params.venuePreference === 'Indoor' ? "Grand Pillarless Banquet Hall" : "Indoor-Outdoor Hybrid Courtyard with Glass Canopy",
      idealCapacity: `${Math.round(guests * 1.15)} to ${Math.round(guests * 1.3)} pax comfortably seated`,
      searchKeywords: [`Top ${params.eventType} venues in ${params.location || 'city'}`, "Boutique banquet lawns", "Intimate celebration spaces"],
      keyConsiderations: [
        "Dedicated power backup for sound and lighting",
        "Accessible restrooms and dedicated green room for hosts",
        "Ample valet parking or easy drop-off zone"
      ]
    },
    catering: {
      style: "Live interactive appetizer counters followed by a curated royal buffet",
      welcomeDrinks: ["Spiced Lychee Cooler with Mint", "Aam Panna with Pink Himalayan Salt"],
      appetizers: ["Paneer Tikka with Wild Chimichurri", "Crispy Lotus Root in Sweet Chilli Glaze", "Dahi Puri Spheres with Mint Foam"],
      mains: ["Kashmiri Rogan Josh / Dum Paneer Lababdar", "Slow-Simmered Dal Bukhara", "Hyderabadi Fragrant Biryani with Burani Raita", "Assorted Butter Naan & Laccha Parathas"],
      desserts: ["Live Hot Angoori Gulab Jamun with Chilled Kesar Rabri", "Artisanal Mango Kulfi Cuts"],
      specialNotes: "Clear dietary allergen tags for Jain, Vegan, and gluten-free attendees."
    },
    entertainment: {
      musicStyle: "Acoustic instrumental fusion during guest arrival, transitioning into high-energy celebration tracks",
      activities: [
        { title: "Host Milestone Trivia", description: "Fun smartphone or emcee-driven 15-minute trivia with witty custom prizes." },
        { title: "Audio Guestbook Phone", description: "Guests pick up an antique phone receiver to record heartfelt blessings." }
      ],
      ceremonialMoments: ["Grand Host Entrance with Cold Pyro Sparklers", "Heartfelt Family Toast & Cake Celebration", "Group Photo Celebration"]
    },
    guestExperience: {
      welcomeFavor: "Traditional welcome refreshment kit with cooling scented wipes and pocket mints",
      interactiveTouchpoints: ["Customized celebration hashtag board", "Instant polaroid guestbook station with metallic pens"],
      returnGiftIdea: "Handcrafted brass box containing artisanal dry fruits and organic forest honey jar"
    },
    costBreakdown: [
      { category: "Venue", allocatedPercentage: 25, estimatedAmount: Math.round(budget * 0.25), notes: "Venue rental, setup fees, power backup" },
      { category: "Catering", allocatedPercentage: 35, estimatedAmount: Math.round(budget * 0.35), notes: `Food & beverage for ${guests} guests` },
      { category: "Decoration", allocatedPercentage: 15, estimatedAmount: Math.round(budget * 0.15), notes: "Stage backdrop, florals, lighting" },
      { category: "Photography", allocatedPercentage: 10, estimatedAmount: Math.round(budget * 0.10), notes: "Candid photographer + video reels" },
      { category: "Entertainment", allocatedPercentage: 6, estimatedAmount: Math.round(budget * 0.06), notes: "Sound setup, DJ, Emcee" },
      { category: "Invitations", allocatedPercentage: 2, estimatedAmount: Math.round(budget * 0.02), notes: "Digital video invitations & WhatsApp bot" },
      { category: "Transportation", allocatedPercentage: 3, estimatedAmount: Math.round(budget * 0.03), notes: "Host logistics & airport transfers" },
      { category: "Miscellaneous", allocatedPercentage: 4, estimatedAmount: Math.round(budget * 0.04), notes: "Contingency reserve & vendor tips" }
    ],
    eventDaySchedule: [
      { time: "03:00 PM", activity: "Vendor load-in & decor structural inspection", responsible: "Event Coordinator" },
      { time: "05:00 PM", activity: "Sound check, lighting balance & photography briefing", responsible: "Lead Tech & Photographer" },
      { time: "06:30 PM", activity: "Guest arrival, welcome coolers & live acoustic music", responsible: "Hospitality Lead" },
      { time: "07:30 PM", activity: "Grand entrance & ceremonial celebration", responsible: "Emcee & Hosts" },
      { time: "08:30 PM", activity: "Dinner buffet open & candid photo sessions", responsible: "Catering Captain" },
      { time: "10:00 PM", activity: "Dance floor opening & closing celebration toast", responsible: "DJ & Family" }
    ],
    preparationTimeline: [
      { phase: "4-6 Weeks Prior", task: "Confirm venue contract & lock total guest capacity", priority: "High" },
      { phase: "3 Weeks Prior", task: "Conduct food tasting and lock signature catering menu", priority: "High" },
      { phase: "2 Weeks Prior", task: "Dispatch digital video invites and monitor RSVP confirmations", priority: "Medium" },
      { phase: "1 Week Prior", task: "Finalize photo shot-list, music playlist & decor mockups", priority: "High" },
      { phase: "3 Days Prior", task: "Package guest return gifts and verify vendor contacts", priority: "Medium" },
      { phase: "Event Day", task: "Execute on-site timeline and celebrate without stress!", priority: "High" }
    ]
  };
}

// Dev vs Production Vite handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Celebra AI server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
