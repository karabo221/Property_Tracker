import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | any): string {
  const value = typeof amount === "string" ? parseFloat(amount) : Number(amount)
  if (isNaN(value)) return "R 0"
  
  // Format as ZAR (South African Rand)
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDrop(percentage: number): string {
  if (percentage <= 0) return "0%"
  return `${percentage.toFixed(1)}%`
}

export function deriveExternalId(url: string | null | undefined): string {
  if (!url) return crypto.randomUUID()
  const parts = url.split("?")
  const pathParts = parts[0].split("/")
  return pathParts[pathParts.length - 1] || crypto.randomUUID()
}
