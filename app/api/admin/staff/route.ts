import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const ADMIN_CODE = "RESETPIM2024"

export async function POST(request: NextRequest) {
  try {
    const { adminCode, name, division, photo_url } = await request.json()

    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json({ error: "Kode admin tidak valid" }, { status: 403 })
    }

    if (!name || !division) {
      return NextResponse.json({ error: "Nama dan divisi wajib diisi" }, { status: 400 })
    }

    const validDivisions = ["BPH", "MSDMO", "Sosial", "Kominfo", "Relawan"]
    if (!validDivisions.includes(division)) {
      return NextResponse.json({ error: "Divisi tidak valid" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("staff_members")
      .insert({ name: name.trim(), division, photo_url: photo_url || null })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, staff: data })
  } catch (error) {
    console.error("Add staff error:", error)
    return NextResponse.json({ error: "Gagal menambahkan anggota" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { adminCode, staffId } = await request.json()

    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json({ error: "Kode admin tidak valid" }, { status: 403 })
    }

    if (!staffId) {
      return NextResponse.json({ error: "Staff ID diperlukan" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get photo_url before deleting to clean up storage
    const { data: staff } = await supabase
      .from("staff_members")
      .select("photo_url")
      .eq("id", staffId)
      .single()

    // Delete from storage if photo exists in supabase storage
    if (staff?.photo_url && staff.photo_url.includes("staff-photos")) {
      const pathParts = staff.photo_url.split("/staff-photos/")
      if (pathParts.length > 1) {
        await supabase.storage.from("staff-photos").remove([pathParts[1]])
      }
    }

    const { error } = await supabase.from("staff_members").delete().eq("id", staffId)

    if (error) throw error

    return NextResponse.json({ success: true, message: "Anggota berhasil dihapus" })
  } catch (error) {
    console.error("Delete staff error:", error)
    return NextResponse.json({ error: "Gagal menghapus anggota" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { adminCode, staffId, name, division, photo_url } = await request.json()

    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json({ error: "Kode admin tidak valid" }, { status: 403 })
    }

    if (!staffId) {
      return NextResponse.json({ error: "Staff ID diperlukan" }, { status: 400 })
    }

    const supabase = await createClient()

    const updateData: Record<string, string> = {}
    if (name) updateData.name = name.trim()
    if (division) updateData.division = division
    if (photo_url !== undefined) updateData.photo_url = photo_url

    const { data, error } = await supabase
      .from("staff_members")
      .update(updateData)
      .eq("id", staffId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, staff: data })
  } catch (error) {
    console.error("Update staff error:", error)
    return NextResponse.json({ error: "Gagal mengupdate anggota" }, { status: 500 })
  }
}
