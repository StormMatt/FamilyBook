import type { OnboardingCategory, ExtractedOnboardingData } from '../../types';

const CATEGORY_PROMPTS: Record<OnboardingCategory, string> = {
  welcome: `You're starting the onboarding. Warmly greet the parent and ask for their child's name and age. Ask how their child currently communicates (gestures, some words, picture cards, etc.) to gauge communication level. Keep it conversational, not clinical. One question at a time.`,

  eat: `Ask about food and mealtimes. What does their child love to eat? What do they refuse? Any texture preferences? What does a typical mealtime look like? React naturally to their answers ("Oh, chicken nuggets are a classic!"). Extract: favorite foods, disliked foods, texture preferences, mealtime routines.`,

  do: `Ask about daily activities and routines. What does a typical day look like? What activities does their child love? What happens at school? What do weekends look like? What are the hard parts of the day (transitions, etc.)? Extract: daily routines, favorite activities, school activities, weekend activities.`,

  see: `Ask about the important people and places in their child's life. Who does the child see every day? Who are special people (grandparents, therapists, friends)? What are the regular places they go? Extract: people (with roles and contexts), important places.`,

  hear: `Ask about interests, media, and things that excite the child. What shows, movies, or characters do they love? What music do they like? What makes them light up? Any special interests or obsessions? Extract: media interests, music preferences, special topics, excitement triggers.`,

  feel: `Ask about emotions, sensory needs, and hard moments. What are the hard situations? What bothers them sensorily (loud noises, textures, lights)? What calms them down? How do they show different emotions? Extract: sensory sensitivities, calming strategies, hard situations, emotional expression patterns.`,

  photos: `Let the parent know they can add photos later. For now, mention that adding real photos of their child's people, places, and things will make the boards much more meaningful. Ask if they'd like to add any now or move on to see their child's boards.`,

  review: `Summarize what you've learned about their child in 3-4 warm sentences. Express what a wonderful picture they've painted. Let them know their child's personalized boards are ready. Ask if there's anything they'd like to add or change before they start.`,
};

export function buildSystemPrompt(
  category: OnboardingCategory,
  extractedSoFar: ExtractedOnboardingData,
  completedCategories: OnboardingCategory[]
): string {
  const contextSummary = buildContextSummary(extractedSoFar);

  return `You are FamilyBook's onboarding assistant. You're having a warm, natural conversation with a parent to learn about their child so you can create personalized AAC (communication) boards.

## Your personality
- Warm, knowledgeable, and encouraging
- You celebrate what the child CAN do
- No clinical jargon — talk like a supportive friend who happens to know about AAC
- React naturally to what the parent shares (show interest, relate, encourage)
- One question at a time — never overwhelm
- Keep responses concise (2-4 sentences)

## Current phase: ${category.toUpperCase()}
${CATEGORY_PROMPTS[category]}

## What you already know
${contextSummary || 'Nothing yet — this is the start of the conversation.'}

## Completed sections
${completedCategories.length > 0 ? completedCategories.join(', ') : 'None yet'}

## Important rules
- NEVER mention AAC terminology, communication levels, or clinical terms to the parent
- NEVER say "I'm extracting data" or reference the underlying system
- If the parent shares something difficult, be empathetic first, then gently continue
- If you have enough info for this category (3+ relevant details), naturally transition by saying something like "This is really helpful! I'd love to hear about [next topic]..."
- Always end your message with a question or prompt to keep the conversation flowing
- When you have enough information for the current category, include the marker [CATEGORY_COMPLETE] at the very end of your message (after your visible text). The parent won't see this marker.

## Entity extraction
After each response, include a JSON block with any new information extracted. Format:
[EXTRACTED]
{"field": "value", ...}
[/EXTRACTED]

Valid fields for extraction:
- childName: string
- childAge: number
- communicationLevel: "beginning" | "emerging" | "expanding" | "advanced"
- foodLikes: string[] (append to existing)
- foodDislikes: string[]
- activities: string[]
- routines: string[]
- people: [{name, role, contexts}]
- places: string[]
- mediaInterests: string[]
- sensoryInterests: string[]
- topics: string[]
- sensitivities: string[]
- calmingStrategies: string[]
- hardSituations: string[]`;
}

function buildContextSummary(data: ExtractedOnboardingData): string {
  const parts: string[] = [];

  if (data.childName) parts.push(`Child's name: ${data.childName}`);
  if (data.childAge) parts.push(`Age: ${data.childAge}`);
  if (data.communicationLevel) parts.push(`Communication level: ${data.communicationLevel}`);
  if (data.foods.likes.length) parts.push(`Favorite foods: ${data.foods.likes.join(', ')}`);
  if (data.foods.dislikes.length) parts.push(`Dislikes: ${data.foods.dislikes.join(', ')}`);
  if (data.activities.favorites.length) parts.push(`Favorite activities: ${data.activities.favorites.join(', ')}`);
  if (data.activities.routines.length) parts.push(`Routines: ${data.activities.routines.join(', ')}`);
  if (data.people.length) parts.push(`People: ${data.people.map(p => `${p.name} (${p.role})`).join(', ')}`);
  if (data.places.length) parts.push(`Places: ${data.places.join(', ')}`);
  if (data.interests.media.length) parts.push(`Media interests: ${data.interests.media.join(', ')}`);
  if (data.interests.topics.length) parts.push(`Special interests: ${data.interests.topics.join(', ')}`);
  if (data.sensory.sensitivities.length) parts.push(`Sensory sensitivities: ${data.sensory.sensitivities.join(', ')}`);
  if (data.sensory.calming.length) parts.push(`Calming strategies: ${data.sensory.calming.join(', ')}`);
  if (data.hardSituations.length) parts.push(`Hard situations: ${data.hardSituations.join(', ')}`);

  return parts.join('\n');
}

export function parseAIResponse(raw: string): {
  visibleText: string;
  extracted: Record<string, any> | null;
  categoryComplete: boolean;
} {
  const categoryComplete = raw.includes('[CATEGORY_COMPLETE]');
  let visibleText = raw.replace('[CATEGORY_COMPLETE]', '').trim();

  let extracted: Record<string, any> | null = null;
  const extractMatch = visibleText.match(/\[EXTRACTED\]\s*([\s\S]*?)\s*\[\/EXTRACTED\]/);
  if (extractMatch) {
    try {
      extracted = JSON.parse(extractMatch[1]);
    } catch {
      // ignore parse errors
    }
    visibleText = visibleText.replace(/\[EXTRACTED\][\s\S]*?\[\/EXTRACTED\]/, '').trim();
  }

  return { visibleText, extracted, categoryComplete };
}

export function mergeExtractedData(
  existing: ExtractedOnboardingData,
  extracted: Record<string, any>
): ExtractedOnboardingData {
  const merged = { ...existing };

  if (extracted.childName) merged.childName = extracted.childName;
  if (extracted.childAge) merged.childAge = extracted.childAge;
  if (extracted.communicationLevel) merged.communicationLevel = extracted.communicationLevel;

  if (extracted.foodLikes) merged.foods = { ...merged.foods, likes: [...merged.foods.likes, ...extracted.foodLikes] };
  if (extracted.foodDislikes) merged.foods = { ...merged.foods, dislikes: [...merged.foods.dislikes, ...extracted.foodDislikes] };

  if (extracted.activities) merged.activities = { ...merged.activities, favorites: [...merged.activities.favorites, ...extracted.activities] };
  if (extracted.routines) merged.activities = { ...merged.activities, routines: [...merged.activities.routines, ...extracted.routines] };

  if (extracted.people) merged.people = [...merged.people, ...extracted.people];
  if (extracted.places) merged.places = [...merged.places, ...extracted.places];

  if (extracted.mediaInterests) merged.interests = { ...merged.interests, media: [...merged.interests.media, ...extracted.mediaInterests] };
  if (extracted.sensoryInterests) merged.interests = { ...merged.interests, sensory: [...merged.interests.sensory, ...extracted.sensoryInterests] };
  if (extracted.topics) merged.interests = { ...merged.interests, topics: [...merged.interests.topics, ...extracted.topics] };

  if (extracted.sensitivities) merged.sensory = { ...merged.sensory, sensitivities: [...merged.sensory.sensitivities, ...extracted.sensitivities] };
  if (extracted.calmingStrategies) merged.sensory = { ...merged.sensory, calming: [...merged.sensory.calming, ...extracted.calmingStrategies] };
  if (extracted.hardSituations) merged.hardSituations = [...merged.hardSituations, ...extracted.hardSituations];

  return merged;
}
