import Link from "next/link";
import { getCurrentUser } from "@/lib/userAuth";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="site-header sticky top-0 z-50 border-b border-line">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-7">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="brand-mark grid place-items-center w-8 h-8 rounded-md bg-accent text-onaccent font-display font-extrabold text-sm">
            R
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight text-text">
            rentzo<span className="text-accent">.</span>
          </span>
        </Link>

        <nav className="hidden sm:flex gap-1 font-semibold text-sm">
          <Link
            href="/#katalog"
            className="px-3 py-2 rounded-md text-soft hover:text-text hover:bg-surface2 transition-colors"
          >
            Katalog
          </Link>
          <Link
            href="/#cara"
            className="px-3 py-2 rounded-md text-soft hover:text-text hover:bg-surface2 transition-colors"
          >
            Cara Sewa
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <Link
              href="/profil"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold text-soft hover:text-text hover:bg-surface2 transition-colors"
            >
              <span className="grid place-items-center w-6 h-6 rounded-full bg-accent2 text-onaccent font-bold text-xs">
                {user.name[0]?.toUpperCase()}
              </span>
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link
              href="/masuk"
              className="px-3 py-1.5 rounded-md text-sm font-semibold text-soft hover:text-text hover:bg-surface2 transition-colors"
            >
              Masuk
            </Link>
          )}
          <Link
            href="/#katalog"
            className="inline-flex items-center font-bold text-sm px-4 py-1.5 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
          >
            Sewa sekarang
          </Link>
        </div>
      </div>
    </header>
  );
}
