import { notFound } from "next/navigation"
import { PriceChart } from "@/components/PriceChart"
import { PriceHistoryTable } from "@/components/PriceHistoryTable"
import { computePriceDrop } from "@/lib/analysis"
import { formatCurrency, formatDrop } from "@/lib/utils"
import { ExternalLink, ArrowLeft, TrendingDown, TrendingUp, MapPin } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function ListingPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const p = await params;
  const id = parseInt(p.id, 10)
  
  if (isNaN(id)) return notFound()

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      priceHistory: {
        orderBy: { dateScraped: "asc" }
      }
    }
  })

  if (!listing) return notFound()

  const analysis = computePriceDrop(listing.priceHistory)

  return (
    <div className="max-w-5xl mx-auto py-6">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#0e8749] mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-8 flex flex-col md:flex-row gap-8 justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#0e8749]/10 text-[#0e8749] text-xs font-bold rounded-full uppercase tracking-wider">
              {listing.priceHistory.length > 1 ? "Tracked Property" : "New Listing"}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            {listing.title}
          </h1>
          
          {listing.location && (
            <p className="flex items-center text-gray-500 mb-6">
              <MapPin size={18} className="mr-1.5 opacity-70" /> {listing.location}
            </p>
          )}

          {listing.url && (
            <a 
              href={listing.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-[#0e8749] text-white rounded-lg font-medium hover:bg-[#0a6636] transition-colors gap-2"
            >
              View Original Listing <ExternalLink size={16} />
            </a>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-w-64">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">Current Price</p>
          <div className="text-4xl font-bold text-gray-900 mb-4">{formatCurrency(analysis.currentPrice)}</div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Initial Price</span>
              <span className="font-medium">{formatCurrency(analysis.initialPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Overall Change</span>
              <span className="font-medium flex items-center">
                {analysis.percentageDrop > 0 ? (
                  <span className="text-[#0e8749] flex items-center"><TrendingDown size={14} className="mr-1"/> {formatDrop(analysis.percentageDrop)}</span>
                ) : analysis.percentageDrop < 0 ? (
                  <span className="text-red-600 flex items-center"><TrendingUp size={14} className="mr-1"/> {formatDrop(Math.abs(analysis.percentageDrop))}</span>
                ) : (
                  <span className="text-gray-400">0%</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PriceChart data={listing.priceHistory} />
        </div>
        <div>
          <PriceHistoryTable data={listing.priceHistory} />
        </div>
      </div>
    </div>
  )
}
