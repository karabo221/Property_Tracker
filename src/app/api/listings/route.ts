import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        priceHistory: {
          orderBy: { dateScraped: "desc" }
        }
      }
    })
    return NextResponse.json(listings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { externalId, title, location, url, price } = body

    if (!externalId || typeof price !== "number") {
      return NextResponse.json({ error: "Missing required fields (externalId, price)" }, { status: 400 })
    }

    // Upsert the listing
    const listing = await prisma.listing.upsert({
      where: { externalId },
      update: { title, location, url },
      create: { externalId, title, location, url }
    })

    // Always append the new price history
    const history = await prisma.priceHistory.create({
      data: {
        listingId: listing.id,
        price
      }
    })

    return NextResponse.json({ listing, history }, { status: 201 })
  } catch (error) {
    console.error("POST /api/listings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
