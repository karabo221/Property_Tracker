import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { computePriceDrop, ListingWithHistory } from "@/lib/analysis"

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        priceHistory: {
          orderBy: { dateScraped: "asc" }
        }
      }
    })

    const eligibleListings = listings.filter(l => l.priceHistory.length > 1) as unknown as ListingWithHistory[]
    
    // Filter to listings with a recent drop
    const recentDrops = eligibleListings.filter(l => {
        const analysis = computePriceDrop(l.priceHistory)
        return analysis.hasRecentDrop
    })
    
    // Sort by recent date of drop
    recentDrops.sort((a, b) => {
        const aHist = a.priceHistory
        const bHist = b.priceHistory
        return bHist[bHist.length - 1].dateScraped.getTime() - aHist[aHist.length - 1].dateScraped.getTime()
    })

    return NextResponse.json(recentDrops.slice(0, 20))
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recent drops" }, { status: 500 })
  }
}
