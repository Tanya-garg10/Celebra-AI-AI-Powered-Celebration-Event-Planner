import { AIPlan, BudgetOptimizationSuggestion, GeneratedIdea } from '../types.ts';

export interface PlanGenerationRequest {
  eventType: string;
  name: string;
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  duration: string;
  themePreference: string;
  venuePreference: string;
  foodPreference: string;
  specialRequirements: string;
  priorities: string[];
}

export async function checkServerStatus(): Promise<{ featherlessAvailable: boolean; model: string }> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Failed to fetch status');
    return await res.json();
  } catch (err) {
    return { featherlessAvailable: false, model: 'demo-curated' };
  }
}

export async function generateEventPlanAPI(data: PlanGenerationRequest): Promise<{
  success: boolean;
  source: 'featherless' | 'curated_engine';
  isDemoFallback?: boolean;
  plan: AIPlan;
}> {
  const res = await fetch('/api/ai/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Plan generation failed with HTTP status ${res.status}`);
  }

  return await res.json();
}

export async function optimizeBudgetAPI(payload: {
  eventName: string;
  budget: number;
  estimatedCost: number;
  actualSpent: number;
  categories: any[];
}): Promise<{
  success: boolean;
  source: 'featherless' | 'curated_engine';
  isDemoFallback?: boolean;
  optimization: BudgetOptimizationSuggestion;
}> {
  const res = await fetch('/api/ai/optimize-budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Budget optimization failed with HTTP status ${res.status}`);
  }

  return await res.json();
}

export async function sendChatMessageAPI(payload: {
  message: string;
  eventContext: any;
  history?: any[];
}): Promise<{
  success: boolean;
  source: 'featherless' | 'curated_engine';
  isDemoFallback?: boolean;
  reply: string;
}> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Chat assistant failed with HTTP status ${res.status}`);
  }

  return await res.json();
}

export async function generateIdeasAPI(payload: {
  category: string;
  eventContext: any;
}): Promise<{
  success: boolean;
  source: 'featherless' | 'curated_engine';
  isDemoFallback?: boolean;
  ideas: GeneratedIdea[];
}> {
  const res = await fetch('/api/ai/ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Idea generation failed with HTTP status ${res.status}`);
  }

  return await res.json();
}
