export type PricePoint = {
  price: number | any
  dateScraped: Date
}

export type ListingWithHistory = {
  id: number
  externalId: string
  title: string
  location: string | null
  url: string | null
  createdAt: Date
  priceHistory: PricePoint[]
}

export type DropAnalysis = {
  initialPrice: number
  currentPrice: number
  absoluteDrop: number
  percentageDrop: number
  isConsistentDownTrend: boolean
  hasRecentDrop: boolean
}

export function computePriceDrop(history: PricePoint[]): DropAnalysis {
  if (!history || history.length === 0) {
    return {
      initialPrice: 0,
      currentPrice: 0,
      absoluteDrop: 0,
      percentageDrop: 0,
      isConsistentDownTrend: false,
      hasRecentDrop: false,
    }
  }

  const sortedHistory = [...history].sort((a, b) => a.dateScraped.getTime() - b.dateScraped.getTime())
  
  const initialPrice = sortedHistory[0].price
  const currentPrice = sortedHistory[sortedHistory.length - 1].price
  const absoluteDrop = initialPrice - currentPrice
  const percentageDrop = initialPrice > 0 ? (absoluteDrop / initialPrice) * 100 : 0
  
  // Check if drops are consistently downwards
  let isConsistentDownTrend = false
  if (sortedHistory.length >= 3) {
    let consistentDrops = 0
    for (let i = 1; i < sortedHistory.length; i++) {
      if (sortedHistory[i].price < sortedHistory[i - 1].price) {
        consistentDrops++
      } else if (sortedHistory[i].price > sortedHistory[i - 1].price) {
        consistentDrops = 0 // broke the trend
      }
    }
    isConsistentDownTrend = consistentDrops >= 2 
  }

  // Check recent drop (last 7 days)
  const lastPrice = currentPrice
  let hasRecentDrop = false
  if (sortedHistory.length > 1) {
    const prevPrice = sortedHistory[sortedHistory.length - 2].price
    const dropDate = sortedHistory[sortedHistory.length - 1].dateScraped
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    if (lastPrice < prevPrice && dropDate >= sevenDaysAgo) {
      hasRecentDrop = true
    }
  }

  return {
    initialPrice,
    currentPrice,
    absoluteDrop,
    percentageDrop,
    isConsistentDownTrend,
    hasRecentDrop,
  }
}

export function rankByDrop(listings: ListingWithHistory[]) {
  return [...listings].sort((a, b) => {
    const dropA = computePriceDrop(a.priceHistory).percentageDrop
    const dropB = computePriceDrop(b.priceHistory).percentageDrop
    return dropB - dropA
  })
}
