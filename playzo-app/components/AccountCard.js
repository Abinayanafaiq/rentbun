import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { rp, tierOf, TIER_COVER } from "@/lib/format";

export default function AccountCard({ account }) {
  const tier = tierOf(account.rank);
  const ready = account.status === "ready";

  return (
    <article className="flex flex-col bg-paper2 border-[2.5px] border-ink rounded-[18px] overflow-hidden shadow-hard transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg">
      <div className={`relative h-36 grid place-items-center border-b-[2.5px] border-ink overflow-hidden ${TIER_COVER[tier]}`}>
        {account.coverUrl ? (
          <img src={account.coverUrl} alt={account.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="font-display font-extrabold text-4xl">ML</span>
        )}
        <StatusBadge status={account.status} className="absolute top-3 right-3" />
      </div>
      <div className="flex flex-col gap-2.5 p-5 flex-1">
        <Link href={`/akun/${account.id}`} className="hover:underline underline-offset-4">
          <h3 className="font-display font-extrabold text-xl leading-tight">{account.title}</h3>
        </Link>
        <p className="text-sm text-ink/70">
          {account.rank}, {account.heroes} hero, {account.skins} skin
        </p>
        <p className="font-display font-extrabold text-2xl mt-auto pt-1">
          {rp(account.price_per_hour)}
          <span className="font-body font-semibold text-sm text-ink/70">/jam</span>
        </p>
        <div className="flex gap-2.5 pt-1">
          <Link
            href={`/akun/${account.id}`}
            className="flex-1 text-center font-bold text-sm px-3 py-2.5 rounded-full border-[2.5px] border-ink hover:bg-ink hover:text-paper transition-colors"
          >
            Lihat detail
          </Link>
          {ready ? (
            <Link
              href={`/sewa/${account.id}`}
              className="flex-1 text-center font-bold text-sm px-3 py-2.5 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm hover:-translate-y-0.5 transition-transform"
            >
              Sewa
            </Link>
          ) : (
            <span className="flex-1 text-center font-bold text-sm px-3 py-2.5 rounded-full border-[2.5px] border-ink/30 text-ink/40 cursor-not-allowed">
              Sewa
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
