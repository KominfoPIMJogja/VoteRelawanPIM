import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const ADMIN_CODE = "RESETPIM2024"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const adminCode = formData.get("adminCode") as string
    const staffId = formData.get("staffId") as string
    const file = formData.get("photo") as File

    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json({ error: "Kode admin tidak valid" }, { status: 403 })
    }

    if (!file || !staffId) {
      return NextResponse.json({ error: "File dan Staff ID diperlukan" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File harus berupa gambar" }, { status: 400 })
    }

    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 2MB" }, { status: 400 })
    }

    const supabase = await createClient()

    const ext = file.name.split(".").pop() || "jpg"
    const fileName = `${staffId}-${Date.now()}.${ext}`

    // Delete old photo if exists
    const { data: staff } = await supabase
      .from("staff_members")
      .select("photo_url")
      .eq("id", staffId)
      .single()

    if (staff?.photo_url && staff.photo_url.includes("staff-photos")) {
      const pathParts = staff.photo_url.split("/staff-photos/")
      if (pathParts.length > 1) {
        await supabase.storage.from("staff-photos").remove([pathParts[1]])
      }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error: uploadError } = await supabase.storage
      .from("staff-photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage.from("staff-photos").getPublicUrl(fileName)

    // Update staff record with new photo URL
    const { error: updateError } = await supabase
      .from("staff_members")
      .update({ photo_url: urlData.publicUrl })
      .eq("id", staffId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, photo_url: urlData.publicUrl })
  } catch (error) {
    console.error("Upload photo error:", error)
    return NextResponse.json({ error: "Gagal mengupload foto" }, { status: 500 })
  }
}
