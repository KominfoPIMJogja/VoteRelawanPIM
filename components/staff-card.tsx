"use client"

import { User, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface StaffCardProps {
  id: string
  name: string
  division: string
  photoUrl: string | null
  onVote: (staffId: string) => void
  isVoting: boolean
  hasVoted: boolean
  isSelected: boolean
}

export function StaffCard({
  id,
  name,
  division,
  photoUrl,
  onVote,
  isVoting,
  hasVoted,
  isSelected,
}: StaffCardProps) {
  return (
    <Card className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
      isSelected 
        ? "border-[#F9A825] bg-gradient-to-br from-[#F9A825]/20 to-[#F9A825]/5 shadow-xl ring-2 ring-[#F9A825]/50" 
        : "border-[#2E7D32]/20 bg-white hover:border-[#2E7D32]/40 hover:-translate-y-1"
    }`}>
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#F9A825] shadow-lg">
          <Check className="h-5 w-5 text-white" />
        </div>
      )}

      <CardContent className="p-4">
        {/* Photo */}
        <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-[#2E7D32]/30 bg-[#F5F5DC] shadow-inner md:h-32 md:w-32">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2E7D32] to-[#1B5E20]">
              <User className="h-14 w-14 text-[#F5F5DC] md:h-16 md:w-16" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="mb-1 text-base font-semibold text-[#1B5E20] line-clamp-2 md:text-lg">
            {name}
          </h3>
          <span className="inline-block rounded-full bg-[#2E7D32]/10 px-3 py-1 text-xs font-medium text-[#2E7D32]">
            {division}
          </span>
        </div>

        {/* Vote Button */}
        <div className="mt-4">
          <Button
            onClick={() => onVote(id)}
            disabled={isVoting || hasVoted}
            className={`w-full transition-all duration-300 ${
              isSelected
                ? "bg-[#F9A825] text-[#1B5E20] hover:bg-[#F9A825]/90 font-bold"
                : hasVoted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
            }`}
          >
            {isVoting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Memproses...
              </span>
            ) : isSelected ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                Terpilih!
              </span>
            ) : hasVoted ? (
              "Sudah Vote"
            ) : (
              "Vote"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
