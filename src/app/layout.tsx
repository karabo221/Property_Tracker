import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"
import { BuildingIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Wellora Properties | Price Tracker",
  description: "Track property price drops and recent market changes.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-[#0e8749] p-2 rounded-lg text-white group-hover:bg-[#0a6636] transition-colors">
                <BuildingIcon size={20} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Wellora<span className="text-[#0e8749]">Properties</span></span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-[#0e8749] transition-colors">
                Dashboard
              </Link>
              <div className="text-sm font-medium text-gray-600 hover:text-[#0e8749] transition-colors cursor-pointer">
                Properties
              </div>
              <div className="text-sm font-medium text-gray-600 hover:text-[#0e8749] transition-colors cursor-pointer">
                About
              </div>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wellora Properties Tracker. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
