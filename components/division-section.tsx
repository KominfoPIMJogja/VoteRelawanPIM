"use client"

import { StaffCard } from "./staff-card"
import { Users } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  division: string
  photo_url: string | null
}

interface DivisionSectionProps {
  title: string
  staff: StaffMember[]
  onVote: (staffId: string) => void
  isVoting: boolean
  hasVoted: boolean
  selectedStaffId: string | null
}

const divisionInfo: Record<string, { bg: string; gradient: string; icon: string }> = {
  BPH: { bg: "bg-[#1B5E20]", gradient: "from-[#1B5E20] to-[#2E7D32]", icon: "Badan Pengurus Harian" },
  MSDMO: { bg: "bg-[#2E7D32]", gradient: "from-[#2E7D32] to-[#43A047]", icon: "Manajemen SDM & Organisasi" },
  Sosial: { bg: "bg-[#F9A825]", gradient: "from-[#F9A825] to-[#FBC02D]", icon: "Divisi Sosial" },
  Kominfo: { bg: "bg-[#558B2F]", gradient: "from-[#558B2F] to-[#7CB342]", icon: "Komunikasi & Informasi" },
  Relawan: { bg: "bg-[#827717]", gradient: "from-[#827717] to-[#9E9D24]", icon: "Relawan Aktif" },
}

export function DivisionSection({
  title,
  staff,
  onVote,
  isVoting,
  hasVoted,
  selectedStaffId,
}: DivisionSectionProps) {
  const info = divisionInfo[title] || divisionInfo.BPH

  return (
    <section className="mb-12">
      {/* Division Header */}
      <div className={`mb-6 rounded-xl bg-gradient-to-r ${info.gradient} p-4 shadow-lg md:p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white md:text-2xl">
                Divisi {title}
              </h2>
              <p className="text-sm text-white/80">{info.icon}</p>
            </div>
          </div>
          <div className="rounded-full bg-white/20 px-4 py-2">
            <span className="text-lg font-bold text-white">{staff.length}</span>
            <span className="ml-1 text-sm text-white/80">Kandidat</span>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {staff.map((member) => (
          <StaffCard
            key={member.id}
            id={member.id}
            name={member.name}
            division={member.division}
            photoUrl={member.photo_url}
            onVote={onVote}
            isVoting={isVoting}
            hasVoted={hasVoted}
            isSelected={selectedStaffId === member.id}
          />
        ))}
      </div>
    </section>
  )
}
