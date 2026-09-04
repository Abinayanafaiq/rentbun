import Link from "next/link";
import { rp } from "@/lib/format";

export default function AccountCard({ account }) {
  const ready = account.status === "ready";

  return (
    <article className="account-card group flex flex-col bg-surface rounded-sm overflow-hidden border border-line hover:border-accent/60 transition-colors">
      {/* Thumbnail ala preview stream */}
      <Link
        href={`/akun/${account.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface2"
        aria-label={`Lihat detail ${account.title}`}
      >
        {account.coverUrl ? (
          <img
            src={account.coverUrl}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${
              ready ? "opacity-90 group-hover:opacity-100" : "opacity-50 grayscale"
            }`}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent2/50 to-bg">
            <span className="font-display font-extrabold text-4xl text-text">ML</span>
          </div>
        )}

        {/* Gradien bawah biar teks overlay kebaca */}
        <span className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/20" aria-hidden="true" />

        {/* Badge LIVE / offline */}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-extrabold tracking-wide ${
            ready ? "bg-live text-onaccent" : "bg-bg/80 text-faint"
          }`}
        >
          {ready && <span className="w-1.5 h-1.5 rounded-full bg-onaccent animate-pulse" aria-hidden="true" />}
          {ready ? "LIVE" : "OFFLINE"}
        </span>

        {/* Harga di overlay */}
        <span className="absolute bottom-3 left-3 text-xs font-bold text-soft">
          {account.rank}
        </span>
        <span className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-sm bg-accent text-onaccent font-display font-extrabold text-sm shadow-lg">
          {account.rank[0]?.toUpperCase()}
        </span>
      </Link>

      {/* Info channel */}
      <div className="flex flex-col p-4 flex-1">
        <div className="flex flex-col min-w-0 flex-1">
          <Link
            href={`/akun/${account.id}`}
            className="font-display font-extrabold text-lg leading-tight text-text hover:text-accent transition-colors line-clamp-2"
          >
            {account.title}
          </Link>
          <div className="grid grid-cols-2 gap-px mt-4 bg-line border border-line rounded-sm overflow-hidden">
            <div className="bg-surface2 px-3 py-2.5"><p className="text-[10px] font-bold text-faint">HERO</p><p className="font-display font-extrabold text-base text-text">{account.heroes}</p></div>
            <div className="bg-surface2 px-3 py-2.5"><p className="text-[10px] font-bold text-faint">SKIN</p><p className="font-display font-extrabold text-base text-text">{account.skins}</p></div>
          </div>

          <div className="flex items-end justify-between gap-3 mt-auto pt-4">
            <span className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-xl text-text">{rp(account.price_per_hour)}</span>
              <span className="font-body font-semibold text-xs text-soft">/jam</span>
            </span>
            {ready ? (
              <Link
                href={`/sewa/${account.id}`}
                className="font-bold text-sm px-4 py-2 rounded-sm bg-accent text-onaccent hover:bg-accent2 transition-colors"
              >
                Pilih akun
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
