import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Initialize Featherless client
function getFeatherlessClient(): OpenAI {
  const apiKey = process.env.FEATHERLESS_API_KEY;

  if (!apiKey || apiKey === 'MY_FEATHERLESS_API_KEY' || apiKey.trim() === '') {
    throw new Error('FEATHERLESS_API_KEY is not configured');
  }

  return new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.featherless.ai/v1'
  });
}

// Helper for clean JSON extraction from AI response
function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (err2) {
        // Continue
      }
    }
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

// Status endpoint
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    const url = req.url || '';

  // Route handling
  if (url.includes('/api/status') && req.method === 'GET') {
    try {
      getFeatherlessClient();
      res.json({
        featherlessAvailable: true,
        model: 'MiniMaxAI/MiniMax-M3.1-Flash',
        mode: 'Live Featherless AI',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({
        error: 'Featherless API not configured',
        message: 'FEATHERLESS_API_KEY environment variable is required'
      });
    }
    return;
  }

  // 1. AI Event Plan Generation
  if (url.includes('/api/ai/plan') && req.method === 'POST') {
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

    const aiClient = getFeatherlessClient();

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
  }

  // 2. AI Budget Optimization
  if (url.includes('/api/ai/optimize-budget') && req.method === 'POST') {
    const { eventName, budget, estimatedCost, actualSpent, categories } = req.body;
    const budgetNum = Number(budget) || 100000;
    const estimatedNum = Number(estimatedCost) || 120000;
    const overrun = Math.max(0, estimatedNum - budgetNum);

    const aiClient = getFeatherlessClient();

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
  }

  // 3. AI Celebration Assistant Chatbot
  if (url.includes('/api/ai/chat') && req.method === 'POST') {
    const { message, eventContext } = req.body;

    // Require valid API key - no fallback to demo mode
    let aiClient: OpenAI;
    try {
      aiClient = getFeatherlessClient();
    } catch (err) {
      return res.status(503).json({
        success: false,
        error: 'FEATHERLESS_API_KEY is not configured or invalid. Please set a valid API key to use the chat assistant.',
        source: 'error'
      });
    }

    try {
      const contextSummary = eventContext ? `
Current Event Active Context:
|- Name: ${eventContext.name || 'Celebration'}
|- Type: ${eventContext.eventType || 'Event'}
|- City: ${eventContext.location || 'India'}
|- Guests: ${eventContext.guestCount || '50'}
|- Budget: ₹${Number(eventContext.budget || 200000).toLocaleString('en-IN')} INR
|- Theme: ${eventContext.themePreference || 'Modern'}
|- Food: ${eventContext.foodPreference || 'Both'}
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
  }

  // 4. Personalized Idea Generator
  if (url.includes('/api/ai/ideas') && req.method === 'POST') {
    const { category, eventContext } = req.body;

    const aiClient = getFeatherlessClient();

    const prompt = `You are Celebra AI's Creative Director.
Generate 4-5 distinctive, imaginative, and practical ideas for category: "${category}"
Event Context:
|- Name: ${eventContext?.name || 'Celebration'}
|- Type: ${eventContext?.eventType || 'Event'}
|- Location: ${eventContext?.location || 'India'}
|- Guests: ${eventContext?.guestCount || 50}
|- Budget: ₹${eventContext?.budget || 200000}
|- Theme: ${eventContext?.themePreference || 'Modern'}

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
  }

  res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    });
  }
}
