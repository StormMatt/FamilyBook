export type Source = "ebay" | "etsy" | "selency" | "tradera";

export interface ScrapedItem {
  id: string;          // SHA1 of item_url
  title: string;
  price: string | null;
  currency: string | null;
  image_url: string | null;
  item_url: string;
  source: Source;
  search_term: string;
  scraped_at: number;  // Unix timestamp (seconds)
  created_at: number;
}

export interface ScrapeStatus {
  lastRun: number | null;    // Unix timestamp
  nextRun: number | null;
  totalItems: number;
  lastStatus: "running" | "success" | "error" | null;
  isRunning: boolean;
}
