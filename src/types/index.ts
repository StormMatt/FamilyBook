// ── Core Data Model ──────────────────────────────────────────────

export type CommunicationLevel = 'beginning' | 'emerging' | 'expanding' | 'advanced';

export interface ChildProfile {
  id: string;
  name: string;
  age?: number;
  photoUri?: string;
  communicationLevel: CommunicationLevel;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  childId: string;
  name: string;
  role: string;        // mom, dad, teacher, sibling, friend, therapist
  contexts: string[];  // home, school, therapy
  photoUri?: string;
}

export interface Interest {
  id: string;
  childId: string;
  category: 'food' | 'activity' | 'media' | 'sensory' | 'place' | 'other';
  name: string;
  details?: string;    // e.g., "specifically Thomas the Tank Engine"
}

export interface Routine {
  id: string;
  childId: string;
  name: string;        // morning, school, after-school, dinner, bedtime
  dayType: 'weekday' | 'weekend' | 'both';
  startTime?: string;  // HH:MM
  endTime?: string;
  activities: string[];
}

export interface SensoryProfile {
  id: string;
  childId: string;
  sensitivities: string[];   // loud noises, bright lights, textures
  preferences: string[];      // deep pressure, music, spinning
  calmingStrategies: string[];
}

// ── Vocabulary & Boards ──────────────────────────────────────────

export type WordCategory = 'verb' | 'noun' | 'descriptor' | 'social' | 'person' | 'question' | 'urgent';

export type ColorCode = 'green' | 'orange' | 'blue' | 'pink' | 'yellow' | 'red' | 'purple';

export interface VocabWord {
  id: string;
  label: string;
  category: WordCategory;
  colorCode: ColorCode;
  imageUri?: string;    // custom photo or symbol
  isCore: boolean;      // part of core ~75 words
  audioUri?: string;    // pre-recorded audio
}

export type BoardType = 'core' | 'mealtime' | 'activity' | 'people' | 'feelings' | 'interests' | 'location' | 'routine' | 'custom';

export interface Board {
  id: string;
  childId: string;
  name: string;
  type: BoardType;
  words: VocabWord[];
  gridColumns: number;
  gridRows: number;
  contextTriggers?: {
    timeRange?: { start: string; end: string };
    routineName?: string;
  };
  createdAt: string;
}

// ── Timeline ─────────────────────────────────────────────────────

export interface TimelineSegment {
  id: string;
  childId: string;
  name: string;
  icon: string;          // emoji or icon name
  startTime: string;     // HH:MM
  endTime: string;
  dayType: 'weekday' | 'weekend' | 'both';
  boardId?: string;      // associated board
  color: string;
}

// ── Onboarding ───────────────────────────────────────────────────

export type OnboardingCategory = 'welcome' | 'eat' | 'do' | 'see' | 'hear' | 'feel' | 'photos' | 'review';

export interface OnboardingState {
  currentCategory: OnboardingCategory;
  completedCategories: OnboardingCategory[];
  extractedData: ExtractedOnboardingData;
}

export interface ExtractedOnboardingData {
  childName?: string;
  childAge?: number;
  communicationLevel?: CommunicationLevel;
  foods: { likes: string[]; dislikes: string[]; textures?: string[] };
  activities: { favorites: string[]; routines: string[] };
  people: Array<{ name: string; role: string; contexts: string[] }>;
  places: string[];
  interests: { media: string[]; sensory: string[]; topics: string[] };
  sensory: { sensitivities: string[]; preferences: string[]; calming: string[] };
  hardSituations: string[];
}

export const EMPTY_EXTRACTED_DATA: ExtractedOnboardingData = {
  foods: { likes: [], dislikes: [] },
  activities: { favorites: [], routines: [] },
  people: [],
  places: [],
  interests: { media: [], sensory: [], topics: [] },
  sensory: { sensitivities: [], preferences: [], calming: [] },
  hardSituations: [],
};

// ── Chat ─────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: OnboardingCategory;
}

// ── Progress ─────────────────────────────────────────────────────

export interface UsageLog {
  id: string;
  childId: string;
  wordId: string;
  boardId: string;
  timestamp: string;
  context?: string;
}
