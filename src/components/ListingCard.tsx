import Link from "next/link"
import { ExternalLink, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { formatCurrency, formatDrop, cn } from "@/lib/utils"

interface ListingCardProps {
  id: number
  title: string
  location: string | null
  url: string | null
  currentPrice: number
  percentageDrop: number // Positive means price went down (good), negative means price went up (bad)
}

export function ListingCard({
  id,
  title,
  location,
  url,
  currentPrice,
  percentageDrop,
}: ListingCardProps) {
  const isDrop = percentageDrop > 0
  const isRise = percentageDrop < 0

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <Badge drop={percentageDrop} />
          {url && (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-[#0e8749] transition-colors"
              title="View on Property24"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1 line-clamp-2">
          {title}
        </h3>
        
        {location && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-1">{location}</p>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-50">
          <p className="text-sm text-gray-500 mb-1">Current Price</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(currentPrice)}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <Link 
          href={`/listings/${id}`}
          className="text-sm font-medium text-[#0e8749] hover:text-[#0a6636] flex items-center justify-center w-full transition-colors"
        >
          View Price History
        </Link>
      </div>
    </div>
  )
}

function Badge({ drop }: { drop: number }) {
  if (drop > 0) {
    return (
      <span className="inline-flex items-center gap-1 bg-[#0e8749]/10 text-[#0e8749] text-xs font-semibold px-2.5 py-1 rounded-full">
        <TrendingDown size={14} />
        {drop.toFixed(1)}% Drop
      </span>
    )
  }
  
  if (drop < 0) {
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        <TrendingUp size={14} />
        {Math.abs(drop).toFixed(1)}% Rise
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
      <Minus size={14} />
      No Change
    </span>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-64 animate-pulse flex flex-col p-5">
      <div className="h-6 w-24 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-md mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-auto"></div>
      <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-2 mt-6"></div>
      <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
    </div>
  )
}
