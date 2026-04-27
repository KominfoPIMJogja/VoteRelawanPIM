import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { staffId } = await request.json()

    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID diperlukan" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const headersList = await headers()

    // Get a unique identifier for the voter (using IP + User Agent)
    const forwarded = headersList.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"
    
    // Create a simple hash-like identifier
    const voterIdentifier = Buffer.from(`${ip}-${userAgent}`).toString("base64").slice(0, 50)

    // Check if staff exists
    const { data: staff, error: staffError } = await supabase
      .from("staff_members")
      .select("id")
      .eq("id", staffId)
      .single()

    if (staffError || !staff) {
      return NextResponse.json(
        { error: "Staff tidak ditemukan" },
        { status: 404 }
      )
    }

    // Try to insert vote
    const { error: voteError } = await supabase
      .from("votes")
      .insert({
        staff_id: staffId,
        voter_identifier: voterIdentifier,
      })

    if (voteError) {
      // Check if it's a unique constraint violation
      if (voteError.code === "23505") {
        return NextResponse.json(
          { error: "Anda sudah memberikan vote sebelumnya" },
          { status: 400 }
        )
      }
      throw voteError
    }

    return NextResponse.json({ success: true, message: "Vote berhasil!" })
  } catch (error) {
    console.error("Vote error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
