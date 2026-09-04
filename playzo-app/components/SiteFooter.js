import Link from "next/link";
import { WA_DISPLAY } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-paper mt-0">
      <div className="max-w-6xl mx-auto px-5 pt-12 pb-8">
        <div className="flex flex-wrap justify-between gap-8 pb-8">
          <div>
            <Link href="/" className="font-display font-extrabold text-2xl text-paper">
              Rentzo<span className="text-red">!</span>
            </Link>
            <p className="mt-2.5 text-paper/70 max-w-[32ch]">
              Rental akun Mobile Legends online. Buka 24 jam, setiap hari.
            </p>
          </div>
          <div>
            <p className="font-bold mb-2">Kontak</p>
            <p className="text-paper/85">
              WhatsApp: {WA_DISPLAY}
              <br />
              Instagram: @rentzo.id
            </p>
          </div>
        </div>
        <div className="border-t border-paper/20 pt-5 flex flex-wrap justify-between gap-2.5 text-sm text-paper/55">
          <p className="max-w-[70ch]">
            Rentzo tidak berafiliasi dengan Moonton. Mobile Legends dan seluruh
            merek terkait milik pemiliknya masing-masing.
          </p>
          <p>
            © 2026 Rentzo · <Link href="/admin/login" className="underline underline-offset-2">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
