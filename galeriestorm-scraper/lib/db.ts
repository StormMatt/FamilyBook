import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "gallery.sqlite");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  _db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      price       TEXT,
      currency    TEXT,
      image_url   TEXT,
      item_url    TEXT NOT NULL UNIQUE,
      source      TEXT NOT NULL,
      search_term TEXT NOT NULL,
      scraped_at  INTEGER NOT NULL,
      created_at  INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_items_source ON items(source);
    CREATE INDEX IF NOT EXISTS idx_items_scraped_at ON items(scraped_at DESC);

    CREATE TABLE IF NOT EXISTS scrape_log (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at    INTEGER NOT NULL,
      finished_at   INTEGER,
      items_found   INTEGER DEFAULT 0,
      status        TEXT DEFAULT 'running',
      error_message TEXT
    );
  `);

  return _db;
}

export function upsertItem(item: {
  id: string;
  title: string;
  price: string | null;
  currency: string | null;
  image_url: string | null;
  item_url: string;
  source: string;
  search_term: string;
  scraped_at: number;
  created_at: number;
}): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO items (id, title, price, currency, image_url, item_url, source, search_term, scraped_at, created_at)
    VALUES (@id, @title, @price, @currency, @image_url, @item_url, @source, @search_term, @scraped_at, @created_at)
    ON CONFLICT(id) DO UPDATE SET
      title      = excluded.title,
      price      = excluded.price,
      currency   = excluded.currency,
      image_url  = excluded.image_url,
      scraped_at = excluded.scraped_at
  `).run(item);
}

export function startScrapeLog(): number {
  const db = getDb();
  const result = db.prepare(
    "INSERT INTO scrape_log (started_at, status) VALUES (?, 'running')"
  ).run(Math.floor(Date.now() / 1000));
  return result.lastInsertRowid as number;
}

export function finishScrapeLog(
  id: number,
  itemsFound: number,
  status: "success" | "error",
  errorMessage?: string
): void {
  const db = getDb();
  db.prepare(`
    UPDATE scrape_log
    SET finished_at = ?, items_found = ?, status = ?, error_message = ?
    WHERE id = ?
  `).run(Math.floor(Date.now() / 1000), itemsFound, status, errorMessage ?? null, id);
}

export function getLastScrapeLog(): {
  started_at: number;
  finished_at: number | null;
  items_found: number;
  status: string;
} | null {
  const db = getDb();
  return db.prepare(
    "SELECT started_at, finished_at, items_found, status FROM scrape_log ORDER BY id DESC LIMIT 1"
  ).get() as any ?? null;
}

export function getTotalItemCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as c FROM items").get() as { c: number };
  return row.c;
}

export function queryItems(params: {
  source?: string;
  term?: string;
  limit?: number;
  offset?: number;
}): any[] {
  const db = getDb();
  const conditions: string[] = [];
  const values: any[] = [];

  if (params.source) {
    conditions.push("source = ?");
    values.push(params.source);
  }
  if (params.term) {
    conditions.push("search_term = ?");
    values.push(params.term);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = params.limit ?? 100;
  const offset = params.offset ?? 0;

  return db.prepare(
    `SELECT * FROM items ${where} ORDER BY scraped_at DESC LIMIT ? OFFSET ?`
  ).all(...values, limit, offset) as any[];
}
