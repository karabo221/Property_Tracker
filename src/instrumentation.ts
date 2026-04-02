import { startScrapeJob } from "./lib/jobs/scrape"

export function register() {
  startScrapeJob()
}
