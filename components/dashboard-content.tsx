"use client"

import { useState, useEffect, useCallback } from "react"
import { Trophy, Medal, Award, User, Users, TrendingUp, RefreshCw, AlertTriangle, CheckCircle, Wifi, WifiOff, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface VoteResult {
  id: string
  name: string
  division: string
  photo_url: string | null
  vote_count: number
}

const divisionColors: Record<string, string> = {
  BPH: "bg-[#1B5E20]",
  Sosial: "bg-[#F9A825]",
  MSDMO: "bg-[#2E7D32]",
  Kominfo: "bg-[#558B2F]",
  Relawan: "bg-[#827717]",
}

const DIVISIONS = ["BPH", "MSDMO", "Sosial", "Kominfo", "Relawan"]
const ADMIN_CODE = "RESETPIM2024"

export function DashboardContent() {
  const [results, setResults] = useState<VoteResult[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [selectedDivision, setSelectedDivision] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isRealtime, setIsRealtime] = useState(false)

  // Admin
  const [adminCode, setAdminCode] = useState("")
  const [isAdminVerified, setIsAdminVerified] = useState(false)
  const [adminError, setAdminError] = useState("")

  // Reset
  const [isResetting, setIsResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const [staffRes, votesRes] = await Promise.all([
      supabase.from("staff_members").select("*"),
      supabase.from("votes").select("staff_id"),
    ])
    const staffMembers = staffRes.data || []
    const votes = votesRes.data || []
    const voteCounts = votes.reduce((acc, vote) => {
      acc[vote.staff_id] = (acc[vote.staff_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const combined: VoteResult[] = staffMembers.map((staff) => ({
      id: staff.id,
      name: staff.name,
      division: staff.division,
      photo_url: staff.photo_url,
      vote_count: voteCounts[staff.id] || 0,
    }))
    combined.sort((a, b) => b.vote_count - a.vote_count)
    setResults(combined)
    setTotalVotes(votes.length)
    setIsLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel("realtime-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "votes" }, () => { fetchData() })
      .on("postgres_changes", { event: "*", schema: "public", table: "staff_members" }, () => { fetchData() })
      .subscribe((status) => { setIsRealtime(status === "SUBSCRIBED") })
    return () => { supabase.removeChannel(channel) }
  }, [fetchData])

  const filteredResults = selectedDivision === "all" ? results : results.filter((r) => r.division === selectedDivision)
  const top3 = results.slice(0, 3)
  const topPerDivision = DIVISIONS.map((division) => ({
    division,
    top: results.filter((r) => r.division === division)[0] || null,
  }))

  const handleAdminVerify = () => {
    if (adminCode.trim().toUpperCase() === ADMIN_CODE) {
      setIsAdminVerified(true)
      setAdminError("")
    } else {
      setAdminError("Kode admin tidak valid")
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    setResetMessage(null)
    try {
      const res = await fetch("/api/reset-votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode }),
      })
      const data = await res.json()
      if (res.ok) {
        setResetMessage({ type: "success", text: data.message })
        setTimeout(() => { setIsResetDialogOpen(false); setResetMessage(null) }, 1500)
      } else {
        setResetMessage({ type: "error", text: data.error })
      }
    } catch {
      setResetMessage({ type: "error", text: "Terjadi kesalahan. Coba lagi." })
    }
    setIsResetting(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2E7D32] border-t-transparent" />
          <p className="text-[#2E7D32]">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#2E7D32]/20 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#2E7D32]">Total Partisipan</CardTitle>
            <Users className="h-4 w-4 text-[#2E7D32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1B5E20]">{totalVotes}</div>
            <p className="text-xs text-[#2E7D32]/70">orang telah memberikan suara</p>
          </CardContent>
        </Card>
        <Card className="border-[#2E7D32]/20 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#2E7D32]">Kandidat</CardTitle>
            <User className="h-4 w-4 text-[#2E7D32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1B5E20]">{results.length}</div>
            <p className="text-xs text-[#2E7D32]/70">staff dari 5 divisi</p>
          </CardContent>
        </Card>
        <Card className="border-[#2E7D32]/20 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#2E7D32]">Rata-rata Vote</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1B5E20]">
              {results.length > 0 ? (totalVotes / results.length).toFixed(1) : 0}
            </div>
            <p className="text-xs text-[#2E7D32]/70">suara per kandidat</p>
          </CardContent>
        </Card>
        <Card className={`border-2 ${isRealtime ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Realtime</CardTitle>
            {isRealtime ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-gray-400" />}
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-2 ${isRealtime ? "text-green-600" : "text-gray-400"}`}>
              <span className={`h-2 w-2 rounded-full ${isRealtime ? "animate-pulse bg-green-500" : "bg-gray-300"}`} />
              <span className="font-medium">{isRealtime ? "Live" : "Offline"}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Update otomatis</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Panel - Reset Only */}
      <Card className="border-[#F9A825]/30 bg-[#F9A825]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1B5E20]">
            <Settings className="h-5 w-5 text-[#F9A825]" />
            Panel Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAdminVerified ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <p className="mb-2 text-sm text-[#2E7D32]">Masukkan kode admin untuk mereset voting:</p>
                <Input
                  type="password"
                  placeholder="Kode admin..."
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminVerify()}
                  className="max-w-xs uppercase tracking-widest"
                />
                {adminError && <p className="mt-1 text-xs text-red-600">{adminError}</p>}
              </div>
              <Button onClick={handleAdminVerify} className="bg-[#1B5E20] text-white hover:bg-[#2E7D32]">
                Verifikasi
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Admin terverifikasi</span>
              </div>
              <Dialog open={isResetDialogOpen} onOpenChange={(o) => { setIsResetDialogOpen(o); if (!o) setResetMessage(null) }}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Voting
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Reset Semua Voting
                    </DialogTitle>
                    <DialogDescription>
                      Tindakan ini akan menghapus <strong>semua data voting</strong> dan tidak dapat dibatalkan. Semua device akan bisa vote kembali.
                    </DialogDescription>
                  </DialogHeader>
                  {resetMessage && (
                    <p className={`text-sm text-center py-2 ${resetMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                      {resetMessage.text}
                    </p>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>Batal</Button>
                    <Button variant="destructive" onClick={handleReset} disabled={isResetting}>
                      {isResetting ? "Mereset..." : "Ya, Reset Semua"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top 3 */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-[#1B5E20]">Top 3 Staff of the Month</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {top3.length > 0 ? top3.map((result, index) => (
            <Card key={result.id} className={`relative overflow-hidden border-2 ${
              index === 0 ? "border-[#F9A825] bg-gradient-to-br from-[#F9A825]/20 to-white"
              : index === 1 ? "border-gray-400 bg-gradient-to-br from-gray-200/50 to-white"
              : "border-amber-700 bg-gradient-to-br from-amber-700/20 to-white"
            }`}>
              <div className="absolute right-2 top-2">
                {index === 0 ? <Trophy className="h-8 w-8 text-[#F9A825]" />
                 : index === 1 ? <Medal className="h-8 w-8 text-gray-400" />
                 : <Award className="h-8 w-8 text-amber-700" />}
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-[#2E7D32]/30 bg-[#F5F5DC]">
                    {result.photo_url
                      ? <img src={result.photo_url} alt={result.name} className="h-full w-full object-cover" />
                      : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2E7D32] to-[#1B5E20]"><User className="h-8 w-8 text-[#F5F5DC]" /></div>
                    }
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#1B5E20]">{result.name}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white ${divisionColors[result.division]}`}>
                      {result.division}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#2E7D32]/20 pt-4">
                  <span className="text-sm text-[#2E7D32]">Total Suara</span>
                  <span className="text-2xl font-bold text-[#1B5E20]">{result.vote_count}</span>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="col-span-3 border-[#2E7D32]/20 bg-white">
              <CardContent className="py-12 text-center"><p className="text-[#2E7D32]/50">Belum ada voting</p></CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Top per division */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-[#1B5E20]">Terbaik Per Divisi</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {topPerDivision.map(({ division, top }) => (
            <Card key={division} className="border-[#2E7D32]/20 bg-white">
              <CardHeader className="pb-2">
                <span className={`inline-block self-start rounded-full px-3 py-1 text-xs font-medium text-white ${divisionColors[division]}`}>
                  {division}
                </span>
              </CardHeader>
              <CardContent>
                {top && top.vote_count > 0 ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 h-12 w-12 overflow-hidden rounded-full border-2 border-[#2E7D32]/30 bg-[#F5F5DC]">
                      {top.photo_url
                        ? <img src={top.photo_url} alt={top.name} className="h-full w-full object-cover" />
                        : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2E7D32] to-[#1B5E20]"><User className="h-6 w-6 text-[#F5F5DC]" /></div>
                      }
                    </div>
                    <p className="font-medium text-[#1B5E20] line-clamp-1">{top.name}</p>
                    <p className="text-lg font-bold text-[#F9A825]">{top.vote_count} suara</p>
                  </div>
                ) : (
                  <p className="text-center text-sm text-[#2E7D32]/50">Belum ada voting</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Results - no admin actions */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-[#1B5E20]">Semua Hasil Voting</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 flex flex-wrap gap-2 bg-transparent">
            <TabsTrigger value="all" onClick={() => setSelectedDivision("all")}
              className="rounded-full border border-[#2E7D32]/30 bg-white px-4 py-2 data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white">
              Semua
            </TabsTrigger>
            {DIVISIONS.map((division) => (
              <TabsTrigger key={division} value={division} onClick={() => setSelectedDivision(division)}
                className="rounded-full border border-[#2E7D32]/30 bg-white px-4 py-2 data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white">
                {division}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={selectedDivision} className="mt-0">
            <div className="space-y-3">
              {filteredResults.length === 0 ? (
                <Card className="border-[#2E7D32]/20 bg-white">
                  <CardContent className="py-10 text-center text-[#2E7D32]/50">Tidak ada anggota di divisi ini</CardContent>
                </Card>
              ) : filteredResults.map((result, index) => {
                const percentage = totalVotes > 0 ? (result.vote_count / totalVotes) * 100 : 0
                return (
                  <Card key={result.id} className="border-[#2E7D32]/20 bg-white">
                    <CardContent className="flex items-center gap-3 py-4">
                      <span className="w-8 flex-shrink-0 text-center text-lg font-bold text-[#2E7D32]/50">#{index + 1}</span>
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#2E7D32]/30 bg-[#F5F5DC]">
                        {result.photo_url
                          ? <img src={result.photo_url} alt={result.name} className="h-full w-full object-cover" />
                          : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2E7D32] to-[#1B5E20]"><User className="h-6 w-6 text-[#F5F5DC]" /></div>
                        }
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-[#1B5E20]">{result.name}</p>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${divisionColors[result.division]}`}>
                            {result.division}
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#2E7D32]/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#2E7D32] to-[#F9A825] transition-all duration-500"
                            style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xl font-bold text-[#1B5E20]">{result.vote_count}</p>
                        <p className="text-xs text-[#2E7D32]/70">{percentage.toFixed(1)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
