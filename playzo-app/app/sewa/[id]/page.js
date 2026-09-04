import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { rp, tierOf, TIER_COVER } from "@/lib/format";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function SewaPage({ params }) {
  const { id } = await params;
  const [{ rows }, { rows: packages }] = await Promise.all([
    q("SELECT id, title, rank, heroes, skins, price_per_hour, status FROM accounts WHERE id = $1", [Number(id) || 0]),
    q("SELECT id, label, duration_hours, price FROM packages ORDER BY duration_hours ASC"),
  ]);
  const account = rows[0];
  if (!account) notFound();

  if (account.status !== "ready") {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <h1 className="font-display font-extrabold text-3xl mb-3">Akun sedang disewa</h1>
        <p className="text-ink/70 mb-8">
          {account.title} sedang dipakai penyewa lain. Pilih akun lain yang masih tersedia.
        </p>
        <Link
          href="/#katalog"
          className="inline-flex font-bold px-6 py-3.5 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm"
        >
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] mb-2">Form sewa</h1>
      <p className="text-ink/70 mb-9">Isi data di bawah, lalu kamu dapat kode order untuk pembayaran.</p>

      <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 items-start">
        {/* Ringkasan akun */}
        <div className="bg-paper2 border-[2.5px] border-ink rounded-2xl overflow-hidden shadow-hard">
          <div className={`h-28 grid place-items-center border-b-[2.5px] border-ink ${TIER_COVER[tierOf(account.rank)]}`}>
            <span className="font-display font-extrabold text-3xl">ML</span>
          </div>
          <div className="p-5">
            <h2 className="font-display font-extrabold text-xl leading-snug">{account.title}</h2>
            <p className="text-sm text-ink/70 mt-1">
              {account.rank}, {account.heroes} hero, {account.skins} skin
            </p>
            <p className="font-display font-extrabold text-2xl mt-3">
              {rp(account.price_per_hour)}
              <span className="font-body font-semibold text-sm text-ink/70">/jam</span>
            </p>
          </div>
        </div>

        <CheckoutForm account={account} packages={packages} />
      </div>
    </div>
  );
}
