import Link from "next/link";
import { WA_DISPLAY } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="bg-surface border-t border-line mt-0">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-8">
        <div className="flex flex-wrap justify-between gap-8 pb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-7 h-7 rounded-md bg-accent text-onaccent font-display font-extrabold text-sm">
                R
              </span>
              <span className="font-display font-extrabold text-lg text-text">Rentzo</span>
            </div>
            <p className="mt-2.5 text-soft max-w-[32ch] text-sm">
              Rental akun Mobile Legends online. Buka 24 jam, setiap hari.
            </p>
          </div>
          <div>
            <p className="font-bold text-sm mb-2 text-text">Kontak</p>
            <p className="text-soft text-sm">
              WhatsApp: {WA_DISPLAY}
              <br />
              Instagram: @rentzo.id
            </p>
          </div>
        </div>
        <div className="border-t border-line pt-5 flex flex-wrap justify-between gap-2.5 text-xs text-faint">
          <p className="max-w-[70ch]">
            Rentzo tidak berafiliasi dengan Moonton. Mobile Legends dan seluruh merek terkait milik pemiliknya masing-masing.
          </p>
          <p>
            © 2026 Rentzo · <Link href="/admin/login" className="underline underline-offset-2 hover:text-soft">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
