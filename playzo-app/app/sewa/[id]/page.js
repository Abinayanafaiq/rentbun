import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { getCurrentUser } from "@/lib/userAuth";
import { getVoucherBonusDays, getUsdRate } from "@/lib/marketers";
import { getDict } from "@/lib/i18n";
import { fill } from "@/lib/dict";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function SewaPage({ params }) {
  const { id } = await params;
  const [{ rows }, { rows: packages }, user, bonusDays, usdRate, t] = await Promise.all([
    q("SELECT id, title, rank, heroes, skins, price_per_hour, status FROM accounts WHERE id = $1", [Number(id) || 0]),
    q("SELECT id, label, duration_hours, price, price_usd FROM packages ORDER BY duration_hours ASC"),
    getCurrentUser(),
    getVoucherBonusDays(),
    getUsdRate(),
    getDict(),
  ]);
  const account = rows[0];
  if (!account) notFound();

  if (account.status !== "ready") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display font-extrabold text-3xl text-text mb-3">{t.sewa.rentedTitle}</h1>
        <p className="text-soft mb-8">
          {fill(t.sewa.rentedDesc, { title: account.title })}
        </p>
        <Link
          href="/#katalog"
          className="inline-flex font-bold px-6 py-3 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
        >
          {t.sewa.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] text-text mb-2">{t.sewa.title}</h1>
      <p className="text-soft mb-9">{t.sewa.sub}</p>

      <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 items-start">
        {/* Ringkasan akun */}
        <div className="bg-surface border border-line rounded-lg overflow-hidden">
          <div className="h-28 grid place-items-center border-b border-line bg-gradient-to-br from-accent2/60 to-bg">
            <span className="font-display font-extrabold text-3xl text-text">ML</span>
          </div>
          <div className="p-5">
            <h2 className="font-display font-bold text-xl leading-snug text-text">{account.title}</h2>
            <p className="text-sm text-soft mt-1">
              {account.rank}, {fill(t.card.heroes, { n: account.heroes })}, {fill(t.card.skins, { n: account.skins })}
            </p>
            <p className="font-display font-extrabold text-2xl mt-3 text-text">
              {rp(account.price_per_hour)}
              <span className="font-body font-semibold text-sm text-soft">{t.checkout.perHourUnit}</span>
            </p>
          </div>
        </div>

        <CheckoutForm account={account} packages={packages} usdRate={usdRate} defaultName={user?.name} defaultWa={user?.wa} bonusDays={bonusDays} t={t.checkout} />
      </div>
    </div>
  );
}
