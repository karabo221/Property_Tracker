import { formatCurrency, formatDrop, cn } from "@/lib/utils"
import { PricePoint } from "@/lib/analysis"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

interface PriceHistoryTableProps {
  data: PricePoint[]
}

export function PriceHistoryTable({ data }: PriceHistoryTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
        No price history recorded yet.
      </div>
    )
  }

  // Sort descending by date (newest first)
  const sortedData = [...data].sort(
    (a, b) => new Date(b.dateScraped).getTime() - new Date(a.dateScraped).getTime()
  )

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="px-6 py-4 rounded-tl-lg">Date Scraped</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 rounded-tr-lg">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData.map((point, index) => {
              // Calculate change from the PREVIOUS recorded point (which is next in the reversed array)
              const previousPoint = sortedData[index + 1]
              let changeElem = <span className="text-gray-400 flex items-center gap-1.5"><Minus size={14} /> Initial</span>

              if (previousPoint) {
                const diff = Number(previousPoint.price) - Number(point.price)
                if (diff > 0) {
                  // Price went down (good)
                  const pct = (diff / Number(previousPoint.price)) * 100
                  changeElem = (
                    <span className="text-[#0e8749] font-medium flex items-center gap-1.5 bg-[#0e8749]/10 px-2 py-1 rounded-md w-fit">
                      <TrendingDown size={16} />
                      -{formatDrop(pct)} (-{formatCurrency(diff)})
                    </span>
                  )
                } else if (diff < 0) {
                  // Price went up (bad)
                  const pct = (Math.abs(diff) / Number(previousPoint.price)) * 100
                  changeElem = (
                    <span className="text-red-600 font-medium flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-md w-fit">
                      <TrendingUp size={16} />
                      +{formatDrop(pct)} (+{formatCurrency(Math.abs(diff))})
                    </span>
                  )
                } else {
                  changeElem = <span className="text-gray-400 flex items-center gap-1.5"><Minus size={14} /> No Change</span>
                }
              }

              return (
                <tr key={String(point.dateScraped) + index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {new Date(point.dateScraped).toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap font-medium">
                    {formatCurrency(point.price)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {changeElem}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
