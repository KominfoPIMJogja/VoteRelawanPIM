"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, ArrowRight, Users, Award, Heart } from "lucide-react"

// Kode unik untuk akses voting - bisa diganti sesuai kebutuhan
const VALID_CODES = ["PIM2024", "MUDAMENGABDI", "RELAWANJOGJA", "STAFFOFMONTH"]

export default function LoginPage() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (VALID_CODES.includes(code.toUpperCase().trim())) {
      localStorage.setItem("voting_access", "true")
      localStorage.setItem("access_code", code.toUpperCase().trim())
      router.push("/vote")
    } else {
      setError("Kode akses tidak valid. Silakan coba lagi.")
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#1B5E20]">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-group.jpg"
            alt="BPC Pelita Intan Muda Yogyakarta"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/90 via-[#1B5E20]/70 to-[#1B5E20]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/pim-logo.png"
                alt="Logo PIM"
                width={50}
                height={50}
                className="h-12 w-12 md:h-14 md:w-14"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-white">BPC Pelita Intan Muda</p>
                <p className="text-xs text-white/80">Yogyakarta</p>
              </div>
            </div>
            <Image
              src="/images/muda-mengabdi.png"
              alt="Muda Mengabdi"
              width={140}
              height={50}
              className="h-10 w-auto md:h-12"
            />
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-8">
              {/* Title */}
              <div className="text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F9A825]/20 px-4 py-2 backdrop-blur-sm">
                  <Award className="h-5 w-5 text-[#F9A825]" />
                  <span className="text-sm font-medium text-white">Staff of the Month</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                  Vote for Your
                  <span className="block text-[#F9A825]">Favorite Staff</span>
                </h1>
                <p className="mt-4 text-lg text-white/80">
                  Pilih relawan terbaik bulan ini dari BPC Pelita Intan Muda Yogyakarta
                </p>
              </div>

              {/* Login Card */}
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-8">
                <div className="mb-6 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F9A825]/20">
                    <Lock className="h-8 w-8 text-[#F9A825]" />
                  </div>
                </div>
                <h2 className="mb-2 text-center text-xl font-semibold text-white">
                  Masukkan Kode Akses
                </h2>
                <p className="mb-6 text-center text-sm text-white/70">
                  Gunakan kode unik yang telah diberikan untuk mengakses halaman voting
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Masukkan kode akses..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="h-12 border-white/20 bg-white/10 text-center text-lg font-medium uppercase tracking-widest text-white placeholder:text-white/50 focus:border-[#F9A825] focus:ring-[#F9A825]"
                      autoComplete="off"
                    />
                    {error && (
                      <p className="mt-2 text-center text-sm text-red-300">{error}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={!code.trim() || isLoading}
                    className="h-12 w-full bg-[#F9A825] text-lg font-semibold text-[#1B5E20] hover:bg-[#F9A825]/90"
                  >
                    {isLoading ? (
                      "Memverifikasi..."
                    ) : (
                      <>
                        Masuk ke Voting
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                  <Users className="mx-auto mb-2 h-6 w-6 text-[#F9A825]" />
                  <p className="text-2xl font-bold text-white">45</p>
                  <p className="text-xs text-white/70">Kandidat</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                  <Award className="mx-auto mb-2 h-6 w-6 text-[#F9A825]" />
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-xs text-white/70">Divisi</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                  <Heart className="mx-auto mb-2 h-6 w-6 text-[#F9A825]" />
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-xs text-white/70">Vote</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="p-4 text-center">
            <p className="text-sm text-white/60">
              &copy; 2024 BPC Pelita Intan Muda Yogyakarta. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </main>
  )
}
