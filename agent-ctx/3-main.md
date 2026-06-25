# Task 3 — Update LivesView + Verify ProfileView

## Summary
Updated LivesView to fetch and display live streams from the database API in addition to mock data. Verified ProfileView file upload is complete and functional.

## Changes Made

### 1. New API Route: `/api/lives/active/route.ts`
- Returns all currently active live streams (`isLive: true`) ordered by viewerCount desc
- Returns all scheduled live streams (`isScheduled: true, isLive: false`) ordered by scheduledAt asc
- Includes artist relation (stageName, avatar) for each stream
- Error handling with 500 status

### 2. Updated `page.tsx` — Type Imports
- Added `SongType` and `LiveStreamType` to the import from `@/types`
- `SongType` was previously used but not imported (would have caused TS error)

### 3. Updated `page.tsx` — LivesView Component
- Added `UnifiedLiveStream` interface to normalize data from DB and mock sources
- Added state: `dbActiveLives`, `dbScheduledLives`, `loadingDb`
- Added `useEffect` to fetch from `/api/lives/active` on mount with cancellation
- Maps DB records to `UnifiedLiveStream`, extracting `artistName` from `artist.stageName`
- Merges DB lives first, then mock lives
- Added loading spinner, empty state, "DB" badge on DB-sourced cards
- Added fallback UI for streams without thumbnails
- Updated `handleLiveClick` to use `UnifiedLiveStream` type

### 4. ProfileView Verification
- File upload flow is complete: avatarInputRef → handleAvatarUpload → /api/upload → /api/profile
- All validation, loading states, and error handling present
- No changes needed

## Lint & Dev Log
- `bun run lint` — zero errors
- No compilation errors in dev.log
