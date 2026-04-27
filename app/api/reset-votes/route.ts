import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const ADMIN_CODE = "RESETPIM2024"

export async function POST(request: Request) {
  try {
    const { adminCode } = await request.json()

    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json({ error: "Kode admin tidak valid" }, { status: 403 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("votes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (error) {
      console.error("Error resetting votes:", error)
      return NextResponse.json({ error: "Gagal mereset voting" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Semua voting berhasil direset" })
  } catch (error) {
    console.error("Reset votes error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
