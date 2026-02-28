import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";
import type { ScrapedItem } from "../types";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
];

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function makeId(url: string): string {
  return crypto.createHash("sha1").update(url).digest("hex");
}

export async function scrapeEbay(term: string): Promise<ScrapedItem[]> {
  const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(term)}&_sop=10&_ipg=48`;
  const now = Math.floor(Date.now() / 1000);

  try {
    await sleep(1000 + Math.random() * 1000);
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": randomUA(),
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const items: ScrapedItem[] = [];

    $(".s-item").each((_, el) => {
      const titleEl = $(el).find(".s-item__title");
      const title = titleEl.text().trim();
      if (!title || title.toLowerCase() === "shop on ebay") return;

      const linkEl = $(el).find("a.s-item__link");
      const rawUrl = linkEl.attr("href") ?? "";
      // Strip tracking params — keep up to the item ID
      const itemUrl = rawUrl.split("?")[0] || rawUrl;
      if (!itemUrl) return;

      const priceText = $(el).find(".s-item__price").first().text().trim();
      // Detect currency symbol
      const currencyMatch = priceText.match(/^([£€$¥]|[A-Z]{2,3}\s)/);
      const currency = currencyMatch ? currencyMatch[0].trim() : null;
      const price = priceText || null;

      const imageEl = $(el).find("img");
      const imageUrl =
        imageEl.attr("data-src") || imageEl.attr("src") || null;

      items.push({
        id: makeId(itemUrl),
        title,
        price,
        currency,
        image_url: imageUrl,
        item_url: itemUrl,
        source: "ebay",
        search_term: term,
        scraped_at: now,
        created_at: now,
      });
    });

    return items;
  } catch (err: any) {
    console.error(`[ebay] Error scraping "${term}":`, err.message);
    return [];
  }
}
