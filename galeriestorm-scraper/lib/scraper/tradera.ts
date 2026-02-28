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

export async function scrapeTradera(term: string): Promise<ScrapedItem[]> {
  const url = `https://www.tradera.com/search?q=${encodeURIComponent(term)}&order=added`;
  const now = Math.floor(Date.now() / 1000);

  try {
    await sleep(800 + Math.random() * 800);
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const items: ScrapedItem[] = [];

    // Tradera listing cards
    $(".item-card, [data-testid='item-card'], article.listing-card, .search-result-item").each((_, el) => {
      const titleEl = $(el).find("h2, h3, .item-card__title, [data-testid='item-title']").first();
      const title = titleEl.text().trim();
      if (!title) return;

      const linkEl = $(el).find("a").first();
      const href = linkEl.attr("href") ?? "";
      if (!href) return;
      const itemUrl = href.startsWith("http") ? href : `https://www.tradera.com${href}`;

      const priceEl = $(el).find(".item-card__price, .price, [data-testid='price']").first();
      const priceText = priceEl.text().trim() || null;

      const imgEl = $(el).find("img").first();
      const imageUrl =
        imgEl.attr("data-src") || imgEl.attr("src") || null;

      items.push({
        id: makeId(itemUrl),
        title,
        price: priceText,
        currency: "SEK",
        image_url: imageUrl,
        item_url: itemUrl,
        source: "tradera",
        search_term: term,
        scraped_at: now,
        created_at: now,
      });
    });

    if (items.length === 0) {
      console.warn(`[tradera] 0 items for "${term}" — checking alternate selectors`);
      // Fallback: try any card-like element with a link and an image
      $("li a[href*='/item/'], li a[href*='/annons/']").each((_, el) => {
        const href = $(el).attr("href") ?? "";
        if (!href) return;
        const itemUrl = href.startsWith("http") ? href : `https://www.tradera.com${href}`;
        const title = $(el).attr("title") || $(el).text().trim();
        if (!title) return;
        const imgEl = $(el).find("img").first();
        const imageUrl = imgEl.attr("src") || imgEl.attr("data-src") || null;

        items.push({
          id: makeId(itemUrl),
          title,
          price: null,
          currency: "SEK",
          image_url: imageUrl,
          item_url: itemUrl,
          source: "tradera",
          search_term: term,
          scraped_at: now,
          created_at: now,
        });
      });
    }

    return items;
  } catch (err: any) {
    console.error(`[tradera] Error scraping "${term}":`, err.message);
    return [];
  }
}
