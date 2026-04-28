"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

const ADMIN_CODE = "RESETPIM2024"
const DASHBOARD_CODES = ["PIM2024", "MUDAMENGABDI", "RELAWANJOGJA", "STAFFOFMONTH", "RESETPIM2024"]

export default function DashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Cek apakah sudah login voting atau sudah punya akses dashboard
    const hasVotingAccess = localStorage.getItem("voting_access")
    const hasDashboardAccess = localStorage.getItem("dashboard_access")
    if (hasVotingAccess || hasDashboardAccess) {
      setIsAuthorized(true)
    }
    setIsChecking(false)
  }, [])

  const handleLogin = () => {
    const input = code.trim().toUpperCase()
    if (DASHBOARD_CODES.includes(input)) {
      localStorage.setItem("dashboard_access", "true")
      setIsAuthorized(true)
      setError("")
    } else {
      setError("Kode tidak valid")
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
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B5E20]/10">
                <Lock className="h-8 w-8 text-[#1B5E20]" />
              </div>
            </div>
            <h1 className="mb-2 text-center text-2xl font-bold text-[#1B5E20]">Dashboard</h1>
            <p className="mb-6 text-center text-sm text-gray-500">
              Masukkan kode akses untuk melihat hasil voting
            </p>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Masukkan kode akses..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="text-center uppercase tracking-widest"
              />
              {error && <p className="text-center text-sm text-red-600">{error}</p>}
              <Button
                onClick={handleLogin}
                className="w-full bg-[#1B5E20] text-white hover:bg-[#2E7D32]"
              >
                Masuk
              </Button>
            </div>
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
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
