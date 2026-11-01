export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Anniversary'
  | 'College Event'
  | 'Community Event'
  | 'Other';

export type VenuePreference = 'Indoor' | 'Outdoor' | 'Flexible';
export type FoodPreference = 'Vegetarian' | 'Non-vegetarian' | 'Both';
export type PlanningMode = 'Budget' | 'Balanced' | 'Premium';

export type BudgetCategory =
  | 'Venue'
  | 'Catering'
  | 'Decoration'
  | 'Photography'
  | 'Entertainment'
  | 'Invitations'
  | 'Transportation'
  | 'Miscellaneous';

export interface Expense {
  id: string;
  category: BudgetCategory;
  title: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: 'Paid' | 'Pending' | 'Partial';
  notes?: string;
  date?: string;
  receiptName?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  status: 'Pending' | 'Completed';
  phase?: string;
  category?: string;
  assignedToName?: string;
  dependencyTaskName?: string;
}

export interface VendorQuote {
  vendorName: string;
  quotedCost: number;
  inclusions: string;
  pros: string;
  isRecommended?: boolean;
}

export interface Vendor {
  id: string;
  category: BudgetCategory | 'Makeup' | 'Other';
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  estimatedCost: number;
  advancePaid: number;
  status: 'Shortlisted' | 'Contacted' | 'Booked' | 'Completed';
  rating: number;
  notes: string;
  isDemo?: boolean;
  quotations?: VendorQuote[];
  contractAttached?: boolean;
}

export type GuestGroup =
  | "Bride's Family"
  | "Groom's Family"
  | 'College Friends'
  | 'Work Colleagues'
  | 'VIP'
  | 'Neighbors'
  | 'Family & Relatives'
  | 'General';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Confirmed' | 'Pending' | 'Declined';
  mealPreference: 'Vegetarian' | 'Non-vegetarian' | 'Vegan' | 'Jain' | 'Kids';
  plusCount: number;
  notes?: string;
  group?: GuestGroup;
  tableAssigned?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface DecorConcept {
  zone: string;
  description: string;
}

export interface DayScheduleItem {
  id?: string;
  time: string;
  activity: string;
  responsible: string;
  status?: 'Completed' | 'Current' | 'Upcoming' | 'Delayed';
  delayMinutes?: number;
}

export interface TimelineMilestone {
  phase: string;
  task: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface CostBreakdownItem {
  category: BudgetCategory;
  allocatedPercentage: number;
  estimatedAmount: number;
  notes: string;
}

export interface AIPlan {
  planningMode?: PlanningMode;
  overview: {
    concept: string;
    tagline: string;
    vibe: string;
    keyHighlights: string[];
  };
  theme: {
    name: string;
    description: string;
    colorPalette: ColorSwatch[];
    decorConcepts: DecorConcept[];
    lighting: string;
  };
  venue: {
    typeRecommendation: string;
    idealCapacity: string;
    searchKeywords: string[];
    keyConsiderations: string[];
  };
  catering: {
    style: string;
    welcomeDrinks: string[];
    appetizers: string[];
    mains: string[];
    desserts: string[];
    specialNotes: string[];
  };
  entertainment: {
    musicStyle: string;
    activities: { title: string; description: string }[];
    ceremonialMoments: string[];
  };
  guestExperience: {
    welcomeFavor: string;
    interactiveTouchpoints: string[];
    returnGiftIdea: string;
  };
  costBreakdown: CostBreakdownItem[];
  eventDaySchedule: DayScheduleItem[];
  preparationTimeline: TimelineMilestone[];
}

// 1. AI Moodboard Generator
export interface EventMoodboard {
  id: string;
  title: string;
  vibe: string;
  colorPalette: ColorSwatch[];
  decorStyle: string;
  floralConcept: string;
  lightingVibe: string;
  outfitTheme: {
    host: string;
    guests: string;
    dressCode: string;
  };
  fabricTextures: string[];
  inspirationNotes: string[];
  createdAt: string;
}

// 2. What-If Simulator
export interface SimulationState {
  guestCount: number;
  budget: number;
  duration: string;
  planningMode: PlanningMode;
  venuePreference: VenuePreference;
  foodPreference: FoodPreference;
}

export interface SimulationResult {
  costPerGuestDelta: number;
  totalCostVariance: number;
  categoryDeltas: {
    category: BudgetCategory;
    original: number;
    simulated: number;
    diff: number;
  }[];
  logisticalImpact: string[];
  seatingRowsNeeded: number;
  staffRecommended: number;
  riskAlert: string;
}

// 3. Smart Budget Risk Predictor
export interface BudgetRiskCategory {
  category: BudgetCategory;
  allocated: number;
  spent: number;
  riskScore: number; // 0 - 100
  riskReason: string;
  costSavingAlt: string;
}

export interface BudgetRiskAssessment {
  overallRiskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Medium' | 'High';
  highRiskCategories: BudgetRiskCategory[];
  proactiveWarnings: string[];
  savingsTargetNeeded: number;
}

// 4. Smart Venue & Seating Planner
export interface SeatingZone {
  id: string;
  type:
    | 'stage'
    | 'mandap'
    | 'table-round'
    | 'table-long'
    | 'dancefloor'
    | 'bar'
    | 'entrance'
    | 'photobooth'
    | 'lounge';
  name: string;
  x: number; // grid percentage 0-100
  y: number; // grid percentage 0-100
  seats: number;
  assignedGuestNames?: string[];
  shape?: 'rect' | 'circle';
  rotation?: number;
}

export interface SeatingLayout {
  venueDimensions: string;
  totalSeatsPlaced: number;
  zones: SeatingZone[];
}

// 5. AI Invitation Studio
export type InvitationStyle = 'Royal Formal' | 'Modern Chic' | 'Traditional Cultural' | 'Fun & Playful';

export interface InvitationDesign {
  style: InvitationStyle;
  headline: string;
  hostLine: string;
  eventDetails: string;
  poeticQuote: string;
  rsvpContact: string;
  dressCodeNote: string;
  colorTheme: {
    bg: string;
    text: string;
    accent: string;
    border: string;
  };
  fontStyle: 'serif' | 'sans';
}

// 6. Emergency & Backup Planner
export interface RiskItem {
  id: string;
  risk: string;
  category: 'Weather' | 'Vendor' | 'Logistics' | 'Technical' | 'Catering';
  probability: 'High' | 'Medium' | 'Low';
  impact: 'Critical' | 'Moderate' | 'Minor';
  contingencyPlanB: string;
  triggerCondition: string;
  emergencyContactName: string;
  emergencyPhone: string;
  status: 'Mitigated' | 'Monitoring';
}

// 7. Collaborative Event Planning
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Lead Host' | 'Co-Host' | 'Budget Manager' | 'Day-of Coordinator' | 'Vendor Lead';
  avatarColor: string;
}

export interface TeamComment {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  timestamp: string;
}

// 8. Eco-Friendly Event Planner
export interface EcoPillar {
  id: string;
  title: string;
  currentChoice: string;
  ecoAlternative: string;
  impactSaving: string;
  adopted: boolean;
}

export interface EcoAudit {
  sustainabilityScore: number; // 0 - 100
  score?: number;
  pillars: EcoPillar[];
  carbonOffsetKg: number;
  wasteDivertedKg: number;
}

export interface CelebrationEvent {
  id: string;
  name: string;
  eventType: EventType;
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  duration: string;
  themePreference: string;
  venuePreference: VenuePreference;
  foodPreference: FoodPreference;
  specialRequirements: string;
  priorities: string[];
  createdAt: string;
  aiPlan: AIPlan | null;
  expenses: Expense[];
  tasks: Task[];
  vendors: Vendor[];
  guests: Guest[];
  customNotes?: string;

  // Advanced features state
  moodboards?: EventMoodboard[];
  seatingLayout?: SeatingLayout;
  invitation?: InvitationDesign;
  emergencyRisks?: RiskItem[];
  risks?: RiskItem[];
  daySchedule?: DayScheduleItem[];
  teamMembers?: TeamMember[];
  teamComments?: TeamComment[];
  ecoAudit?: EcoAudit;
}

export interface BudgetOptimizationSuggestion {
  summary: string;
  targetSavings: number;
  recommendations: {
    category: string;
    action: string;
    potentialSaving: number;
    impactOnExperience: string;
  }[];
  smartSwaps: string[];
  contingencyAdvice: string;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  budgetRating: 'Low' | 'Medium' | 'Luxury';
  whyItWorks: string;
  implementationTip: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isAiSource?: boolean;
  isError?: boolean;
}
