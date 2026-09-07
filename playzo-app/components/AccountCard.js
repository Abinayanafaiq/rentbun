import Link from "next/link";
import { rp } from "@/lib/format";

export default function AccountCard({ account }) {
  const ready = account.status === "ready";

  return (
    <article className="account-card rental-card group flex flex-col bg-surface overflow-hidden border border-line hover:border-line2 transition-colors">
      <Link
        href={`/akun/${account.id}`}
        className="rental-card-cover relative block aspect-video overflow-hidden bg-surface2"
        aria-label={`Lihat detail ${account.title}`}
      >
        {account.coverUrl ? (
          <img
            src={account.coverUrl}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
              ready ? "opacity-90 group-hover:opacity-100" : "opacity-50 grayscale"
            }`}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent2/50 to-bg">
            <span className="font-display font-extrabold text-4xl text-text">ML</span>
          </div>
        )}

        <span className="absolute inset-0 bg-gradient-to-t from-bg/55 via-transparent to-bg/15" aria-hidden="true" />

        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
            ready ? "bg-ok text-onaccent" : "bg-bg/85 text-soft"
          }`}
        >
          {ready && <span className="w-1.5 h-1.5 rounded-full bg-onaccent animate-pulse" aria-hidden="true" />}
          {ready ? "Tersedia" : "Sedang disewa"}
        </span>
        <span className="absolute top-3 right-3 rounded-full border border-white/15 bg-bg/75 px-2.5 py-1 text-[10px] font-bold text-text backdrop-blur-md">
          {account.rank}
        </span>
      </Link>

      <div className="flex flex-col p-4 sm:p-5 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/akun/${account.id}`}
              className="font-display font-extrabold text-base leading-snug text-text hover:text-accent transition-colors line-clamp-2"
            >
              {account.title}
            </Link>
            <p className="mt-1 text-xs text-faint">Rental akun Mobile Legends</p>
          </div>
          <span className="shrink-0 text-right">
            <small className="block text-[10px] text-faint">Mulai dari</small>
            <strong className="block font-display text-base text-text">{rp(account.price_per_hour)}</strong>
            <small className="text-[10px] text-faint">per jam</small>
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-soft">
            <span className="rental-stat-icon" aria-hidden="true">+</span>
            <span>{account.heroes} hero</span>
            <span className="text-line2">/</span>
            <span>{account.skins} skin</span>
          </div>
          {ready ? (
            <Link
              href={`/sewa/${account.id}`}
              className="shrink-0 font-bold text-xs px-4 py-2.5 rounded-lg bg-accent text-onaccent hover:bg-accent2 transition-colors"
            >
              Sewa
            </Link>
          ) : (
            <span className="shrink-0 font-bold text-xs px-4 py-2.5 rounded-lg bg-surface2 text-faint cursor-not-allowed">
              Disewa
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
