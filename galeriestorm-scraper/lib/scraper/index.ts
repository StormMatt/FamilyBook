import { upsertItem, startScrapeLog, finishScrapeLog } from "../db";
import { setIsRunning, getIsRunning, registerTrigger } from "./state";
import { scrapeEbay } from "./ebay";
import { scrapeEtsy } from "./etsy";
import { scrapeSelency } from "./selency";
import { scrapeTradera } from "./tradera";

// ─── Search Terms ────────────────────────────────────────────────────────────
export const SEARCH_TERMS: string[] = [
  // Silversmiths & metalwork
  "Guldsmedsaktiebolaget", "GAB silver", "Henry William Hallberg",
  "P.O Gustafsson", "Sylvia Stave", "Anna-Lisa Thomson",
  "Carin Ellberg", "Ystad Brons", "atelier borgila",
  "Lars Holmström", "Hinrich Gauerke", "Ernst Svedbom",
  "Helge Ernst", "Vivi Calissendorff", "Axel Gute",
  "Harald Linder", "Böhlmark", "Bror Forslund",

  // Scandinavian sculptors & bronze
  "Just Andersen", "Carl Milles", "Carl Eldh",
  "Oscar Antonsson", "Bo Arenander", "Boris Stojkov",
  "Sigurd Berggren", "Wäinö Altonen", "Pär Lindblad",
  "Gösta Grähs", "Bengt Amundin", "Folke Arström",
  "Gaston Lachaise", "Ove Pihl", "Carl Elmberg",

  // French Art Deco & international
  "Line Vautrin", "Jean Desprès", "Cécile Tarel",
  "Pierre Chenet", "Dagobert Peche", "Fratelli Manelli",
  "Ercole Barovier", "Brancusi", "Josep Ricart Garriga",
  "Antonio Mazzucco", "Hans Parzinger", "Ursula Fesca",
  "Gisela Peterhof-Heimig", "Anna Mizak",

  // Swedish design & Svenskt Tenn
  "Svenskt Tenn", "spegel Svenskt Tenn", "Swedish Grace",
  "Swedish Modern", "Isolit",

  // Photographers & artists
  "Karl Blossfeldt", "Greta Gerell", "Birgitta Watz",
  "Agnes Martin", "Malin Forsgren", "Ellen Victoria Kajerdt",
  "Marie-Louise Sjögren", "Ilse Crawford", "Nikolai Lehto",
  "Arje Griegst", "Antti Hakkarainen",

  // Furniture & objects
  "bockbord", "kaminspegel", "bokskåp", "folding screen",
  "Chinese screen", "trestle table", "pewter mirror",
  "art deco mirror", "tobacco jar", "grand tour",
  "tridacna", "suzani", "fårskinn", "brutalist",

  // Jewellery & watches
  "Sophie Bille Brahe", "Cartier tank", "Phoebe Philo",
  "Jean Cocteau", "Secessionist",

  // Other collected names & objects
  "Sune Bäckström", "Åke Arenhill",
  "Walles & Walles", "Paul T. Frankl", "Wächtersbach",
  "Wilhelmina Wendt", "Mattias Storm", "Orgone",
];

// ─── Orchestrator ─────────────────────────────────────────────────────────────
async function runScrape(): Promise<void> {
  if (getIsRunning()) {
    console.log("[scraper] Already running, skipping.");
    return;
  }

  setIsRunning(true);
  const logId = startScrapeLog();
  let totalFound = 0;

  console.log(`[scraper] Starting — ${SEARCH_TERMS.length} terms × 4 sources`);

  try {
    for (const term of SEARCH_TERMS) {
      const [ebayItems, etsyItems, selencyItems, traderaItems] =
        await Promise.allSettled([
          scrapeEbay(term),
          scrapeEtsy(term),
          scrapeSelency(term),
          scrapeTradera(term),
        ]).then((results) =>
          results.map((r) => (r.status === "fulfilled" ? r.value : []))
        );

      const all = [...ebayItems, ...etsyItems, ...selencyItems, ...traderaItems];
      for (const item of all) {
        upsertItem(item);
      }
      totalFound += all.length;
      console.log(`[scraper] "${term}" → ${all.length} items (ebay:${ebayItems.length} etsy:${etsyItems.length} selency:${selencyItems.length} tradera:${traderaItems.length})`);
    }

    finishScrapeLog(logId, totalFound, "success");
    console.log(`[scraper] Done. ${totalFound} items total.`);
  } catch (err: any) {
    finishScrapeLog(logId, totalFound, "error", err.message);
    console.error("[scraper] Fatal error:", err.message);
  } finally {
    setIsRunning(false);
  }
}

// Register so state.ts can expose it to API routes
registerTrigger(runScrape);

export { runScrape };
