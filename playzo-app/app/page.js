import Link from "next/link";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { waLink } from "@/lib/site";
import { photoUrl } from "@/lib/storage";
import CatalogFilter from "@/components/CatalogFilter";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

async function getAccounts() {
  const { rows } = await q(
    "SELECT id, title, rank, heroes, skins, level, price_per_hour, status, photos FROM accounts ORDER BY CASE status WHEN 'ready' THEN 0 ELSE 1 END, price_per_hour DESC"
  );
  return rows;
}

const STEPS = [
  { n: "1", title: "Pilih akun", desc: "Telusuri katalog, cek rank, skin, dan harganya. Semua info ditulis apa adanya." },
  { n: "2", title: "Bayar", desc: "Isi form sewa, transfer sesuai total, lalu kirim bukti ke admin lewat WhatsApp." },
  { n: "3", title: "Login dan main", desc: "Setelah pembayaran terkonfirmasi, email dan password akun tampil di halaman order." },
];

const PERKS = [
  { title: "Garansi penuh", desc: "Akun bermasalah atau tidak bisa login? Waktu sewamu diganti utuh." },
  { title: "Akun milik sendiri", desc: "Semua akun aset resmi Rentzo, bukan akun curian atau hasil phising." },
  { title: "Fast respon 24 jam", desc: "Admin standby pagi sampai pagi lagi. Rata-rata dibalas di bawah 5 menit." },
  { title: "Satu akun satu penyewa", desc: "Password diganti setiap sewa selesai. Selama menyewa, akun cuma dipegang kamu." },
];

export default async function Home() {
  const raw = await getAccounts();
  const accounts = await Promise.all(
    raw.map(async (a) => ({
      ...a,
      coverUrl: a.photos?.[0] ? await photoUrl(a.photos[0]) : null,
    }))
  );
  const featured = accounts.find((a) => a.status === "ready") || accounts[0];
  const readyCount = accounts.filter((a) => a.status === "ready").length;

  return (
    <div>
      {/* HERO — featured "live now" */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-soft mb-4">
            <span className="w-2 h-2 rounded-full bg-live animate-pulse" aria-hidden="true" />
            {readyCount} akun LIVE sekarang
          </p>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-tight text-[clamp(2.4rem,5vw,4rem)] text-text mb-5">
            Akun sultan, harga rental.
          </h1>
          <p className="text-lg text-soft max-w-[46ch] mb-8">
            Sewa akun Mobile Legends dengan rank tinggi dan skin melimpah mulai Rp1.500 per jam. Pilih akun, transfer, langsung main.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#katalog"
              className="inline-flex font-bold px-6 py-3 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
            >
              Lihat katalog
            </Link>
            <Link
              href="#cara"
              className="inline-flex font-bold px-6 py-3 rounded-md border border-line text-text hover:bg-surface2 transition-colors"
            >
              Cara Sewa
            </Link>
          </div>
        </div>

        {/* Featured stream card */}
        {featured && (
          <Link
            href={`/akun/${featured.id}`}
            className="group block bg-surface border border-line rounded-lg overflow-hidden hover:border-line2 transition-colors"
          >
            <div className="relative aspect-video bg-surface2">
              {featured.coverUrl ? (
                <img
                  src={featured.coverUrl}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent2/60 to-bg">
                  <span className="font-display font-extrabold text-4xl text-text">ML</span>
                </div>
              )}
              <span className="absolute top-3 left-3">
                <StatusBadge status={featured.status} />
              </span>
              <span className="absolute bottom-3 right-3 rounded bg-bg/85 px-2.5 py-1 text-sm font-bold text-text backdrop-blur-sm">
                {rp(featured.price_per_hour)}
                <span className="font-body font-semibold text-xs text-soft">/jam</span>
              </span>
            </div>
            <div className="flex items-center gap-3 p-3.5">
              <span className="grid place-items-center w-10 h-10 flex-none rounded-md bg-accent2 text-onaccent font-display font-extrabold text-sm">
                {featured.rank[0]?.toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="font-display font-bold text-text leading-snug line-clamp-1">{featured.title}</p>
                <p className="text-xs text-soft">
                  {featured.rank} · {featured.heroes} hero · {featured.skins} skin
                </p>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* LIVE ticker */}
      <div className="border-y border-line bg-surface overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((g) => (
            <div key={g} className="flex flex-none items-center py-2.5" aria-hidden={g === 1}>
              {accounts.map((a) => (
                <span key={`${g}-${a.id}`} className="flex items-center">
                  <span className="text-soft font-semibold px-5 text-sm whitespace-nowrap">
                    <span className={`mr-2 inline-block w-1.5 h-1.5 rounded-full align-middle ${a.status === "ready" ? "bg-live" : "bg-faint"}`} />
                    {a.title} · {rp(a.price_per_hour)}/jam
                  </span>
                  <span className="text-accent text-xs">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* KATALOG */}
      <section id="katalog" className="max-w-6xl mx-auto px-4 py-14 scroll-mt-16">
        <div className="mb-8">
          <h2 className="font-display font-extrabold text-[clamp(1.8rem,3.5vw,2.6rem)] text-text mb-2">Kanal yang LIVE</h2>
          <p className="text-soft max-w-[58ch]">
            Setiap akun dicek admin sebelum disewakan. Email dan password akun baru terlihat setelah pembayaranmu terkonfirmasi.
          </p>
        </div>
        <CatalogFilter accounts={accounts} />
      </section>

      {/* CARA SEWA */}
      <section id="cara" className="py-14 bg-surface border-y border-line scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-9">
            <h2 className="font-display font-extrabold text-[clamp(1.8rem,3.5vw,2.6rem)] text-text mb-2">Cara Sewa</h2>
            <p className="text-soft">Tiga langkah, biasanya selesai kurang dari lima menit.</p>
          </div>
          <ol className="grid md:grid-cols-3 gap-4 list-none">
            {STEPS.map((s) => (
              <li key={s.n} className="relative bg-bg border border-line rounded-lg p-5">
                <span className="inline-grid place-items-center w-8 h-8 bg-accent text-onaccent rounded font-display font-extrabold text-sm mb-3">
                  {s.n}
                </span>
                <h3 className="font-display font-bold text-lg text-text mb-1.5">{s.title}</h3>
                <p className="text-sm text-soft">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* KENAPA RENTZO */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="mb-9">
          <h2 className="font-display font-extrabold text-[clamp(1.8rem,3.5vw,2.6rem)] text-text mb-2">Kenapa sewa di Rentzo</h2>
          <p className="text-soft">Rental akun soalnya percaya-percayaan. Begini cara kami menjaganya.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERKS.map((p) => (
            <div key={p.title} className="bg-surface border border-line rounded-lg p-5">
              <span className="grid place-items-center w-9 h-9 rounded bg-accent/15 text-accent font-display font-extrabold text-lg mb-3">
                ✓
              </span>
              <h3 className="font-display font-bold text-lg text-text mb-1.5">{p.title}</h3>
              <p className="text-sm text-soft">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="bg-accent rounded-lg px-7 py-14 text-center">
          <h2 className="font-display font-extrabold text-[clamp(1.8rem,4vw,2.8rem)] text-onaccent mb-3">
            Mau main hari ini?
          </h2>
          <p className="text-onaccent/80 max-w-[46ch] mx-auto mb-8">
            Slot weekend cepat habis. Amankan akunmu dari sekarang, bayar setelah deal dengan admin.
          </p>
          <a
            href={waLink("Halo min, saya mau sewa akun Mobile Legends hari ini")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-bold px-7 py-3 rounded-md bg-bg text-text hover:bg-surface2 transition-colors"
          >
            Chat admin sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
