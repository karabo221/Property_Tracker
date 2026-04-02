import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { computePriceDrop, rankByDrop, ListingWithHistory } from "@/lib/analysis"

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        priceHistory: {
          orderBy: { dateScraped: "asc" }
        }
      }
    })

    // Filter to listings with at least 2 price points for drop calculation
    const eligibleListings = listings.filter(l => l.priceHistory.length > 1) as unknown as ListingWithHistory[]
    
    // Rank them by highest percentage drop
    const ranked = rankByDrop(eligibleListings)
    
    // Take top 20 drops (where drop > 0)
    const topDrops = ranked
      .filter(l => computePriceDrop(l.priceHistory).percentageDrop > 0)
      .slice(0, 20)

    return NextResponse.json(topDrops)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch top drops" }, { status: 500 })
  }
}
