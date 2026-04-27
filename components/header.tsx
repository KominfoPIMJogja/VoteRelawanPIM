import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2E7D32]/20 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        {/* Logo dan Nama Organisasi */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/pim-logo.png"
            alt="BPC Pelita Intan Muda Yogyakarta"
            width={50}
            height={50}
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-sm md:text-base font-bold text-[#1B5E20] leading-tight">
              BPC Pelita Intan Muda
            </h1>
            <p className="text-xs md:text-sm text-[#2E7D32]">Yogyakarta</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 md:gap-6">
          <Link 
            href="/vote" 
            className="text-sm font-medium text-[#1B5E20] hover:text-[#F9A825] transition-colors"
          >
            Vote
          </Link>
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-[#1B5E20] hover:text-[#F9A825] transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        {/* Logo Muda Mengabdi */}
        <div className="flex items-center">
          <Image
            src="/images/muda-mengabdi.png"
            alt="Muda Mengabdi"
            width={140}
            height={50}
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  )
}
