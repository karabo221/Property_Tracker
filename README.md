# Wellora Properties Price Tracker

A clean, production-ready Next.js 14 application for tracking rental property price drops.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma v7
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Scraper**: Fetch + Playwright fallback
- **Icons**: Lucide React

## Setup Instructions

### 1. Supabase Setup
Create a new project on [Supabase](https://supabase.com/). You will need the connection strings from your project settings.

### 2. Environment Variables
Copy the example environment file:
```bash
cp .env.local.example .env.local
```
Update `.env.local` with your database credentials.

### 3. Database Migration
Push the Prisma schema to your Supabase instance:
```bash
npx prisma db push
```
*(Or use `npx prisma migrate dev` if you prefer migration history).*

### 4. Install Dependencies
```bash
npm install
```

### 5. Playwright Setup (For scraping fallback)
```bash
npx playwright install chromium
```

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Features
- **Price Tracking**: Automatically extracts prices from property URLs.
- **Trend Analysis**: Detects consistent downward trends and recent drops.
- **Dashboard**: Ranks listings by largest percentage drop.
- **Historical Charts**: Visualizes price history per listing using Recharts.

## Background Scraping
The application uses a Next.js `instrumentation.ts` hook to register a background scraping job. For robust production deployment, consider replacing this with Vercel Cron or Supabase Edge Functions hitting a secure API endpoint.
