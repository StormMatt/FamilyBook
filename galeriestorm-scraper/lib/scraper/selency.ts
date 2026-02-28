import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";
import type { ScrapedItem } from "../types";

function makeId(url: string): string {
  return crypto.createHash("sha1").update(url).digest("hex");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function scrapeSelency(term: string): Promise<ScrapedItem[]> {
  const url = `https://selency.com/search?q=${encodeURIComponent(term)}&sort=recent`;
  const now = Math.floor(Date.now() / 1000);

  try {
    await sleep(800 + Math.random() * 800);
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const items: ScrapedItem[] = [];

    // Selency product cards — selector may need updating if site changes
    $("[data-testid='product-card'], .product-card, article.product").each((_, el) => {
      const titleEl = $(el).find("h2, h3, [data-testid='product-title']").first();
      const title = titleEl.text().trim();
      if (!title) return;

      const linkEl = $(el).find("a").first();
      const href = linkEl.attr("href") ?? "";
      const itemUrl = href.startsWith("http") ? href : `https://selency.com${href}`;
      if (!href) return;

      const priceEl = $(el).find("[data-testid='product-price'], .price, .product-price").first();
      const price = priceEl.text().trim() || null;

      const imgEl = $(el).find("img").first();
      const imageUrl = imgEl.attr("src") || imgEl.attr("data-src") || null;

      items.push({
        id: makeId(itemUrl),
        title,
        price,
        currency: price?.includes("€") ? "EUR" : null,
        image_url: imageUrl,
        item_url: itemUrl,
        source: "selency",
        search_term: term,
        scraped_at: now,
        created_at: now,
      });
    });

    if (items.length === 0) {
      console.warn(`[selency] 0 items for "${term}" — site may require JS rendering`);
    }

    return items;
  } catch (err: any) {
    console.error(`[selency] Error scraping "${term}":`, err.message);
    return [];
  }
}
