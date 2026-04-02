import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Quick DB check
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      dbConnected: true,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      dbConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 503 })
  }
}
