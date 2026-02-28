import { VocabWord, ColorCode, WordCategory } from '../types';

// Modified Fitzgerald Key color mapping
export const CATEGORY_COLORS: Record<WordCategory, ColorCode> = {
  verb: 'green',
  noun: 'orange',
  descriptor: 'blue',
  social: 'pink',
  person: 'yellow',
  urgent: 'red',
  question: 'purple',
};

export const COLOR_HEX: Record<ColorCode, string> = {
  green: '#4CAF50',
  orange: '#FF9800',
  blue: '#2196F3',
  pink: '#E91E63',
  yellow: '#FFC107',
  red: '#F44336',
  purple: '#9C27B0',
};

// Grid sizes by communication level
export const GRID_SIZE = {
  beginning: { columns: 3, rows: 3 },   // 9 items
  emerging: { columns: 4, rows: 5 },     // 20 items
  expanding: { columns: 5, rows: 6 },    // 30 items
  advanced: { columns: 6, rows: 8 },     // 48 items
} as const;

let nextId = 1;
function coreWord(label: string, category: WordCategory): VocabWord {
  return {
    id: `core-${nextId++}`,
    label,
    category,
    colorCode: CATEGORY_COLORS[category],
    isCore: true,
  };
}

// Core strip — always visible on every board
export const CORE_STRIP: VocabWord[] = [
  coreWord('I', 'person'),
  coreWord('want', 'verb'),
  coreWord('more', 'descriptor'),
  coreWord('stop', 'urgent'),
  coreWord('help', 'urgent'),
  coreWord('go', 'verb'),
  coreWord('all done', 'verb'),
  coreWord('yes', 'social'),
  coreWord('no', 'urgent'),
];

// Extended core vocabulary (~75 research-backed high-frequency words)
export const CORE_VOCABULARY: VocabWord[] = [
  ...CORE_STRIP,
  // Verbs
  coreWord('eat', 'verb'),
  coreWord('drink', 'verb'),
  coreWord('play', 'verb'),
  coreWord('look', 'verb'),
  coreWord('like', 'verb'),
  coreWord("don't like", 'verb'),
  coreWord('make', 'verb'),
  coreWord('get', 'verb'),
  coreWord('put', 'verb'),
  coreWord('open', 'verb'),
  coreWord('turn', 'verb'),
  coreWord('come', 'verb'),
  coreWord('sit', 'verb'),
  coreWord('read', 'verb'),
  coreWord('feel', 'verb'),

  // Nouns (generic)
  coreWord('bathroom', 'noun'),
  coreWord('water', 'noun'),
  coreWord('outside', 'noun'),
  coreWord('home', 'noun'),
  coreWord('school', 'noun'),
  coreWord('book', 'noun'),
  coreWord('toy', 'noun'),
  coreWord('food', 'noun'),
  coreWord('bed', 'noun'),
  coreWord('TV', 'noun'),

  // Descriptors
  coreWord('big', 'descriptor'),
  coreWord('little', 'descriptor'),
  coreWord('hot', 'descriptor'),
  coreWord('cold', 'descriptor'),
  coreWord('good', 'descriptor'),
  coreWord('bad', 'descriptor'),
  coreWord('mine', 'descriptor'),
  coreWord('your', 'descriptor'),
  coreWord('this', 'descriptor'),
  coreWord('that', 'descriptor'),
  coreWord('up', 'descriptor'),
  coreWord('down', 'descriptor'),
  coreWord('in', 'descriptor'),
  coreWord('on', 'descriptor'),
  coreWord('off', 'descriptor'),
  coreWord('here', 'descriptor'),
  coreWord('there', 'descriptor'),
  coreWord('same', 'descriptor'),
  coreWord('different', 'descriptor'),
  coreWord('all', 'descriptor'),

  // Social
  coreWord('hi', 'social'),
  coreWord('bye', 'social'),
  coreWord('please', 'social'),
  coreWord('thank you', 'social'),
  coreWord('sorry', 'social'),
  coreWord('my turn', 'social'),
  coreWord('your turn', 'social'),
  coreWord('look!', 'social'),

  // Questions
  coreWord('what', 'question'),
  coreWord('where', 'question'),
  coreWord('who', 'question'),
  coreWord('when', 'question'),
  coreWord('why', 'question'),
  coreWord('how', 'question'),

  // Urgent / Agency
  coreWord('hurt', 'urgent'),
  coreWord('scared', 'urgent'),
  coreWord('angry', 'urgent'),
  coreWord('happy', 'urgent'),
  coreWord('sad', 'urgent'),
  coreWord('tired', 'urgent'),
  coreWord('not yet', 'urgent'),
  coreWord('wait', 'urgent'),
  coreWord('too loud', 'urgent'),
  coreWord('need break', 'urgent'),
];
