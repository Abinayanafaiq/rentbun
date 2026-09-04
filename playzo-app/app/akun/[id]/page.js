import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { rp, tierOf, TIER_COVER } from "@/lib/format";
import { photoUrls } from "@/lib/storage";
import StatusBadge from "@/components/StatusBadge";
import PhotoGallery from "@/components/PhotoGallery";

export const dynamic = "force-dynamic";

export default async function AkunDetail({ params }) {
  const { id } = await params;
  const { rows } = await q("SELECT * FROM accounts WHERE id = $1", [Number(id) || 0]);
  const account = rows[0];
  if (!account) notFound();

  const tier = tierOf(account.rank);
  const ready = account.status === "ready";
  const photos = await photoUrls(account.photos || []);

  const specs = [
    { label: "Rank", value: account.rank },
    { label: "Jumlah hero", value: account.heroes },
    { label: "Jumlah skin", value: account.skins },
    { label: "Level akun", value: account.level },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <Link href="/#katalog" className="font-semibold text-sm underline underline-offset-4 text-ink/70 hover:text-ink">
        Kembali ke katalog
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-8">
        {/* Kiri: galeri foto (atau cover default) + deskripsi */}
        <div>
          {photos.length > 0 ? (
            <PhotoGallery photos={photos} title={account.title} />
          ) : (
            <div className={`h-72 grid place-items-center border-[2.5px] border-ink rounded-[22px] shadow-hard ${TIER_COVER[tier]}`}>
              <div className="text-center">
                <span className="font-display font-extrabold text-7xl block">ML</span>
                <span className="font-display font-bold text-xl">{account.rank}</span>
              </div>
            </div>
          )}
          <div className="mt-6 bg-paper2 border-[2.5px] border-ink rounded-2xl p-6 shadow-hard">
            <h2 className="font-display font-extrabold text-xl mb-2">Detail akun</h2>
            <p className="text-ink/75">{account.description}</p>
          </div>
        </div>

        {/* Kanan: info + harga */}
        <div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] leading-tight">
              {account.title}
            </h1>
            <StatusBadge status={account.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-7">
            {specs.map((s) => (
              <div key={s.label} className="bg-paper2 border-[2.5px] border-ink rounded-2xl p-4 shadow-hard-sm">
                <p className="text-sm text-ink/60 font-semibold">{s.label}</p>
                <p className="font-display font-extrabold text-2xl mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 bg-paper2 border-[2.5px] border-ink rounded-2xl p-6 shadow-hard">
            <p className="text-sm text-ink/60 font-semibold">Harga sewa</p>
            <p className="font-display font-extrabold text-4xl mt-1">
              {rp(account.price_per_hour)}
              <span className="font-body font-semibold text-base text-ink/70">/jam</span>
            </p>
            <p className="text-sm text-ink/70 mt-2 mb-6">
              Minimal sewa 1 jam, maksimal 72 jam. Email dan password akun tampil di halaman order setelah pembayaran terkonfirmasi.
            </p>
            {ready ? (
              <Link
                href={`/sewa/${account.id}`}
                className="block text-center font-bold px-6 py-4 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Sewa akun ini
              </Link>
            ) : (
              <div>
                <span className="block text-center font-bold px-6 py-4 rounded-full border-[2.5px] border-ink/30 text-ink/40 cursor-not-allowed">
                  Sedang disewa
                </span>
                <p className="text-sm text-ink/60 mt-3 text-center">
                  Akun ini sedang dipakai penyewa lain. Cek akun lain di katalog atau tanya admin untuk jadwal kosong.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
