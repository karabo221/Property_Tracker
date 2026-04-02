import { deriveExternalId } from "./utils"
import { chromium } from "playwright"

// Generic fetch approach
async function fetchProperty24(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })
    
    if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
            console.warn(`Fetch blocked for ${url} (status ${res.status}). Falling back to Playwright.`)
            return null
        }
        throw new Error(`Failed to fetch ${url}. Status: ${res.status}`)
    }
    
    return await res.text()
  } catch (error) {
    console.error("Fetch error:", error)
    return null
  }
}

// Playwright fallback approach
async function scrapeProperty24Playwright(url: string) {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "domcontentloaded" })
    const html = await page.content()
    return html
  } finally {
    await browser.close()
  }
}

// Scrape HTML content to extract details
function extractListingData(html: string, url: string) {
  // Simple regex-based extraction (in a real app, use Cheerio)
  const titleMatch = html.match(/<title>(.*?)<\/title>/)
  const title = titleMatch ? titleMatch[1].trim() : "Unknown Property"

  // Regex to find things like R 1 200 000 or R 15,000
  const priceMatch = html.match(/R\s*[\d,\s]+/)
  let price = 0
  if (priceMatch) {
    const cleanPriceStr = priceMatch[0].replace(/[^\d]/g, "")
    price = parseInt(cleanPriceStr, 10)
  }

  const locationMatch = html.match(/<meta\s+name="description"\s+content=".*?in\s+(.*?)\./i)
  const location = locationMatch ? locationMatch[1].trim() : null

  return {
    externalId: deriveExternalId(url),
    title,
    location,
    url,
    price
  }
}

export async function scrapeProperty24(url: string) {
  let html = await fetchProperty24(url)
  
  if (!html) {
    console.log("Using Playwright fallback for", url)
    html = await scrapeProperty24Playwright(url)
  }
  
  if (!html) throw new Error("Could not retrieve HTML from " + url)
  
  return extractListingData(html, url)
}
