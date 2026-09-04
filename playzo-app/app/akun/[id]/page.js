import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { photoUrls } from "@/lib/storage";
import StatusBadge from "@/components/StatusBadge";
import PhotoGallery from "@/components/PhotoGallery";

export const dynamic = "force-dynamic";

export default async function AkunDetail({ params }) {
  const { id } = await params;
  const { rows } = await q("SELECT * FROM accounts WHERE id = $1", [Number(id) || 0]);
  const account = rows[0];
  if (!account) notFound();

  const ready = account.status === "ready";
  const photos = await photoUrls(account.photos || []);

  const specs = [
    { label: "Rank", value: account.rank },
    { label: "Jumlah hero", value: account.heroes },
    { label: "Jumlah skin", value: account.skins },
    { label: "Level akun", value: account.level },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/#katalog" className="font-semibold text-sm text-soft hover:text-text">
        ← Kembali ke katalog
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        {/* Kiri: galeri foto + deskripsi */}
        <div>
          {photos.length > 0 ? (
            <PhotoGallery photos={photos} title={account.title} />
          ) : (
            <div className="aspect-video grid place-items-center rounded-lg border border-line bg-gradient-to-br from-accent2/60 to-bg">
              <span className="font-display font-extrabold text-7xl text-text">ML</span>
            </div>
          )}
          <div className="mt-6 bg-surface border border-line rounded-lg p-6">
            <h2 className="font-display font-bold text-xl text-text mb-2">Detail akun</h2>
            <p className="text-soft">{account.description}</p>
          </div>
        </div>

        {/* Kanan: info + harga */}
        <div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-text">
              {account.title}
            </h1>
            <StatusBadge status={account.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-7">
            {specs.map((s) => (
              <div key={s.label} className="bg-surface border border-line rounded-lg p-4">
                <p className="text-sm text-soft font-semibold">{s.label}</p>
                <p className="font-display font-extrabold text-2xl mt-0.5 text-text">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 bg-surface border border-line rounded-lg p-6">
            <p className="text-sm text-soft font-semibold">Harga sewa</p>
            <p className="font-display font-extrabold text-4xl mt-1 text-text">
              {rp(account.price_per_hour)}
              <span className="font-body font-semibold text-base text-soft">/jam</span>
            </p>
            <p className="text-sm text-soft mt-2 mb-6">
              Minimal sewa 1 jam, maksimal 72 jam. Email dan password akun tampil di halaman order setelah pembayaran terkonfirmasi.
            </p>
            {ready ? (
              <Link
                href={`/sewa/${account.id}`}
                className="block text-center font-bold px-6 py-4 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
              >
                Sewa akun ini
              </Link>
            ) : (
              <div>
                <span className="block text-center font-bold px-6 py-4 rounded-md border border-line/60 text-faint cursor-not-allowed">
                  Sedang disewa
                </span>
                <p className="text-sm text-soft mt-3 text-center">
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
