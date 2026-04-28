"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ADMIN_CODE = "RESETPIM2024"

export default function DashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminInput, setAdminInput] = useState("")
  const [adminError, setAdminError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Cek dari server apakah device ini sudah vote
    const checkAccess = async () => {
      const hasVotingAccess = localStorage.getItem("voting_access")
      
      if (!hasVotingAccess) {
        setIsChecking(false)
        return
      }

      try {
        const res = await fetch("/api/vote-status")
        const data = await res.json()
        if (data.hasVoted) {
          setIsAuthorized(true)
        }
      } catch {
        // fallback ke localStorage
        const hasVoted = localStorage.getItem("pim_voted_staff_id")
        if (hasVoted) setIsAuthorized(true)
      }
      setIsChecking(false)
    }

    checkAccess()
  }, [])

  const handleAdminLogin = () => {
    if (adminInput.trim().toUpperCase() === ADMIN_CODE) {
      setIsAuthorized(true)
      setAdminError("")
    } else {
      setAdminError("Kode admin tidak valid")
    }
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5DC]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2E7D32] border-t-transparent" />
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F5F5DC]">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B5E20]/10">
                <Lock className="h-8 w-8 text-[#1B5E20]" />
              </div>
            </div>

            {!showAdminLogin ? (
              <>
                <h1 className="mb-2 text-2xl font-bold text-[#1B5E20]">Akses Ditolak</h1>
                <p className="mb-6 text-sm text-gray-500">
                  Kamu harus <strong>login dan memberikan vote</strong> terlebih dahulu untuk melihat hasil dashboard.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/")}
                    className="w-full bg-[#1B5E20] text-white hover:bg-[#2E7D32]"
                  >
                    Ke Halaman Voting
                  </Button>
                  <button
                    onClick={() => setShowAdminLogin(true)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Login sebagai Admin
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="mb-2 text-2xl font-bold text-[#1B5E20]">Login Admin</h1>
                <p className="mb-6 text-sm text-gray-500">Masukkan kode admin untuk mengakses dashboard.</p>
                <div className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Kode admin..."
                    value={adminInput}
                    onChange={(e) => setAdminInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                    className="text-center uppercase tracking-widest"
                  />
                  {adminError && <p className="text-sm text-red-600">{adminError}</p>}
                  <Button
                    onClick={handleAdminLogin}
                    className="w-full bg-[#1B5E20] text-white hover:bg-[#2E7D32]"
                  >
                    Masuk
                  </Button>
                  <button
                    onClick={() => setShowAdminLogin(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Kembali
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5DC]">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#1B5E20] py-12 md:py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="container relative mx-auto px-4 text-center">
            <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
              Dashboard Hasil Voting
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-[#F5F5DC]/90">
              Lihat hasil voting Staff of the Month secara real-time
            </p>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12">
          <DashboardContent />
        </section>
      </main>
      <Footer />
    </div>
  )
}
