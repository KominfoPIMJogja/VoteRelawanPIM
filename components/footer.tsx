import Image from "next/image"
import { Instagram } from "lucide-react"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="w-full border-t border-[#2E7D32]/20 bg-[#1B5E20] text-[#F5F5DC]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Logo dan Info */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-3">
              <Image
                src="/images/pim-logo.png"
                alt="BPC Pelita Intan Muda Yogyakarta"
                width={40}
                height={40}
                className="h-10 w-10 object-contain brightness-0 invert"
              />
              <div>
                <h3 className="font-bold text-[#F9A825]">BPC Pelita Intan Muda</h3>
                <p className="text-sm text-[#F5F5DC]/80">Yogyakarta</p>
              </div>
            </div>
            <p className="text-sm text-center md:text-left text-[#F5F5DC]/70">
              Muda Mengabdi, Muda Menginspirasi
            </p>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-[#F9A825]">Ikuti Kami</p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/pelitaintanmuda_yogyakarta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#F5F5DC] hover:text-[#F9A825] transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">@pelitaintanmuda_yogyakarta</span>
              </a>
              <a
                href="https://tiktok.com/@pelitaintanmudajogja"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#F5F5DC] hover:text-[#F9A825] transition-colors"
              >
                <TikTokIcon className="h-5 w-5" />
                <span className="text-sm">@pelitaintanmudajogja</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#F5F5DC]/20 pt-4 text-center">
          <p className="text-xs text-[#F5F5DC]/60">
            &copy; {new Date().getFullYear()} BPC Pelita Intan Muda Yogyakarta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
