import Link from "next/link";
import { getCurrentUser } from "@/lib/userAuth";
import { getDict, getLang } from "@/lib/i18n";
import { photoUrl } from "@/lib/storage";
import LangToggle from "@/components/LangToggle";

export default async function SiteHeader() {
  const [user, t, lang] = await Promise.all([getCurrentUser(), getDict(), getLang()]);
  const logoUrl = await photoUrl("branding/rentzo-logo.png");

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center gap-3 sm:gap-7">
        <Link href="/" className="flex items-center gap-2.5">
          <img src={logoUrl} alt="Rentzo" className="brand-logo" />
          <span className="sr-only">Rentzo</span>
        </Link>

        <nav className="hidden sm:flex gap-1 font-semibold text-sm">
          <Link
            href="/#katalog"
            className="px-3 py-2 rounded-full text-soft hover:text-text hover:bg-surface2 transition-colors"
          >
            {t.header.catalog}
          </Link>
          <Link
            href="/#cara"
            className="px-3 py-2 rounded-full text-soft hover:text-text hover:bg-surface2 transition-colors"
          >
            {t.header.howTo}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LangToggle lang={lang} />
          {user ? (
            <Link
              href="/profil"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-soft hover:text-text hover:bg-surface2 transition-colors"
            >
              <span className="grid place-items-center w-6 h-6 rounded-full bg-accent2 text-onaccent font-bold text-xs">
                {user.name[0]?.toUpperCase()}
              </span>
              <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              href="/masuk"
              className="px-3 py-1.5 rounded-full text-sm font-semibold text-soft hover:text-text hover:bg-surface2 transition-colors"
            >
              {t.header.login}
            </Link>
          )}
          <Link
            href="/#katalog"
            className="inline-flex items-center font-bold text-sm px-4 py-2 rounded-full bg-text text-bg hover:bg-accent transition-colors"
          >
              <span className="sm:hidden">{t.header.rent}</span><span className="hidden sm:inline">{t.header.rentNow}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
