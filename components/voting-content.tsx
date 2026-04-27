"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DivisionSection } from "./division-section"
import { CheckCircle, AlertCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StaffMember {
  id: string
  name: string
  division: string
  photo_url: string | null
}

interface VotingContentProps {
  staffByDivision: Record<string, StaffMember[]>
}

export function VotingContent({ staffByDivision }: VotingContentProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const hasAccess = localStorage.getItem("voting_access")
    if (!hasAccess) {
      router.push("/")
      return
    }
    setIsAuthorized(true)

    const votedStaffId = localStorage.getItem("pim_voted_staff_id")
    if (votedStaffId) {
      setHasVoted(true)
      setSelectedStaffId(votedStaffId)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("voting_access")
    localStorage.removeItem("access_code")
    router.push("/")
  }

  const handleVote = async (staffId: string) => {
    if (hasVoted || isVoting) return

    setIsVoting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staffId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal memberikan vote")
      }

      localStorage.setItem("pim_voted_staff_id", staffId)
      setHasVoted(true)
      setSelectedStaffId(staffId)
      setMessage({ type: "success", text: "Vote berhasil! Terima kasih telah berpartisipasi." })
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Terjadi kesalahan saat memberikan vote" 
      })
    } finally {
      setIsVoting(false)
    }
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2E7D32] border-t-transparent" />
      </div>
    )
  }

  const divisions = ["BPH", "MSDMO", "Sosial", "Kominfo", "Relawan"]

  return (
    <div>
      {/* Action Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32]/10">
              Lihat Hasil Voting
            </Button>
          </Link>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </Button>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-8 flex items-center gap-3 rounded-lg p-4 ${
          message.type === "success" 
            ? "bg-[#2E7D32]/10 text-[#1B5E20]" 
            : "bg-red-100 text-red-700"
        }`}>
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Voting Status */}
      {hasVoted && (
        <div className="mb-8 rounded-lg border-2 border-[#F9A825] bg-[#F9A825]/10 p-4 text-center">
          <p className="font-medium text-[#1B5E20]">
            Anda sudah memberikan vote. Terima kasih atas partisipasi Anda!
          </p>
        </div>
      )}

      {/* Division Sections */}
      {divisions.map((division) => (
        <DivisionSection
          key={division}
          title={division}
          staff={staffByDivision[division] || []}
          onVote={handleVote}
          isVoting={isVoting}
          hasVoted={hasVoted}
          selectedStaffId={selectedStaffId}
        />
      ))}
    </div>
  )
}
