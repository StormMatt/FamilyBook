import { createServer } from "http";
import { parse } from "url";
import next from "next";
import cron from "node-cron";
import { runScrape } from "./lib/scraper/index";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Scrape on startup, then every 3 hours
  console.log("[server] Running initial scrape on startup…");
  runScrape().catch(console.error);

  cron.schedule("0 */3 * * *", () => {
    console.log("[cron] Firing scheduled scrape…");
    runScrape().catch(console.error);
  });

  createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log(`[server] Ready at http://localhost:3000`);
  });
});
