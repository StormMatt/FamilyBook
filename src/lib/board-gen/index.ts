import type {
  ExtractedOnboardingData,
  Board,
  VocabWord,
  WordCategory,
  ColorCode,
  CommunicationLevel,
  TimelineSegment,
} from '../../types';
import { CATEGORY_COLORS, GRID_SIZE, CORE_VOCABULARY } from '../../constants/vocabulary';

let wordIdCounter = 1000;

function makeWord(label: string, category: WordCategory, imageUri?: string): VocabWord {
  return {
    id: `gen-${wordIdCounter++}`,
    label,
    category,
    colorCode: CATEGORY_COLORS[category],
    isCore: false,
    imageUri,
  };
}

function makeBoard(
  childId: string,
  name: string,
  type: Board['type'],
  words: VocabWord[],
  level: CommunicationLevel,
  contextTriggers?: Board['contextTriggers']
): Board {
  const grid = GRID_SIZE[level];
  return {
    id: `board-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    childId,
    name,
    type,
    words: words.slice(0, grid.columns * grid.rows),
    gridColumns: grid.columns,
    gridRows: grid.rows,
    contextTriggers,
    createdAt: new Date().toISOString(),
  };
}

export function generateBoards(
  childId: string,
  data: ExtractedOnboardingData,
): Board[] {
  const level = data.communicationLevel ?? 'beginning';
  const boards: Board[] = [];

  // 1. Mealtime board
  if (data.foods.likes.length > 0 || data.foods.dislikes.length > 0) {
    const words: VocabWord[] = [
      makeWord('hungry', 'descriptor'),
      makeWord('thirsty', 'descriptor'),
      makeWord('yucky', 'descriptor'),
      makeWord('yummy', 'descriptor'),
      makeWord('more please', 'social'),
      makeWord('all done eating', 'verb'),
      ...data.foods.likes.map(f => makeWord(f, 'noun')),
      ...data.foods.dislikes.map(f => makeWord(`no ${f}`, 'urgent')),
    ];
    boards.push(makeBoard(childId, 'Mealtime', 'mealtime', words, level, {
      timeRange: { start: '07:00', end: '08:30' },
      routineName: 'breakfast',
    }));
  }

  // 2. Activity boards
  if (data.activities.favorites.length > 0) {
    const words: VocabWord[] = [
      makeWord('play', 'verb'),
      makeWord('my turn', 'social'),
      makeWord('your turn', 'social'),
      makeWord('again', 'descriptor'),
      makeWord('fun', 'descriptor'),
      makeWord('all done', 'verb'),
      ...data.activities.favorites.map(a => makeWord(a, 'noun')),
    ];
    boards.push(makeBoard(childId, 'Activities', 'activity', words, level));
  }

  // 3. People board
  if (data.people.length > 0) {
    const words: VocabWord[] = data.people.map(p =>
      makeWord(p.name, 'person')
    );
    // Add relational words
    words.push(
      makeWord('where is', 'question'),
      makeWord('I want', 'verb'),
      makeWord('come here', 'verb'),
      makeWord('I love you', 'social'),
      makeWord('miss you', 'social'),
    );
    boards.push(makeBoard(childId, 'People', 'people', words, level));
  }

  // 4. Feelings board
  const feelingsWords: VocabWord[] = [
    makeWord('happy', 'urgent'),
    makeWord('sad', 'urgent'),
    makeWord('angry', 'urgent'),
    makeWord('scared', 'urgent'),
    makeWord('frustrated', 'urgent'),
    makeWord('excited', 'urgent'),
    makeWord('tired', 'urgent'),
    makeWord('sick', 'urgent'),
    makeWord('need break', 'urgent'),
    makeWord('need help', 'urgent'),
  ];
  // Add sensory-specific words
  if (data.sensory.sensitivities.length > 0) {
    for (const s of data.sensory.sensitivities) {
      if (s.toLowerCase().includes('loud') || s.toLowerCase().includes('noise')) {
        feelingsWords.push(makeWord('too loud', 'urgent'));
      }
      if (s.toLowerCase().includes('bright') || s.toLowerCase().includes('light')) {
        feelingsWords.push(makeWord('too bright', 'urgent'));
      }
      if (s.toLowerCase().includes('texture') || s.toLowerCase().includes('touch')) {
        feelingsWords.push(makeWord("don't touch", 'urgent'));
      }
    }
  }
  // Add calming strategy words
  for (const strategy of data.sensory.calming.slice(0, 3)) {
    feelingsWords.push(makeWord(`want ${strategy}`, 'verb'));
  }
  // Transition words if transitions are hard
  if (data.hardSituations.some(h => h.toLowerCase().includes('transition'))) {
    feelingsWords.push(
      makeWord('not yet', 'urgent'),
      makeWord('5 more minutes', 'urgent'),
      makeWord('wait', 'urgent'),
    );
  }
  boards.push(makeBoard(childId, 'Feelings', 'feelings', feelingsWords, level));

  // 5. Interests board
  const allInterests = [
    ...data.interests.media,
    ...data.interests.topics,
    ...data.interests.sensory,
  ];
  if (allInterests.length > 0) {
    const words: VocabWord[] = [
      makeWord('I love', 'social'),
      makeWord('tell me about', 'social'),
      makeWord('watch', 'verb'),
      makeWord('listen', 'verb'),
      makeWord('show me', 'verb'),
      ...allInterests.map(i => makeWord(i, 'noun')),
    ];
    boards.push(makeBoard(childId, 'Interests', 'interests', words, level));
  }

  // 6. Places boards
  if (data.places.length > 0) {
    const words: VocabWord[] = [
      makeWord('go to', 'verb'),
      makeWord('are we there', 'question'),
      makeWord('go home', 'verb'),
      makeWord('where are we', 'question'),
      ...data.places.map(p => makeWord(p, 'noun')),
    ];
    boards.push(makeBoard(childId, 'Places', 'location', words, level));
  }

  return boards;
}

// ── Timeline generation ──────────────────────────────────────────

const DEFAULT_SEGMENTS: Array<{
  name: string; icon: string; start: string; end: string; color: string;
}> = [
  { name: 'Wake up',    icon: '🌅', start: '07:00', end: '07:30', color: '#FFD54F' },
  { name: 'Breakfast',  icon: '🥣', start: '07:30', end: '08:15', color: '#FF8A65' },
  { name: 'School',     icon: '🏫', start: '08:30', end: '15:00', color: '#4FC3F7' },
  { name: 'Snack',      icon: '🍎', start: '15:00', end: '15:30', color: '#AED581' },
  { name: 'Play',       icon: '🎮', start: '15:30', end: '17:00', color: '#CE93D8' },
  { name: 'Dinner',     icon: '🍽️', start: '17:30', end: '18:30', color: '#FF8A65' },
  { name: 'Bath',       icon: '🛁', start: '18:30', end: '19:00', color: '#80DEEA' },
  { name: 'Bedtime',    icon: '🌙', start: '19:30', end: '20:00', color: '#7986CB' },
];

export function generateTimeline(
  childId: string,
  data: ExtractedOnboardingData,
  boards: Board[]
): TimelineSegment[] {
  // Use default segments, customized with data from onboarding
  return DEFAULT_SEGMENTS.map((seg, i) => {
    // Try to link to a relevant board
    let boardId: string | undefined;
    if (seg.name.toLowerCase().includes('breakfast') || seg.name.toLowerCase().includes('dinner')) {
      boardId = boards.find(b => b.type === 'mealtime')?.id;
    } else if (seg.name.toLowerCase().includes('play')) {
      boardId = boards.find(b => b.type === 'activity')?.id;
    } else if (seg.name.toLowerCase().includes('school')) {
      boardId = boards.find(b => b.type === 'routine')?.id;
    }

    return {
      id: `timeline-${i}`,
      childId,
      name: seg.name,
      icon: seg.icon,
      startTime: seg.start,
      endTime: seg.end,
      dayType: 'both' as const,
      boardId,
      color: seg.color,
    };
  });
}
