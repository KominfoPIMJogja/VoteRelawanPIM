import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
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
