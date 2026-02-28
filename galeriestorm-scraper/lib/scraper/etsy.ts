import axios from "axios";
import crypto from "crypto";
import type { ScrapedItem } from "../types";

function makeId(url: string): string {
  return crypto.createHash("sha1").update(url).digest("hex");
}

interface EtsyListing {
  listing_id: number;
  title: string;
  url: string;
  price: { amount: number; divisor: number; currency_code: string };
  images?: { url_570xN: string }[];
}

export async function scrapeEtsy(term: string): Promise<ScrapedItem[]> {
  const apiKey = process.env.ETSY_API_KEY;
  if (!apiKey) {
    // No key configured — skip silently
    return [];
  }

  const now = Math.floor(Date.now() / 1000);

  try {
    const { data } = await axios.get(
      "https://openapi.etsy.com/v3/application/listings/active",
      {
        params: { keywords: term, limit: 48, sort_on: "created", sort_order: "desc" },
        headers: { "x-api-key": apiKey },
        timeout: 15000,
      }
    );

    const results: EtsyListing[] = data.results ?? [];
    return results.map((listing) => {
      const itemUrl = listing.url ?? `https://www.etsy.com/listing/${listing.listing_id}`;
      const priceVal = listing.price
        ? (listing.price.amount / listing.price.divisor).toFixed(2)
        : null;
      const currency = listing.price?.currency_code ?? null;
      const imageUrl = listing.images?.[0]?.url_570xN ?? null;

      return {
        id: makeId(itemUrl),
        title: listing.title,
        price: priceVal,
        currency,
        image_url: imageUrl,
        item_url: itemUrl,
        source: "etsy" as const,
        search_term: term,
        scraped_at: now,
        created_at: now,
      };
    });
  } catch (err: any) {
    console.error(`[etsy] Error scraping "${term}":`, err.message);
    return [];
  }
}
