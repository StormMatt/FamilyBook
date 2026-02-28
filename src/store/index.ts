import { create } from 'zustand';
import type {
  ChildProfile,
  Board,
  TimelineSegment,
  ChatMessage,
  OnboardingCategory,
  ExtractedOnboardingData,
} from '../types';
import { EMPTY_EXTRACTED_DATA } from '../types';
import * as db from '../lib/db';
import { generateBoards, generateTimeline } from '../lib/board-gen';
import { CORE_STRIP } from '../constants/vocabulary';

const CATEGORY_ORDER: OnboardingCategory[] = [
  'welcome', 'eat', 'do', 'see', 'hear', 'feel', 'photos', 'review'
];

interface AppState {
  // Child
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;

  // Boards
  boards: Board[];
  activeBoard: Board | null;
  setActiveBoard: (board: Board | null) => void;
  loadBoards: () => Promise<void>;

  // Timeline
  timeline: TimelineSegment[];
  loadTimeline: () => Promise<void>;

  // Onboarding
  onboardingComplete: boolean;
  currentCategory: OnboardingCategory;
  completedCategories: OnboardingCategory[];
  extractedData: ExtractedOnboardingData;
  chatMessages: ChatMessage[];
  setOnboardingComplete: (complete: boolean) => void;
  setCurrentCategory: (category: OnboardingCategory) => void;
  completeCategory: (category: OnboardingCategory) => void;
  updateExtractedData: (data: ExtractedOnboardingData) => void;
  addChatMessage: (msg: ChatMessage) => void;
  getNextCategory: () => OnboardingCategory | null;

  // Board generation
  generateAndSaveBoards: () => Promise<void>;

  // Init
  initialize: () => Promise<void>;

  // API Key
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ── Child ────────────────────────────────────────────────────────
  childProfile: null,
  setChildProfile: (profile) => {
    set({ childProfile: profile });
    db.saveChildProfile(profile);
  },

  // ── Boards ───────────────────────────────────────────────────────
  boards: [],
  activeBoard: null,
  setActiveBoard: (board) => set({ activeBoard: board }),

  loadBoards: async () => {
    const { childProfile } = get();
    if (!childProfile) return;
    const boards = await db.getBoardsForChild(childProfile.id);
    set({ boards, activeBoard: boards[0] ?? null });
  },

  // ── Timeline ─────────────────────────────────────────────────────
  timeline: [],
  loadTimeline: async () => {
    const { childProfile } = get();
    if (!childProfile) return;
    const timeline = await db.getTimelineSegments(childProfile.id);
    set({ timeline });
  },

  // ── Onboarding ───────────────────────────────────────────────────
  onboardingComplete: false,
  currentCategory: 'welcome',
  completedCategories: [],
  extractedData: EMPTY_EXTRACTED_DATA,
  chatMessages: [],

  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
  setCurrentCategory: (category) => set({ currentCategory: category }),

  completeCategory: (category) => {
    const { completedCategories } = get();
    if (!completedCategories.includes(category)) {
      set({ completedCategories: [...completedCategories, category] });
    }
  },

  updateExtractedData: (data) => set({ extractedData: data }),

  addChatMessage: (msg) => {
    set({ chatMessages: [...get().chatMessages, msg] });
    db.saveChatMessage(msg);
  },

  getNextCategory: () => {
    const { completedCategories, currentCategory } = get();
    const currentIdx = CATEGORY_ORDER.indexOf(currentCategory);
    for (let i = currentIdx + 1; i < CATEGORY_ORDER.length; i++) {
      if (!completedCategories.includes(CATEGORY_ORDER[i])) {
        return CATEGORY_ORDER[i];
      }
    }
    return null;
  },

  // ── Board Generation ─────────────────────────────────────────────
  generateAndSaveBoards: async () => {
    const { extractedData, childProfile } = get();
    if (!childProfile) return;

    const boards = generateBoards(childProfile.id, extractedData);
    const timeline = generateTimeline(childProfile.id, extractedData, boards);

    // Save to DB
    for (const board of boards) {
      await db.saveBoard(board);
    }
    await db.saveTimelineSegments(timeline);

    set({
      boards,
      activeBoard: boards[0] ?? null,
      timeline,
      onboardingComplete: true,
    });
  },

  // ── Init ─────────────────────────────────────────────────────────
  initialize: async () => {
    const profile = await db.getChildProfile();
    if (profile) {
      set({ childProfile: profile, onboardingComplete: true });
      const boards = await db.getBoardsForChild(profile.id);
      const timeline = await db.getTimelineSegments(profile.id);
      set({
        boards,
        activeBoard: boards[0] ?? null,
        timeline,
      });
    }
    const messages = await db.getChatMessages();
    if (messages.length > 0) {
      set({ chatMessages: messages });
    }
  },

  // ── API Key ──────────────────────────────────────────────────────
  apiKey: null,
  setApiKey: (key) => set({ apiKey: key }),
}));
