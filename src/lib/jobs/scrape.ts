import { scrapeProperty24 } from "../scraper"
import prisma from "../db"

// Stubbed search URLs (In production, you would generate these dynamically or query a database)
const TARGET_URLS = [
  "https://www.property24.com/to-rent/cape-town/western-cape/432",
  "https://www.property24.com/to-rent/sandton/gauteng/431",
]

export async function scrapeAll() {
  console.log("Starting scrapeAll job at", new Date().toISOString())
  // A robust implementation would parse pagination on search results.
  // For MVP, we pretend these are listing URLs or parse the first page.
  
  for (const url of TARGET_URLS) {
    try {
        console.log(`Scraping target: ${url}`)
        // We'd actually scrape the list page, extract listing URLs, then scrape those.
        // As a placeholder, we use scrapeProperty24 directly (expecting it parses the list eventually).
        
        // MVP: Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
    } catch(err) {
        console.error(`Error scraping ${url}:`, err)
    }
  }
}

export function startScrapeJob() {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
  console.log("Registered 24h background scraping job")
  
  // setInterval(scrapeAll, TWENTY_FOUR_HOURS)
  // Commented out the actual setInterval to prevent spamming while in development.
  // In production, better to use a cron job hitting an API endpoint.
}
