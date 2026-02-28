import * as SQLite from 'expo-sqlite';
import type { ChildProfile, Board, VocabWord, TimelineSegment, UsageLog, ChatMessage } from '../../types';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('familybook.db');
    await initSchema(db);
  }
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS child_profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      photo_uri TEXT,
      communication_level TEXT NOT NULL DEFAULT 'beginning',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS boards (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      words_json TEXT NOT NULL,
      grid_columns INTEGER NOT NULL,
      grid_rows INTEGER NOT NULL,
      context_triggers_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id)
    );

    CREATE TABLE IF NOT EXISTS timeline_segments (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      day_type TEXT NOT NULL DEFAULT 'both',
      board_id TEXT,
      color TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id)
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS usage_logs (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      word_id TEXT NOT NULL,
      board_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      context TEXT,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id)
    );

    CREATE TABLE IF NOT EXISTS onboarding_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      current_category TEXT NOT NULL DEFAULT 'welcome',
      completed_categories_json TEXT NOT NULL DEFAULT '[]',
      extracted_data_json TEXT NOT NULL DEFAULT '{}'
    );
  `);
}

// ── Child Profile ────────────────────────────────────────────────

export async function saveChildProfile(profile: ChildProfile): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO child_profiles (id, name, age, photo_uri, communication_level, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    profile.id, profile.name, profile.age ?? null, profile.photoUri ?? null,
    profile.communicationLevel, profile.createdAt, profile.updatedAt
  );
}

export async function getChildProfile(): Promise<ChildProfile | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<any>('SELECT * FROM child_profiles LIMIT 1');
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    photoUri: row.photo_uri,
    communicationLevel: row.communication_level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Boards ───────────────────────────────────────────────────────

export async function saveBoard(board: Board): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO boards (id, child_id, name, type, words_json, grid_columns, grid_rows, context_triggers_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    board.id, board.childId, board.name, board.type,
    JSON.stringify(board.words), board.gridColumns, board.gridRows,
    board.contextTriggers ? JSON.stringify(board.contextTriggers) : null,
    board.createdAt
  );
}

export async function getBoardsForChild(childId: string): Promise<Board[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM boards WHERE child_id = ? ORDER BY created_at',
    childId
  );
  return rows.map(row => ({
    id: row.id,
    childId: row.child_id,
    name: row.name,
    type: row.type,
    words: JSON.parse(row.words_json),
    gridColumns: row.grid_columns,
    gridRows: row.grid_rows,
    contextTriggers: row.context_triggers_json ? JSON.parse(row.context_triggers_json) : undefined,
    createdAt: row.created_at,
  }));
}

// ── Timeline ─────────────────────────────────────────────────────

export async function saveTimelineSegments(segments: TimelineSegment[]): Promise<void> {
  const database = await getDb();
  for (const seg of segments) {
    await database.runAsync(
      `INSERT OR REPLACE INTO timeline_segments (id, child_id, name, icon, start_time, end_time, day_type, board_id, color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      seg.id, seg.childId, seg.name, seg.icon, seg.startTime, seg.endTime,
      seg.dayType, seg.boardId ?? null, seg.color
    );
  }
}

export async function getTimelineSegments(childId: string): Promise<TimelineSegment[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM timeline_segments WHERE child_id = ? ORDER BY start_time',
    childId
  );
  return rows.map(row => ({
    id: row.id,
    childId: row.child_id,
    name: row.name,
    icon: row.icon,
    startTime: row.start_time,
    endTime: row.end_time,
    dayType: row.day_type,
    boardId: row.board_id,
    color: row.color,
  }));
}

// ── Chat Messages ────────────────────────────────────────────────

export async function saveChatMessage(msg: ChatMessage): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO chat_messages (id, role, content, timestamp, category) VALUES (?, ?, ?, ?, ?)`,
    msg.id, msg.role, msg.content, msg.timestamp, msg.category ?? null
  );
}

export async function getChatMessages(): Promise<ChatMessage[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<any>('SELECT * FROM chat_messages ORDER BY timestamp');
  return rows.map(row => ({
    id: row.id,
    role: row.role,
    content: row.content,
    timestamp: row.timestamp,
    category: row.category,
  }));
}

// ── Usage Logs ───────────────────────────────────────────────────

export async function logWordUsage(log: UsageLog): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO usage_logs (id, child_id, word_id, board_id, timestamp, context) VALUES (?, ?, ?, ?, ?, ?)`,
    log.id, log.childId, log.wordId, log.boardId, log.timestamp, log.context ?? null
  );
}

export async function getUsageStats(childId: string): Promise<{
  totalTaps: number;
  uniqueWords: number;
  recentWords: string[];
}> {
  const database = await getDb();
  const total = await database.getFirstAsync<any>(
    'SELECT COUNT(*) as count FROM usage_logs WHERE child_id = ?', childId
  );
  const unique = await database.getFirstAsync<any>(
    'SELECT COUNT(DISTINCT word_id) as count FROM usage_logs WHERE child_id = ?', childId
  );
  const recent = await database.getAllAsync<any>(
    `SELECT DISTINCT word_id FROM usage_logs WHERE child_id = ?
     ORDER BY timestamp DESC LIMIT 10`, childId
  );
  return {
    totalTaps: total?.count ?? 0,
    uniqueWords: unique?.count ?? 0,
    recentWords: recent.map(r => r.word_id),
  };
}
