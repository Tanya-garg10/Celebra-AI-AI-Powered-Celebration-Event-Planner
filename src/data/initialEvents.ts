import { CelebrationEvent } from '../types.ts';

export const INITIAL_EVENTS: CelebrationEvent[] = [
  {
    id: 'evt-wedding-01',
    name: "Aarav & Meera's Regal Palace Wedding",
    eventType: 'Wedding',
    date: '2026-12-18',
    location: 'Udaipur, Rajasthan',
    guestCount: 200,
    budget: 1200000,
    duration: '2 Days',
    themePreference: 'Regal Ivory, Marigold & Burnished Gold',
    venuePreference: 'Outdoor',
    foodPreference: 'Both',
    specialRequirements: 'Grand lakeside mandap, live shehnai & sitar welcome, eco-friendly seed-paper stationery',
    priorities: ['Royal Hospitality & Gourmet Feast', 'Visual Aesthetic & Mandap Styling', 'Candid Cinematic Photography'],
    createdAt: '2026-10-15T10:00:00Z',
    aiPlan: {
      planningMode: 'Balanced',
      overview: {
        concept: "A majestic royal celebration honoring heritage traditions with modern romantic luxury, set against moonlit palace courtyards with ambient candlelit water features.",
        tagline: "Two Souls, One Timeless Legacy",
        vibe: "Regal, Warm, Ethereal, Unforgettable",
        keyHighlights: [
          "Floating lotus mandap on lakeside courtyard",
          "Authentic Mewari & Awadhi royal culinary banquet",
          "Acoustic folk fusion ensemble during sunset vows",
          "Cold-sparkler procession with royal dholak welcome"
        ]
      },
      theme: {
        name: "Regal Ivory, Saffron & Burnished Gold",
        description: "A tribute to Rajasthani palace grandeur using organic marigold garlands, heavy ivory linen drapes, and warm brass candle urlis.",
        colorPalette: [
          { name: "Royal Ivory", hex: "#FAF8F5", usage: "Drapes, table runners, and main tenting" },
          { name: "Saffron Gold", hex: "#E59866", usage: "Fresh marigold garlands & royal tassels" },
          { name: "Emerald Sage", hex: "#4A705B", usage: "Eucalyptus accents & botanical foliage" },
          { name: "Burnished Gold", hex: "#D4AF37", usage: "Brass candelabras, cutlery, and metallic frames" }
        ],
        decorConcepts: [
          { zone: "Palace Courtyard Entry", description: "Grand toran with 10,000 hand-threaded marigolds, flanked by twin antique brass urlis with floating candles and mogra petals." },
          { zone: "Lakeside Mandap", description: "Four-pillar carved teak pavilion enveloped in ivory chiffon, cascading jasmine tendrils, and warm amber uplighting." },
          { zone: "Royal Dining Enclave", description: "Low velvet seating bolsters for elders and mirror-topped tables with miniature brass lanterns for banquets." },
          { zone: "Photo Vignette & Bar", description: "A floral jharokha arch with warm incandescent filament globes and customized brass initials." }
        ],
        lighting: "Warm 2400K candlelight washes, ambient perimeter fairy canopies, and architectural uplighting on stone pillars."
      },
      venue: {
        typeRecommendation: "Heritage Palace Lawn or Lakeside Haveli with Courtyard",
        idealCapacity: "220-260 guests seated comfortably with buffer",
        searchKeywords: ["Heritage palace wedding Udaipur", "Lakeside wedding haveli Rajasthan", "Royal lawn banquet Udaipur"],
        keyConsiderations: [
          "Dedicated power generators for continuous ambient lighting and live sound",
          "Lake breeze wind anchors for decorative canopies and floral arches",
          "Smooth accessibility route for elder family members and procession path"
        ]
      },
      catering: {
        style: "Live interactive live counters for sunset high tea followed by a 4-course royal thali banquet",
        welcomeDrinks: ["Chilled Kesariya Thandai with Rose Petals", "Spiced Kokum Fizz with Mint Sprig"],
        appetizers: ["Truffle Amritsari Paneer Tikka", "Mutton Galouti Kebabs on Sheermal Crisps", "Kurkuri Bhindi Chaat with Pomegranate pearls"],
        mains: ["Laal Maas slow-cooked in Mathania chillies", "Paneer Pasanda in rich saffron cashew gravy", "Dal Baati Churma with five-chutney platter", "Hyderabadi Dum Biryani with Mirchi ka Salan", "Artisanal Breads (Missi Roti, Sheermal, Garlic Naan)"],
        desserts: ["Live Hot Jalebi with Saffron Malai Rabri", "Moong Dal Halwa in terracotta pots", "Gulab Jamun infused with cardamom liquor"],
        specialNotes: ["Dedicated segregated vegetarian kitchen for Jain relatives", "Nut allergen cards displayed clearly at sweet counters"]
      },
      entertainment: {
        musicStyle: "Daytime instrumental sitar & flute jugalbandi, transitioning to high-energy folk DJ and Sangeet brass fusion",
        activities: [
          { title: "Bespoke Royal Safa & Dupatta Tying", description: "Artisan turban stylists drape colorful silk safas for all arrival guests." },
          { title: "Live Lac Bangle Maker Station", description: "Traditional craftsman creating custom-sized lac bangles for ladies as instant live keepsakes." }
        ],
        ceremonialMoments: ["Baraat Arrival with Royal Heritage Troupe", "Varmala Exchange over Mist & Cold Pyro", "Grand Family Champagne & Sherbet Toast"]
      },
      guestExperience: {
        welcomeFavor: "Embroidered velvet pouch with attar bottle, organic roasted dry fruits, and handwritten welcome note.",
        interactiveTouchpoints: ["Audio guestbook vintage telephone to record blessings", "Instant Polaroid memory wall with metallic calligraphy pens"],
        returnGiftIdea: "Handcrafted brass box with Kashmiri saffron strands, organic mountain honey, and silver coin."
      },
      costBreakdown: [
        { category: "Venue", allocatedPercentage: 28, estimatedAmount: 336000, notes: "Heritage courtyard, 2-day lawn rental & green rooms" },
        { category: "Catering", allocatedPercentage: 34, estimatedAmount: 408000, notes: "2 dinners + 1 high tea for 200 guests with live counters" },
        { category: "Decoration", allocatedPercentage: 15, estimatedAmount: 180000, notes: "Mandap, floral jharokhas, lighting canopy, stage" },
        { category: "Photography", allocatedPercentage: 10, estimatedAmount: 120000, notes: "Cinematic 3-camera team, drone, reels + candid album" },
        { category: "Entertainment", allocatedPercentage: 5, estimatedAmount: 60000, notes: "Sitar artists, folk troupe, DJ and audio engineering" },
        { category: "Invitations", allocatedPercentage: 2, estimatedAmount: 24000, notes: "Seed paper physical cards + bespoke animated video suite" },
        { category: "Transportation", allocatedPercentage: 3, estimatedAmount: 36000, notes: "Airport shuttles & vintage car for baraat" },
        { category: "Miscellaneous", allocatedPercentage: 3, estimatedAmount: 36000, notes: "Contingency buffer, tips & licensing" }
      ],
      eventDaySchedule: [
        { id: 'sch-1', time: "02:30 PM", activity: "Vendor final soundcheck, Mandap floral inspection", responsible: "Lead Coordinator", status: "Completed", delayMinutes: 0 },
        { id: 'sch-2', time: "04:30 PM", activity: "Guest welcome high tea, safa tying & live sitar music", responsible: "Hospitality Lead", status: "Current", delayMinutes: 0 },
        { id: 'sch-3', time: "06:00 PM", activity: "Grand Baraat procession and groom arrival", responsible: "Family & Dholak Troupe", status: "Upcoming", delayMinutes: 0 },
        { id: 'sch-4', time: "07:15 PM", activity: "Varmala ceremony at lakeside arch with cold fireworks", responsible: "Emcee & Photo Team", status: "Upcoming", delayMinutes: 0 },
        { id: 'sch-5', time: "08:15 PM", activity: "Royal wedding pheras at illuminated mandap", responsible: "Panditji & Family", status: "Upcoming", delayMinutes: 0 },
        { id: 'sch-6', time: "09:30 PM", activity: "Grand wedding banquet opens with live dessert stations", responsible: "Catering Director", status: "Upcoming", delayMinutes: 0 },
        { id: 'sch-7', time: "11:00 PM", activity: "Vidaai ceremony & heartfelt farewell", responsible: "Hosts", status: "Upcoming", delayMinutes: 0 }
      ],
      preparationTimeline: [
        { phase: "6-8 Weeks Prior", task: "Lock venue contract, block rooms for outstation guests", priority: "High" },
        { phase: "4-6 Weeks Prior", task: "Conduct food tasting and finalize menu courses", priority: "High" },
        { phase: "3-4 Weeks Prior", task: "Send digital invites with RSVP link and attire guide", priority: "Medium" },
        { phase: "2 Weeks Prior", task: "Mandap 3D mockup approval and playlist review with DJ", priority: "High" },
        { phase: "1 Week Prior", task: "Finalize guest seating charts & confirm vendor timing", priority: "High" },
        { phase: "2 Days Prior", task: "Assemble welcome hampers and run emergency vendor tests", priority: "Medium" },
        { phase: "Event Day", task: "Coordinate timelines seamlessly and celebrate with peace of mind!", priority: "High" }
      ]
    },
    expenses: [
      { id: 'exp-1', category: 'Venue', title: 'Palace Courtyard & Lawn Advance', estimatedCost: 336000, actualCost: 340000, paidAmount: 200000, status: 'Partial', date: '2026-10-20', receiptName: 'FatehGarh_Invoice_#482.pdf' },
      { id: 'exp-2', category: 'Catering', title: 'Royal Feast Per-Plate Contract (200 pax)', estimatedCost: 408000, actualCost: 415000, paidAmount: 150000, status: 'Partial', date: '2026-10-22', receiptName: 'MewarCatering_Proposal.pdf' },
      { id: 'exp-3', category: 'Decoration', title: 'Mandap, Marigold Garlands & Uplighting', estimatedCost: 180000, actualCost: 175000, paidAmount: 100000, status: 'Partial', date: '2026-10-25', receiptName: 'Udaifloral_Contract.pdf' },
      { id: 'exp-4', category: 'Photography', title: 'Cinema & Candid Photography Package', estimatedCost: 120000, actualCost: 120000, paidAmount: 60000, status: 'Partial', date: '2026-10-27', receiptName: 'StoriesInStarlight_Retainer.pdf' },
      { id: 'exp-5', category: 'Entertainment', title: 'Live Folk Artists, Shehnai & DJ Truss', estimatedCost: 60000, actualCost: 58000, paidAmount: 30000, status: 'Partial', date: '2026-10-28' },
      { id: 'exp-6', category: 'Invitations', title: 'Bespoke Seed Paper + WhatsApp Video Suite', estimatedCost: 24000, actualCost: 22000, paidAmount: 22000, status: 'Paid', date: '2026-10-18' },
      { id: 'exp-7', category: 'Transportation', title: 'Fleet Shuttles from Udaipur Airport', estimatedCost: 36000, actualCost: 35000, paidAmount: 15000, status: 'Partial', date: '2026-10-29' },
      { id: 'exp-8', category: 'Miscellaneous', title: 'Panditji Dakshina & Pooja Samagri', estimatedCost: 20000, actualCost: 18000, paidAmount: 18000, status: 'Paid', date: '2026-10-30' }
    ],
    tasks: [
      { id: 'tsk-1', name: 'Finalize Mandap floral color scheme', description: 'Ensure marigolds are fresh morning-harvested and flame-retardant fabric is used for drapery.', priority: 'High', deadline: '2026-11-15', status: 'Completed', phase: 'Pre-Planning', category: 'Decoration', assignedToName: 'Meera (Creative Lead)', dependencyTaskName: 'Venue Layout Approval' },
      { id: 'tsk-2', name: 'Menu tasting with Mewari masterchef', description: 'Taste test Dal Baati Churma, Laal Maas, and saffron rabri desserts with family elders.', priority: 'High', deadline: '2026-11-20', status: 'Completed', phase: 'Catering', category: 'Catering', assignedToName: 'Aarav (Lead Host)' },
      { id: 'tsk-3', name: 'Dispatch digital video invites to outstation guests', description: 'Share interactive link with hotel accommodation details and Google Maps location pin.', priority: 'High', deadline: '2026-11-25', status: 'Pending', phase: 'Invitations', category: 'Invitations', assignedToName: 'Rohan (Budget Lead)' },
      { id: 'tsk-4', name: 'Coordinate airport shuttle logistics schedule', description: 'Group guests arriving on common Indigo and Air India flights from Delhi/Mumbai.', priority: 'Medium', deadline: '2026-12-05', status: 'Pending', phase: 'Logistics', category: 'Transportation', assignedToName: 'Ananya (Day-of Coordinator)' },
      { id: 'tsk-5', name: 'Assemble handcrafted welcome gift hampers', description: 'Pack saffron honey jars, embroidered pouches, and cooling mist bottles.', priority: 'Medium', deadline: '2026-12-10', status: 'Pending', phase: 'Gifts', category: 'Guest Experience', assignedToName: 'Meera (Creative Lead)' },
      { id: 'tsk-6', name: 'Pre-wedding tech walkthrough with DJ & Lighting Lead', description: 'Verify generator wattage, sound volume curfew, and wireless mics for rituals.', priority: 'High', deadline: '2026-12-16', status: 'Pending', phase: 'Production', category: 'Entertainment', assignedToName: 'Ananya (Day-of Coordinator)' }
    ],
    vendors: [
      {
        id: 'vnd-1',
        category: 'Venue',
        name: 'Fateh Garh Heritage Palace',
        contactPerson: 'Vikram Singh Rathore',
        phone: '+91 98290 12345 (Sample)',
        email: 'events@fatehgarh-sample.in',
        estimatedCost: 340000,
        advancePaid: 200000,
        status: 'Booked',
        rating: 4.9,
        notes: 'Includes heritage lakeside courtyard, banquet hall, and 4 preparation suites.',
        isDemo: true,
        contractAttached: true,
        quotations: [
          { vendorName: 'Fateh Garh Palace', quotedCost: 340000, inclusions: 'Courtyard + Banquet + 4 Suites + Generator', pros: 'Spectacular lake vista', isRecommended: true },
          { vendorName: 'Shiv Niwas Palace (Alt)', quotedCost: 420000, inclusions: 'Lawn only, rooms extra', pros: 'High brand prestige' }
        ]
      },
      {
        id: 'vnd-2',
        category: 'Catering',
        name: 'Royal Mewar Culinary Craft',
        contactPerson: 'Chef Devendra Chouhan',
        phone: '+91 94141 54321 (Sample)',
        email: 'chef@mewarcaterers-sample.in',
        estimatedCost: 415000,
        advancePaid: 150000,
        status: 'Booked',
        rating: 4.8,
        notes: 'Specializes in authentic Rajasthani royal feasts with copper chafing dishes.',
        isDemo: true,
        contractAttached: true,
        quotations: [
          { vendorName: 'Royal Mewar Craft', quotedCost: 415000, inclusions: '2 Dinners + 1 High Tea, 6 live chaat stations', pros: 'Exceptional Laal Maas & Rabri', isRecommended: true },
          { vendorName: 'Bespoke Flavors Catering', quotedCost: 460000, inclusions: 'Buffet only, dessert cart extra', pros: 'Modern plated appetizers' }
        ]
      },
      {
        id: 'vnd-3',
        category: 'Decoration',
        name: 'Udaivilas Floral & Starlight Decor',
        contactPerson: 'Aanya Sharma',
        phone: '+91 98100 98765 (Sample)',
        email: 'aanya@udaifloral-sample.in',
        estimatedCost: 175000,
        advancePaid: 100000,
        status: 'Booked',
        rating: 4.9,
        notes: 'Mandap, 20 brass urlis, ceiling fairy lights, entrance toran.',
        isDemo: true,
        contractAttached: true
      },
      {
        id: 'vnd-4',
        category: 'Photography',
        name: 'Stories In Starlight Cine Studios',
        contactPerson: 'Kabir Verma',
        phone: '+91 99200 45678 (Sample)',
        email: 'kabir@storiesinstarlight-sample.com',
        estimatedCost: 120000,
        advancePaid: 60000,
        status: 'Booked',
        rating: 5.0,
        notes: '3 candid photographers, 2 cinematic reel editors, 4K documentary film.',
        isDemo: true,
        contractAttached: true
      },
      {
        id: 'vnd-5',
        category: 'Entertainment',
        name: 'Desert Strings & Sitar Trio',
        contactPerson: 'Pandit Rakesh Bhatt',
        phone: '+91 97830 33445 (Sample)',
        email: 'rakesh@desertstrings-sample.in',
        estimatedCost: 58000,
        advancePaid: 30000,
        status: 'Booked',
        rating: 4.7,
        notes: 'Classical sitar jugalbandi for sunset ceremony + DJ sound engineering.',
        isDemo: true
      }
    ],
    guests: [
      { id: 'gst-1', name: 'Rajesh & Sunita Mehra', email: 'rajesh.mehra@sample.com', phone: '+91 98201 11223', status: 'Confirmed', mealPreference: 'Vegetarian', plusCount: 2, notes: 'Bride’s maternal uncle', group: "Bride's Family", tableAssigned: 'Table 1 - Royal Elders' },
      { id: 'gst-2', name: 'Vikramaditya & Radhika Singhania', email: 'vikram.singh@sample.com', phone: '+91 98110 33445', status: 'Confirmed', mealPreference: 'Non-vegetarian', plusCount: 1, notes: 'Family friends from Jaipur', group: 'VIP', tableAssigned: 'Table 2 - VIP Circle' },
      { id: 'gst-3', name: 'Dr. Ramesh Chandra (Jain Meal)', email: 'r.chandra@sample.org', phone: '+91 94140 55667', status: 'Confirmed', mealPreference: 'Jain', plusCount: 1, notes: 'Strict Jain meal without root vegetables', group: 'Family & Relatives', tableAssigned: 'Table 1 - Royal Elders' },
      { id: 'gst-4', name: 'Kunal Kapoor & Family', email: 'kunal.k@sample.com', phone: '+91 99201 77889', status: 'Confirmed', mealPreference: 'Non-vegetarian', plusCount: 3, notes: 'Groom’s college roommate', group: 'College Friends', tableAssigned: 'Table 3 - Lakeside Friends' },
      { id: 'gst-5', name: 'Pooja & Sameer Oberoi', email: 'pooja.oberoi@sample.com', phone: '+91 98330 99001', status: 'Pending', mealPreference: 'Vegetarian', plusCount: 1, notes: 'RSVP follow-up pending', group: 'Work Colleagues' },
      { id: 'gst-6', name: 'Ananya & Rohan Desai', email: 'ananya.d@sample.com', phone: '+91 97690 22334', status: 'Pending', mealPreference: 'Vegetarian', plusCount: 2, notes: 'Awaiting travel confirmation', group: 'College Friends' },
      { id: 'gst-7', name: 'Siddharth Batra', email: 'sid.batra@sample.com', phone: '+91 98205 66778', status: 'Declined', mealPreference: 'Non-vegetarian', plusCount: 0, notes: 'Out of country on assignment', group: 'College Friends' }
    ],

    // NEW ADVANCED FEATURES STATE
    moodboards: [
      {
        id: 'mb-1',
        title: 'Royal Palace Amber & Marigold',
        vibe: 'Opulent Heritage Royalty',
        colorPalette: [
          { name: 'Warm Ivory', hex: '#FAF8F5', usage: 'Flowing drapes & backdrop sheer' },
          { name: 'Saffron Marigold', hex: '#E59866', usage: 'Hand-threaded fresh floral torans' },
          { name: 'Burnished Gold', hex: '#D4AF37', usage: 'Antique brass urlis & candelabras' },
          { name: 'Emerald Sage', hex: '#4A705B', usage: 'Eucalyptus foliage & mandap canopy' }
        ],
        decorStyle: 'Carved teakwood pavilion arches, cascading mogra tassels, low velvet bolsters, and floating lotus candles.',
        floralConcept: 'Fresh local Genda (yellow and orange marigolds), white mogra, tuberose garlands, and preserved palm leaves.',
        lightingVibe: 'Warm 2400K filament fairy canopies, amber LED stone wash uplighters, and flickering brass diyas.',
        outfitTheme: {
          host: 'Raw silk ivory sherwani with antique zardozi work & blush rose lehenga with gold gotta patti.',
          guests: 'Royal festive pastels or rich jewel tones (Emerald, Mustard, Saffron, Blush).',
          dressCode: 'Royal Indian Festive'
        },
        fabricTextures: ['Heavy Chanderi Silk', 'Crushed Ivory Velvet', 'Organza Drapes', 'Raw Linen Runners'],
        inspirationNotes: [
          'Position brass urlis with floating candles along the stone stairway.',
          'Surround the lake mandap with gentle cool-mist fog during the pheras.'
        ],
        createdAt: '2026-10-16T12:00:00Z'
      },
      {
        id: 'mb-2',
        title: 'Lakeside Sunset Bohemian Chic',
        vibe: 'Romantic, Ethereal & Intimate',
        colorPalette: [
          { name: 'Blush Rose', hex: '#FBCFE8', usage: 'Floral centerpieces' },
          { name: 'Muted Terracotta', hex: '#F97352', usage: 'Clay planters & stationery' },
          { name: 'Champagne Beige', hex: '#FEF3C7', usage: 'Rattan furniture & cushions' }
        ],
        decorStyle: 'Macrame runners, dried pampas grass, low wooden picnic tables, and fairy-lit teepees.',
        floralConcept: 'Blush spray roses, baby breath clouds, and dried wheat stalks.',
        lightingVibe: 'Festoon Edison bulbs and warm white fairy drapes.',
        outfitTheme: {
          host: 'Linen bandhgala & breezy organza floral saree.',
          guests: 'Breezy sundresses, pastel kurtas, and open footwear.',
          dressCode: 'Sunset Chic Casual'
        },
        fabricTextures: ['Natural Jute', 'Soft Cotton Voile', 'Raw Bamboo Weave'],
        inspirationNotes: ['Ideal for the pre-wedding sunset high tea on the courtyard terrace.'],
        createdAt: '2026-10-18T15:00:00Z'
      }
    ],

    seatingLayout: {
      venueDimensions: '40m x 25m Lakeside Pavilion Lawn',
      totalSeatsPlaced: 180,
      zones: [
        { id: 'zone-mandap', type: 'mandap', name: 'Lakeside Sacred Mandap', x: 50, y: 15, seats: 12, assignedGuestNames: ['Bride & Groom', 'Parents & Panditji'], shape: 'circle' },
        { id: 'zone-stage', type: 'stage', name: 'Royal Varmala Stage', x: 20, y: 18, seats: 6, assignedGuestNames: ['Immediate Family'] },
        { id: 'zone-table-1', type: 'table-round', name: 'Table 1 - Royal Elders', x: 25, y: 45, seats: 8, assignedGuestNames: ['Rajesh Mehra', 'Sunita Mehra', 'Dr. Ramesh Chandra'] },
        { id: 'zone-table-2', type: 'table-round', name: 'Table 2 - VIP Dignitaries', x: 50, y: 45, seats: 8, assignedGuestNames: ['Vikramaditya Singhania', 'Radhika Singhania'] },
        { id: 'zone-table-3', type: 'table-round', name: 'Table 3 - Lakeside Friends', x: 75, y: 45, seats: 8, assignedGuestNames: ['Kunal Kapoor', 'College Roommates'] },
        { id: 'zone-dance', type: 'dancefloor', name: 'Sangeet Dance Arena', x: 50, y: 70, seats: 0 },
        { id: 'zone-bar', type: 'bar', name: 'Royal Sherbet & Mocktail Bar', x: 85, y: 75, seats: 0 },
        { id: 'zone-foyer', type: 'entrance', name: 'Grand Toran Arrival Foyer', x: 50, y: 92, seats: 0 },
        { id: 'zone-photo', type: 'photobooth', name: 'Jharokha Photo Vignette', x: 15, y: 75, seats: 0 }
      ]
    },

    invitation: {
      style: 'Royal Formal',
      headline: 'Shree Ganeshay Namah',
      hostLine: 'With the blessings of our ancestors, the Singhania & Mehra families invite you to celebrate',
      eventDetails: 'The Wedding Ceremony of Aarav & Meera\nFriday, December 18, 2026 at 4:30 PM\nFateh Garh Palace Courtyard, Udaipur',
      poeticQuote: 'Two lives, two hearts, joined together in friendship, united forever in love.',
      rsvpContact: 'Kindly RSVP by Nov 25: +91 98201 11223 (Rajesh Mehra)',
      dressCodeNote: 'Royal Indian Festive Attire • Traditional Safas provided upon arrival',
      colorTheme: {
        bg: '#FAF8F5',
        text: '#1C1917',
        accent: '#7C5EB6',
        border: '#D4AF37'
      },
      fontStyle: 'serif'
    },

    emergencyRisks: [
      {
        id: 'risk-1',
        risk: 'Lakeside Wind Gusts impacting outdoor mandap drapery & candles',
        category: 'Weather',
        probability: 'Medium',
        impact: 'Moderate',
        contingencyPlanB: 'Reinforce mandap pillars with concealed 50kg steel ballasts; utilize glass chimney hurricanes around all open flame diyas; reserve indoor palace darbar hall as immediate 30-min switchover.',
        triggerCondition: 'Wind speeds exceeding 25 km/h on afternoon forecast',
        emergencyContactName: 'Vikram Singh (Venue GM)',
        emergencyPhone: '+91 98290 12345',
        status: 'Mitigated'
      },
      {
        id: 'risk-2',
        risk: 'Outstation guest flight delay from Delhi due to winter morning fog',
        category: 'Logistics',
        probability: 'High',
        impact: 'Minor',
        contingencyPlanB: 'Arrange rolling fleet shuttles on stand-by throughout afternoon; buffer sunset high tea by 45 minutes without compromising evening muhurat.',
        triggerCondition: 'Flight status delayed by >90 mins',
        emergencyContactName: 'Udaipur Travel Shuttles Lead',
        emergencyPhone: '+91 94140 88990',
        status: 'Monitoring'
      },
      {
        id: 'risk-3',
        risk: 'Power Grid fluctuation during heavy evening audio & ambient lights',
        category: 'Technical',
        probability: 'Low',
        impact: 'Critical',
        contingencyPlanB: 'Dual 125 kVA silent diesel generators connected on auto-sync load sharing (zero blackout switchover).',
        triggerCondition: 'Voltage drop below 210V on main grid line',
        emergencyContactName: 'Chief Generator Tech (Ramesh)',
        emergencyPhone: '+91 97830 55667',
        status: 'Mitigated'
      },
      {
        id: 'risk-4',
        risk: 'Unexpected surge of +25 unconfirmed local guests',
        category: 'Catering',
        probability: 'Medium',
        impact: 'Moderate',
        contingencyPlanB: 'Contractual 15% catering ingredient buffer already locked with Mewar Catering; secondary live dal bati counter ready on 20-min notice.',
        triggerCondition: 'Arrival headcount crosses 205 pax',
        emergencyContactName: 'Chef Devendra Chouhan',
        emergencyPhone: '+91 94141 54321',
        status: 'Mitigated'
      }
    ],

    teamMembers: [
      { id: 'tm-1', name: 'Aarav Singhania', email: 'aarav@sample.com', role: 'Lead Host', avatarColor: '#7C5EB6' },
      { id: 'tm-2', name: 'Meera Rajput', email: 'meera@sample.com', role: 'Co-Host', avatarColor: '#F97352' },
      { id: 'tm-3', name: 'Rohan Deshmukh', email: 'rohan.d@sample.com', role: 'Budget Manager', avatarColor: '#3B82F6' },
      { id: 'tm-4', name: 'Ananya Sharma', email: 'ananya.s@sample.com', role: 'Day-of Coordinator', avatarColor: '#10B981' }
    ],

    teamComments: [
      { id: 'cm-1', authorName: 'Meera Rajput', authorRole: 'Co-Host', text: 'Confirmed the brass urli placement with Aanya. We are using organic scented mogra flowers.', timestamp: 'Yesterday at 4:15 PM' },
      { id: 'cm-2', authorName: 'Rohan Deshmukh', authorRole: 'Budget Manager', text: 'Disbursed ₹60,000 photography advance. All contracts logged in Budget Planner.', timestamp: 'Today at 10:30 AM' },
      { id: 'cm-3', authorName: 'Ananya Sharma', authorRole: 'Day-of Coordinator', text: 'Checked sound curfew with Udaipur police commissioner office. Outdoor amplified music strictly till 10 PM, then we move indoors.', timestamp: 'Today at 1:45 PM' }
    ],

    ecoAudit: {
      sustainabilityScore: 82,
      carbonOffsetKg: 340,
      wasteDivertedKg: 520,
      pillars: [
        { id: 'eco-1', title: 'Invitations & Stationery', currentChoice: 'Physical plastic-laminated glossy boxes', ecoAlternative: 'Plantable seed-paper stationery + WhatsApp interactive video', impactSaving: 'Saves 45 kg paper & 100% plastic waste', adopted: true },
        { id: 'eco-2', title: 'Floral Sourcing', currentChoice: 'Exotic air-freighted Dutch hydrangeas', ecoAlternative: 'Locally grown Udaipur marigolds, tuberose & potted palms', impactSaving: 'Reduces floral carbon footprint by 85%', adopted: true },
        { id: 'eco-3', title: 'Cutlery & Dining', currentChoice: 'Single-use plastic bottles & foam cups', ecoAlternative: 'Heritage brass goblets, copper water dispensers & terracotta cups', impactSaving: 'Eliminates 1,200 single-use plastic bottles', adopted: true },
        { id: 'eco-4', title: 'Surplus Food Recovery', currentChoice: 'Standard hotel buffet discard', ecoAlternative: 'Partnered with Robin Hood Army Udaipur for hygienic food recovery', impactSaving: 'Feeds 150+ people with zero food wastage', adopted: true },
        { id: 'eco-5', title: 'Lighting Energy', currentChoice: 'Halogen floodlights', ecoAlternative: 'Low-voltage 2400K LED filament bulbs & solar rechargeable batteries', impactSaving: 'Cuts electricity consumption by 65%', adopted: true }
      ]
    }
  },
  {
    id: 'evt-birthday-02',
    name: "Rohan's 30th Celestial Rooftop Soirée",
    eventType: 'Birthday',
    date: '2026-11-28',
    location: 'Bandra, Mumbai',
    guestCount: 50,
    budget: 150000,
    duration: 'Evening (6 Hours)',
    themePreference: 'Midnight Celestial & Glow Disco',
    venuePreference: 'Outdoor',
    foodPreference: 'Both',
    specialRequirements: 'Artisanal cocktail bar, acoustic indie-rock set followed by electronic DJ, retro photo booth',
    priorities: ['Signature Cocktail Experience', 'Vibrant Music & DJ Energy', 'Stunning Skyline Photography'],
    createdAt: '2026-10-25T14:30:00Z',
    aiPlan: {
      planningMode: 'Balanced',
      overview: {
        concept: "An intimate yet electric 30th milestone celebration under Mumbai's starry skyline, pairing curated mixology, neon celestial aesthetics, and heartfelt friendship tributes.",
        tagline: "Roaring into the Thirties Under Starlight",
        vibe: "Electric, Chic, Intimate, Memorable",
        keyHighlights: [
          "Panoramic Arabian Sea rooftop vista with neon glow",
          "Custom cocktail menu featuring 4 signature drinks named after life milestones",
          "Vintage audio guestbook phone for friends' unfiltered birthday roasts and wishes",
          "Surprise midnight cake cutting with cold indoor sparkler fountains"
        ]
      },
      theme: {
        name: "Midnight Celestial & Neon Glow",
        description: "Dark moody twilight tones complemented by warm brass accents, fiber optic starry canopies, and vibrant neon lighting.",
        colorPalette: [
          { name: "Midnight Navy", hex: "#111827", usage: "Rooftop deck backdrops and bar facade" },
          { name: "Warm Lavender", hex: "#7C5EB6", usage: "Ambient glow lighting and cocktail signage" },
          { name: "Sunset Peach", hex: "#F97352", usage: "Neon sign glow and floral accents" },
          { name: "Champagne Gold", hex: "#EAB308", usage: "Cutlery, coasters, and custom swizzle sticks" }
        ],
        decorConcepts: [
          { zone: "Rooftop Arrival Tunnel", description: "Fairy light tunnel with polaroids of Rohan from ages 1 to 30 pegged with glowing wooden clips." },
          { zone: "Skyline Cocktail Bar", description: "Illuminated acrylic bar counter with smoky dry-ice cocktail glasses and bespoke menu easel." },
          { zone: "Lounge Seating", description: "Plush velvet poufs, low coffee tables with geometric brass candle holders, and warm throws for the sea breeze." },
          { zone: "Photo Corner", description: "Neon sign reading 'Thirty & Thriving' set against a dark starry wall with mirror props." }
        ],
        lighting: "Dimmed ambient fairy lights, warm uplights on rooftop foliage, and deep violet/lavender cocktail bar accent glow."
      },
      venue: {
        typeRecommendation: "Private Boutique Rooftop Lounge or Terrace Penthouse",
        idealCapacity: "50-70 guests standing and lounging",
        searchKeywords: ["Rooftop event space Bandra Mumbai", "Private terrace party venue Mumbai", "Boutique rooftop lounge Mumbai"],
        keyConsiderations: [
          "Music curfew guidelines for rooftop terrace in residential areas (switch to silent disco or indoor lounge post 10 PM)",
          "Covered awning backup in case of unexpected coastal moisture",
          "Dedicated bar refrigeration and ice storage"
        ]
      },
      catering: {
        style: "Pass-around tapas and live slider counters with curated cocktail pairings",
        welcomeDrinks: ["Smoked Rosemary Old Fashioned", "Passionfruit Jalapeno Sparkler"],
        appetizers: ["Mini Truffle Brioche Sliders", "Crispy Calamari / Lotus Stem with Togarashi", "Wild Mushroom & Goat Cheese Crostini", "Chicken Yakitori Skewers with Scallions"],
        mains: ["Woodfired Neapolitan Sourdough Pizzas", "Bowl Meal: Thai Green Curry with Jasmine Rice", "Slow-Braised Pulled Jackfruit / Pork Tacos"],
        desserts: ["Salted Caramel Dark Chocolate Tartlets", "Custom 30th Birthday Whiskey-Infused Espresso Cake", "Churros with Warm Belgian Chocolate Dip"],
        specialNotes: ["Nut-free and vegetarian options clearly flagged on tapas boards"]
      },
      entertainment: {
        musicStyle: "Sunset acoustic indie pop & classic rock, followed by progressive house & 90s/00s throwbacks",
        activities: [
          { title: "Roast & Toast Open Mic", description: "3 selected close friends share funny 2-minute memory stories with childhood photos on screen." },
          { title: "Celebration Trivia Kahoot", description: "A rapid 10-question mobile trivia game about Rohan's funniest quirks with a luxury tequila bottle prize." }
        ],
        ceremonialMoments: ["Champagne Tower Pour at 9:00 PM", "Midnight Cake Celebration with Cold Sparklers"]
      },
      guestExperience: {
        welcomeFavor: "Custom engraved acrylic shot glass with guest's first name",
        interactiveTouchpoints: ["Audio guestbook telephone station", "Instant digital GIF photo booth that texts snaps directly to phones"],
        returnGiftIdea: "Gourmet dark chocolate bean-to-bar collection + personalized drip coffee bags"
      },
      costBreakdown: [
        { category: "Venue", allocatedPercentage: 30, estimatedAmount: 45000, notes: "Terrace rental with bar infrastructure & sound permits" },
        { category: "Catering", allocatedPercentage: 35, estimatedAmount: 52500, notes: "Gourmet pass-around tapas, sliders & dessert bar" },
        { category: "Decoration", allocatedPercentage: 12, estimatedAmount: 18000, notes: "Neon signage, fairy light tunnel, velvet lounge setups" },
        { category: "Photography", allocatedPercentage: 8, estimatedAmount: 12000, notes: "4-hour party candid photographer + video reel editor" },
        { category: "Entertainment", allocatedPercentage: 7, estimatedAmount: 10500, notes: "DJ controller, speaker truss & sound engineer" },
        { category: "Invitations", allocatedPercentage: 2, estimatedAmount: 3000, notes: "Bespoke digital video invite & RSVP webpage" },
        { category: "Transportation", allocatedPercentage: 2, estimatedAmount: 3000, notes: "Reserved guest valet & driver arrangement" },
        { category: "Miscellaneous", allocatedPercentage: 4, estimatedAmount: 6000, notes: "Contingency reserve & ice/bar logistics" }
      ],
      eventDaySchedule: [
        { id: 'b-sch-1', time: "05:00 PM", activity: "Bar setup, mixology prep & audio soundcheck", responsible: "Lead Bartender & Tech", status: "Completed", delayMinutes: 0 },
        { id: 'b-sch-2', time: "07:00 PM", activity: "Guest arrival, sunset welcome drinks & indie acoustic beats", responsible: "Host & Emcee", status: "Current", delayMinutes: 0 },
        { id: 'b-sch-3', time: "08:30 PM", activity: "Hot tapas pass-around & Kahoot Trivia session", responsible: "Catering Lead & Emcee", status: "Upcoming", delayMinutes: 0 },
        { id: 'b-sch-4', time: "09:45 PM", activity: "Champagne toast & friends' roast & toast speeches", responsible: "Close Friends", status: "Upcoming", delayMinutes: 0 },
        { id: 'b-sch-5', time: "10:30 PM", activity: "Dance floor ignition with DJ throwbacks", responsible: "DJ", status: "Upcoming", delayMinutes: 0 },
        { id: 'b-sch-6', time: "12:00 AM", activity: "Midnight cake celebration & dessert flight", responsible: "Hosts & Team", status: "Upcoming", delayMinutes: 0 }
      ],
      preparationTimeline: [
        { phase: "3 Weeks Prior", task: "Confirm rooftop contract and verify music permit regulations", priority: "High" },
        { phase: "2 Weeks Prior", task: "Dispatch digital invites & collect guest cocktail preferences", priority: "Medium" },
        { phase: "10 Days Prior", task: "Order custom neon quote sign and personalized shot glasses", priority: "Medium" },
        { phase: "5 Days Prior", task: "Lock custom espresso birthday cake design & tasting", priority: "High" },
        { phase: "1 Day Prior", task: "Final playlist curation and mixology ingredient inventory", priority: "High" },
        { phase: "Event Day", task: "Arrive at 4:30 PM for sound check and enjoy an iconic night!", priority: "High" }
      ]
    },
    expenses: [
      { id: 'b-exp-1', category: 'Venue', title: 'Skyline Terrace Rental (6 PM - 1 AM)', estimatedCost: 45000, actualCost: 45000, paidAmount: 45000, status: 'Paid', date: '2026-10-26' },
      { id: 'b-exp-2', category: 'Catering', title: 'Gourmet Tapas, Sliders & Mixology Bar', estimatedCost: 52500, actualCost: 55000, paidAmount: 30000, status: 'Partial', date: '2026-10-27' },
      { id: 'b-exp-3', category: 'Decoration', title: 'Neon Sign, Starry Fairy Tunnel & Low Lounge', estimatedCost: 18000, actualCost: 17000, paidAmount: 17000, status: 'Paid', date: '2026-10-28' },
      { id: 'b-exp-4', category: 'Photography', title: 'Candid Party & Reel Creator', estimatedCost: 12000, actualCost: 12000, paidAmount: 6000, status: 'Partial', date: '2026-10-29' },
      { id: 'b-exp-5', category: 'Entertainment', title: 'DJ Console, Sound & Acoustic Artist', estimatedCost: 10500, actualCost: 10500, paidAmount: 5000, status: 'Partial', date: '2026-10-30' },
      { id: 'b-exp-6', category: 'Miscellaneous', title: 'Custom Espresso Cake & Sparklers', estimatedCost: 6000, actualCost: 6500, paidAmount: 6500, status: 'Paid', date: '2026-10-31' }
    ],
    tasks: [
      { id: 'b-tsk-1', name: 'Order custom Thirty & Thriving neon sign', description: 'Warm white neon mounted on clear acrylic backing with dimmer switch.', priority: 'High', deadline: '2026-11-10', status: 'Completed', phase: 'Decor', category: 'Decoration', assignedToName: 'Rohan' },
      { id: 'b-tsk-2', name: 'Finalize 4 signature cocktail recipes with bartender', description: 'Test smoked rosemary syrup and passionfruit puree balances.', priority: 'High', deadline: '2026-11-15', status: 'Pending', phase: 'Bar & Food', category: 'Catering', assignedToName: 'Kavya' },
      { id: 'b-tsk-3', name: 'Compile 30 photos for timeline memory tunnel', description: 'Print retro square polaroids showing memorable travel and friendship moments.', priority: 'Medium', deadline: '2026-11-18', status: 'Pending', phase: 'Experience', category: 'Guest Experience', assignedToName: 'Aditya' },
      { id: 'b-tsk-4', name: 'Build 10-question Kahoot quiz about Rohan', description: 'Add fun multi-choice questions with funny childhood video clips.', priority: 'Low', deadline: '2026-11-22', status: 'Pending', phase: 'Activities', category: 'Entertainment', assignedToName: 'Zoya' }
    ],
    vendors: [
      { id: 'b-vnd-1', category: 'Venue', name: 'Bandra Breeze Terrace Penthouse', contactPerson: 'Alisha Merchant', phone: '+91 98200 88990 (Sample)', email: 'alisha@bandrabreeze-sample.in', estimatedCost: 45000, advancePaid: 45000, status: 'Booked', rating: 4.9, notes: 'Panoramic rooftop with open sky and ocean view.', isDemo: true },
      { id: 'b-vnd-2', category: 'Catering', name: 'Urban Spoon Craft Catering & Bar', contactPerson: 'Nikhil Roy', phone: '+91 99880 77665 (Sample)', email: 'nikhil@urbanspoon-sample.in', estimatedCost: 55000, advancePaid: 30000, status: 'Booked', rating: 4.8, notes: 'Includes two professional flair mixologists and 8 pass-around tapas.', isDemo: true },
      { id: 'b-vnd-3', category: 'Entertainment', name: 'SoundWave Mumbai & DJ Aryan', contactPerson: 'Aryan Mehta', phone: '+91 97660 55443 (Sample)', email: 'aryan@soundwave-sample.in', estimatedCost: 10500, advancePaid: 5000, status: 'Booked', rating: 4.7, notes: 'JBL sound truss + Pioneer DJ console with wireless mics.', isDemo: true }
    ],
    guests: [
      { id: 'b-gst-1', name: 'Zoya Akhtar', email: 'zoya@sample.com', phone: '+91 98200 12345', status: 'Confirmed', mealPreference: 'Non-vegetarian', plusCount: 1, notes: 'Close college friend', group: 'College Friends' },
      { id: 'b-gst-2', name: 'Aditya Roy & Priya', email: 'aditya@sample.com', phone: '+91 98111 23456', status: 'Confirmed', mealPreference: 'Vegetarian', plusCount: 1, notes: 'Confirmed attending', group: 'College Friends' },
      { id: 'b-gst-3', name: 'Neil Sen (Vegan)', email: 'neil@sample.com', phone: '+91 99202 34567', status: 'Confirmed', mealPreference: 'Vegan', plusCount: 0, notes: 'Requires dairy-free options', group: 'VIP' },
      { id: 'b-gst-4', name: 'Kavya Madhvani', email: 'kavya@sample.com', phone: '+91 98333 45678', status: 'Pending', mealPreference: 'Non-vegetarian', plusCount: 1, notes: 'Awaiting confirmation', group: 'Work Colleagues' }
    ],

    moodboards: [
      {
        id: 'b-mb-1',
        title: 'Midnight Celestial & Starlight Glow',
        vibe: 'Moody Twilight Chic',
        colorPalette: [
          { name: 'Midnight Navy', hex: '#111827', usage: 'Rooftop drapery' },
          { name: 'Warm Lavender', hex: '#7C5EB6', usage: 'Neon cocktail glow' },
          { name: 'Sunset Peach', hex: '#F97352', usage: 'Floral accents' },
          { name: 'Champagne Gold', hex: '#EAB308', usage: 'Bar metal details' }
        ],
        decorStyle: 'Fiber-optic starry ceilings, acrylic bar with dry ice mist, and velvet beanbag lounges.',
        floralConcept: 'Dark purple calla lilies and bronze eucalyptus branches in smoked glass vases.',
        lightingVibe: 'Subtle perimeter fairy canopies with RGB cocktail bar uplighters.',
        outfitTheme: {
          host: 'Sharp midnight navy blazer with silk pocket square.',
          guests: 'Cocktail chic or retro starlight glam with metallic accents.',
          dressCode: 'Celestial Cocktail'
        },
        fabricTextures: ['Dark Crushed Velvet', 'Reflective Mylar', 'Brushed Brass Metal'],
        inspirationNotes: ['Have a dedicated polaroid guestbook station right by the neon photo wall.'],
        createdAt: '2026-10-26T10:00:00Z'
      }
    ],

    seatingLayout: {
      venueDimensions: '20m x 15m Rooftop Deck',
      totalSeatsPlaced: 45,
      zones: [
        { id: 'b-zone-dj', type: 'stage', name: 'DJ Console & Sound Truss', x: 20, y: 20, seats: 0 },
        { id: 'b-zone-bar', type: 'bar', name: 'Flair Mixology Bar', x: 80, y: 20, seats: 8 },
        { id: 'b-zone-lounge1', type: 'lounge', name: 'Skyline Velvet Lounge A', x: 30, y: 55, seats: 12 },
        { id: 'b-zone-lounge2', type: 'lounge', name: 'Ocean View Lounge B', x: 70, y: 55, seats: 12 },
        { id: 'b-zone-dance', type: 'dancefloor', name: 'Open Air Dance Deck', x: 50, y: 40, seats: 0 },
        { id: 'b-zone-photo', type: 'photobooth', name: 'Thirty & Thriving Neon Wall', x: 15, y: 80, seats: 0 },
        { id: 'b-zone-entrance', type: 'entrance', name: 'Memory Tunnel Arrival', x: 50, y: 92, seats: 0 }
      ]
    },

    invitation: {
      style: 'Modern Chic',
      headline: 'Rohan is Turning 30!',
      hostLine: 'Join us for drinks, music, and stories under the Mumbai night sky',
      eventDetails: 'Saturday, November 28, 2026 • 7:00 PM Onwards\nBandra Breeze Terrace Penthouse, Mumbai',
      poeticQuote: 'Thirty years of memories, one unforgettable night to celebrate them all.',
      rsvpContact: 'RSVP via WhatsApp: +91 98200 88990',
      dressCodeNote: 'Cocktail Chic • Dress to Dance',
      colorTheme: {
        bg: '#111827',
        text: '#FAF8F5',
        accent: '#7C5EB6',
        border: '#F97352'
      },
      fontStyle: 'sans'
    },

    emergencyRisks: [
      {
        id: 'b-risk-1',
        risk: 'Coastal breeze or sudden rain shower on open terrace',
        category: 'Weather',
        probability: 'Medium',
        impact: 'Moderate',
        contingencyPlanB: 'Retractable motorized waterproof awning on standby; indoor penthouse living room ready for immediate seating transition.',
        triggerCondition: 'Rain radar alert in Bandra area',
        emergencyContactName: 'Terrace Operations Manager',
        emergencyPhone: '+91 98200 88990',
        status: 'Mitigated'
      },
      {
        id: 'b-risk-2',
        risk: 'Residential noise curfew at 10:00 PM',
        category: 'Technical',
        probability: 'High',
        impact: 'Moderate',
        contingencyPlanB: 'Switch outdoor sound truss to 50 synchronized LED Silent Disco wireless headphones post 10 PM!',
        triggerCondition: 'Clock strikes 10:00 PM',
        emergencyContactName: 'DJ Aryan Mehta',
        emergencyPhone: '+91 97660 55443',
        status: 'Mitigated'
      }
    ],

    teamMembers: [
      { id: 'b-tm-1', name: 'Rohan Deshmukh', email: 'rohan@sample.com', role: 'Lead Host', avatarColor: '#7C5EB6' },
      { id: 'b-tm-2', name: 'Zoya Akhtar', email: 'zoya@sample.com', role: 'Co-Host', avatarColor: '#EC4899' },
      { id: 'b-tm-3', name: 'Aditya Roy', email: 'aditya@sample.com', role: 'Day-of Coordinator', avatarColor: '#3B82F6' }
    ],

    teamComments: [
      { id: 'b-cm-1', authorName: 'Zoya Akhtar', authorRole: 'Co-Host', text: 'Confirmed the 50 silent disco headsets are booked for the 10 PM rooftop curfew.', timestamp: 'Yesterday at 6:00 PM' },
      { id: 'b-cm-2', authorName: 'Rohan Deshmukh', authorRole: 'Lead Host', text: 'Tasted the smoked rosemary Old Fashioned cocktail. It is phenomenal!', timestamp: 'Today at 11:15 AM' }
    ],

    ecoAudit: {
      sustainabilityScore: 76,
      carbonOffsetKg: 120,
      wasteDivertedKg: 180,
      pillars: [
        { id: 'b-eco-1', title: 'Digital Only Invitations', currentChoice: 'Physical paper cards', ecoAlternative: 'WhatsApp interactive video card', impactSaving: '100% paperless', adopted: true },
        { id: 'b-eco-2', title: 'Reusable Glassware', currentChoice: 'Plastic party cups', ecoAlternative: 'Engraved glass highballs (guests take home as keepsake)', impactSaving: 'Eliminates 300 single-use plastic cups', adopted: true },
        { id: 'b-eco-3', title: 'Compostable Tapas Plates', currentChoice: 'Styrofoam plates', ecoAlternative: 'Areca palm leaf tapas platters', impactSaving: '100% biodegradable in 45 days', adopted: true }
      ]
    }
  }
];
