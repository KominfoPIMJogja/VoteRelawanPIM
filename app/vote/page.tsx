import { createClient } from "@/lib/supabase/server"
import { VotingContent } from "@/components/voting-content"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export const dynamic = "force-dynamic"

interface StaffMember {
  id: string
  name: string
  division: string
  photo_url: string | null
}

async function getStaffMembers(): Promise<StaffMember[]> {
  const supabase = await createClient()
  const { data: staffMembers, error } = await supabase
    .from("staff_members")
    .select("*")
    .order("name")
  if (error) {
    console.error("Error fetching staff:", error)
    return []
  }
  return staffMembers || []
}

export default async function VotePage() {
  const staffMembers = await getStaffMembers()
  const divisions = ["BPH", "MSDMO", "Sosial", "Kominfo", "Relawan"]
  const staffByDivision = divisions.reduce((acc, division) => {
    acc[division] = staffMembers.filter((staff) => staff.division === division)
    return acc
  }, {} as Record<string, StaffMember[]>)

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <Header />
      <div className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0">
          <Image src="/images/hero-group.jpg" alt="BPC Pelita Intan Muda Yogyakarta" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/90 via-[#1B5E20]/80 to-[#1B5E20]/90" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F9A825]/20 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm font-medium text-[#F9A825]">Voting Periode Aktif</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">Staff of the Month</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            Pilih satu kandidat terbaik dari seluruh divisi. Setiap orang hanya bisa memberikan satu suara.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="text-xl font-bold text-white">{staffMembers.length}</span>
              <span className="ml-2 text-white/80">Kandidat</span>
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="text-xl font-bold text-white">5</span>
              <span className="ml-2 text-white/80">Divisi</span>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <VotingContent staffByDivision={staffByDivision} />
      </main>
      <Footer />
    </div>
  )
}
