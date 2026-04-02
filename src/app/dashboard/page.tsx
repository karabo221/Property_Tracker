import { Suspense } from "react"
import { ListingCard, ListingCardSkeleton } from "@/components/ListingCard"
import { ListingWithHistory, computePriceDrop } from "@/lib/analysis"

// We use relative URLs if client-side, but since this is server component we need absolute URL or direct DB access.
// Since we have direct access to Prisma, let's just query direct instead of hitting our own API
// This is a common and recommended Next.js 14 App Router pattern for simple reads.
import prisma from "@/lib/db"
import { rankByDrop } from "@/lib/analysis"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  const listings = await prisma.listing.findMany({
    include: {
      priceHistory: {
        orderBy: { dateScraped: "asc" }
      }
    }
  })

  // We are considering all listings that we have.
  // We'll calculate the drops and rank by drop
  const eligible = listings.filter((l: any) => l.priceHistory.length > 0) as unknown as ListingWithHistory[]
  const ranked = rankByDrop(eligible)
  
  return ranked
}

function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}

async function DashboardGrid() {
  const listings = await getDashboardData()

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Tracked Yet</h3>
        <p className="text-gray-500 mb-6">The background scraper will start collecting data soon, or you can add properties manually via the API.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {listings.map(listing => {
        const analysis = computePriceDrop(listing.priceHistory)
        return (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            location={listing.location}
            url={listing.url}
            currentPrice={analysis.currentPrice}
            percentageDrop={analysis.percentageDrop}
          />
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div>
      <div className="bg-[#0e8749] rounded-2xl p-8 md:p-12 shadow-lg mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 max-w-2xl">
          <p className="text-[#a4e5c3] font-medium tracking-wider text-sm uppercase mb-2">Wellora Properties</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Expert Price Tracking,<br />Better Investments.
          </h1>
          <p className="text-[#d8f4e6] text-lg max-w-xl">
            We help you find the best rental opportunities with expert price analysis. Real-time market tracking and historical price comparisons.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-12 mb-2 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ranked Opportunities</h2>
          <p className="text-sm text-gray-500 mt-1">Properties filtered by biggest price drops</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button className="px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm">Top Drops</button>
          <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900">Recent</button>
          <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900">Newest</button>
        </div>
      </div>

      <Suspense fallback={<DashboardGridSkeleton />}>
        <DashboardGrid />
      </Suspense>
    </div>
  )
}
