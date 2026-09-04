import Link from "next/link";
import { rp } from "@/lib/format";

export default function AccountCard({ account }) {
  const ready = account.status === "ready";

  return (
    <article className="group flex flex-col bg-surface rounded-sm overflow-hidden border border-line hover:border-accent/60 transition-colors">
      {/* Thumbnail ala preview stream */}
      <Link
        href={`/akun/${account.id}`}
        className="relative block aspect-video overflow-hidden bg-surface2"
        aria-label={`Lihat detail ${account.title}`}
      >
        {account.coverUrl ? (
          <img
            src={account.coverUrl}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.05] ${
              ready ? "opacity-90 group-hover:opacity-100" : "opacity-50 grayscale"
            }`}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent2/50 to-bg">
            <span className="font-display font-extrabold text-4xl text-text">ML</span>
          </div>
        )}

        {/* Gradien bawah biar teks overlay kebaca */}
        <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg/90 to-transparent" aria-hidden="true" />

        {/* Badge LIVE / offline */}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-bold ${
            ready ? "bg-live text-onaccent" : "bg-bg/80 text-faint"
          }`}
        >
          {ready && <span className="w-1.5 h-1.5 rounded-full bg-onaccent animate-pulse" aria-hidden="true" />}
          {ready ? "LIVE" : "OFFLINE"}
        </span>

        {/* Harga di overlay */}
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-bg/85 px-2 py-0.5 text-sm font-bold text-text backdrop-blur-sm">
          {rp(account.price_per_hour)}
          <span className="font-body font-semibold text-xs text-soft">/jam</span>
        </span>
      </Link>

      {/* Info channel */}
      <div className="flex gap-3 p-4 flex-1">
        <span className="grid place-items-center w-10 h-10 flex-none rounded-md bg-gradient-to-br from-accent to-accent2 text-onaccent font-display font-extrabold text-sm">
          {account.rank[0]?.toUpperCase()}
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <Link
            href={`/akun/${account.id}`}
            className="font-display font-bold text-[0.95rem] leading-snug text-text hover:text-accent transition-colors line-clamp-2"
          >
            {account.title}
          </Link>
          <p className="text-xs text-soft mt-1 line-clamp-1">
            {account.rank} · {account.heroes} hero · {account.skins} skin
          </p>

          <div className="flex items-center justify-between gap-3 mt-auto pt-3">
            <span className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-lg text-text">{rp(account.price_per_hour)}</span>
              <span className="font-body font-semibold text-xs text-soft">/jam</span>
            </span>
            {ready ? (
              <Link
                href={`/sewa/${account.id}`}
                className="font-bold text-sm px-4 py-1.5 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
              >
                Sewa
              </Link>
            ) : (
              <span className="font-bold text-sm px-4 py-1.5 rounded-md border border-line/60 text-faint cursor-not-allowed">
                Disewa
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
