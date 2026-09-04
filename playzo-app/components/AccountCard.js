import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { rp } from "@/lib/format";

export default function AccountCard({ account }) {
  const ready = account.status === "ready";

  return (
    <article className="group flex flex-col bg-surface border border-line rounded-lg overflow-hidden hover:border-line2 transition-colors">
      {/* Thumbnail ala preview stream */}
      <Link href={`/akun/${account.id}`} className="relative block aspect-[16/10] overflow-hidden bg-surface2">
        {account.coverUrl ? (
          <img
            src={account.coverUrl}
            alt={account.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent2/60 to-bg">
            <span className="font-display font-extrabold text-3xl text-text">ML</span>
          </div>
        )}
        {/* Badge LIVE / offline */}
        <span className="absolute top-2 left-2">
          <StatusBadge status={account.status} />
        </span>
        {/* Harga di overlay */}
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-bg/85 px-2 py-0.5 text-sm font-bold text-text backdrop-blur-sm">
          {rp(account.price_per_hour)}
          <span className="font-body font-semibold text-xs text-soft">/jam</span>
        </span>
      </Link>

      {/* Info channel */}
      <div className="flex gap-3 p-3 flex-1">
        <span className="grid place-items-center w-9 h-9 flex-none rounded-md bg-accent2 text-onaccent font-display font-extrabold text-sm mt-0.5">
          {account.rank[0]?.toUpperCase()}
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <Link
            href={`/akun/${account.id}`}
            className="font-display font-bold text-[0.95rem] leading-snug text-text hover:underline line-clamp-2"
          >
            {account.title}
          </Link>
          <p className="text-xs text-soft mt-0.5">
            {account.rank} · {account.heroes} hero · {account.skins} skin
          </p>
          <div className="flex gap-2 mt-auto pt-3">
            <Link
              href={`/akun/${account.id}`}
              className="flex-1 text-center font-bold text-sm px-3 py-2 rounded-md border border-line text-text hover:bg-surface2 transition-colors"
            >
              Lihat detail
            </Link>
            {ready ? (
              <Link
                href={`/sewa/${account.id}`}
                className="flex-1 text-center font-bold text-sm px-3 py-2 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
              >
                Sewa
              </Link>
            ) : (
              <span className="flex-1 text-center font-bold text-sm px-3 py-2 rounded-md border border-line/60 text-faint cursor-not-allowed">
                Sewa
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
