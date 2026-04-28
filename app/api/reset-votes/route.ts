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

    // Hapus semua votes
    const { error } = await supabase
      .from("votes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (error) {
      console.error("Error resetting votes:", error)
      return NextResponse.json({ error: "Gagal mereset voting" }, { status: 500 })
    }

    // Catat waktu reset — semua device yang voted sebelum waktu ini boleh vote lagi
    const resetTime = new Date().toISOString()
    
    // Simpan reset_time ke tabel settings (buat tabel ini di Supabase)
    await supabase
      .from("vote_settings")
      .upsert({ key: "last_reset", value: resetTime })

    return NextResponse.json({ 
      success: true, 
      message: "Semua voting berhasil direset",
      resetTime 
    })
  } catch (error) {
    console.error("Reset votes error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
