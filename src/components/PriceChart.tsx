"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { PricePoint } from "@/lib/analysis"

interface PriceChartProps {
  data: PricePoint[]
}

export function PriceChart({ data }: PriceChartProps) {
  // Format data for Recharts
  const chartData = data.map(point => ({
    date: new Date(point.dateScraped).toLocaleDateString("en-ZA", {
      month: "short",
      day: "numeric",
    }),
    price: Number(point.price),
    // Keep original date for precise sorting if needed, but Recharts works with the string
    fullDate: point.dateScraped
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
        No price history available yet.
      </div>
    )
  }

  return (
    <div className="h-80 w-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `R ${value / 1000}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value: any) => [formatCurrency(value), "Price"]}
              labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0e8749"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#0e8749" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#0e8749" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
