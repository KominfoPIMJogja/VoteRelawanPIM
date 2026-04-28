import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const headersList = await headers()

    const forwarded = headersList.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"
    const voterIdentifier = Buffer.from(`${ip}-${userAgent}`).toString("base64").slice(0, 50)

    // Cek apakah voter sudah vote
    const { data: vote } = await supabase
      .from("votes")
      .select("staff_id, created_at")
      .eq("voter_identifier", voterIdentifier)
      .single()

    // Ambil waktu reset terakhir
    const { data: settings } = await supabase
      .from("vote_settings")
      .select("value")
      .eq("key", "last_reset")
      .single()

    const lastReset = settings?.value || null

    // Kalau sudah vote, tapi vote dibuat SEBELUM reset terakhir → boleh vote lagi
    if (vote && lastReset) {
      const voteTime = new Date(vote.created_at)
      const resetTime = new Date(lastReset)
      if (voteTime < resetTime) {
        return NextResponse.json({ hasVoted: false, staffId: null })
      }
    }

    return NextResponse.json({ 
      hasVoted: !!vote, 
      staffId: vote?.staff_id || null 
    })
  } catch (error) {
    console.error("Vote status error:", error)
    return NextResponse.json({ hasVoted: false, staffId: null })
  }
}
