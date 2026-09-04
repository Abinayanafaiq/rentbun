import Link from "next/link";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { waLink } from "@/lib/site";
import { photoUrl } from "@/lib/storage";
import CatalogFilter from "@/components/CatalogFilter";
import StatusBadge from "@/components/StatusBadge";
import RankMark from "@/components/RankMark";

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
  { metric: "100%", title: "Waktu main tetap utuh", desc: "Tidak bisa login atau akun bermasalah? Durasi yang hilang kami kembalikan penuh." },
  { metric: "Milik kami", title: "Bukan akun titipan", desc: "Setiap akun dikelola langsung oleh Rentzo. Tidak ada akun curian, phishing, atau sumber yang tidak jelas." },
  { metric: "<5 menit", title: "Admin benar-benar merespons", desc: "Dukungan tersedia 24 jam dengan rata-rata balasan di bawah lima menit." },
  { metric: "1 : 1", title: "Tidak berbagi sesi", desc: "Satu akun hanya untuk satu penyewa. Password selalu diganti setelah masa sewa selesai." },
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
      <section className="hero-wrap max-w-6xl mx-auto px-4 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <p className="hero-kicker inline-flex items-center gap-2 text-sm font-bold mb-5">
            <span className="w-2 h-2 rounded-full bg-live animate-pulse" aria-hidden="true" />
            {readyCount} akun LIVE sekarang
          </p>
          <h1 className="hero-title font-display font-extrabold leading-[.96] tracking-[-.05em] text-[clamp(2.8rem,13vw,6.4rem)] text-text mb-5 sm:mb-6">
            Main lebih jauh<span className="text-accent">.</span>
          </h1>
          <p className="text-base sm:text-lg text-soft max-w-[46ch] mb-7 sm:mb-8 leading-relaxed">
            Sewa akun Mobile Legends dengan rank tinggi dan skin melimpah mulai Rp1.500 per jam. Pilih akun, transfer, langsung main.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="#katalog"
              className="inline-flex justify-center font-bold px-6 py-3.5 sm:py-3 rounded-sm bg-accent text-onaccent hover:bg-accent2 transition-colors"
            >
              Lihat katalog
            </Link>
            <Link
              href="#cara"
              className="inline-flex justify-center font-bold px-6 py-3.5 sm:py-3 rounded-md border border-line text-text hover:bg-surface2 transition-colors"
            >
              Cara Sewa
            </Link>
          </div>
        </div>

        {/* Featured stream card */}
        {featured && (
          <Link
            href={`/akun/${featured.id}`}
            className="hero-card group block bg-surface border border-line rounded-sm overflow-hidden hover:border-accent transition-all duration-300"
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
             <div className="flex items-center gap-3 p-3 sm:p-3.5">
               <RankMark rank={featured.rank} compact />
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
      <div className="border-y border-line bg-surface/90 overflow-hidden">
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
      <section id="katalog" className="max-w-6xl mx-auto px-4 py-11 sm:py-14 scroll-mt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-8">
          <div>
            <p className="eyebrow mb-2">Pilih loadout-mu</p>
            <h2 className="section-heading font-display font-extrabold text-[clamp(1.8rem,8vw,2.6rem)] text-text mb-2">
              Katalog akun
            </h2>
            <p className="text-soft max-w-[58ch]">
              Setiap akun dicek admin sebelum disewakan. Email dan password akun baru terlihat setelah pembayaranmu terkonfirmasi.
            </p>
          </div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-soft">
            <span className="w-2 h-2 rounded-full bg-live animate-pulse" aria-hidden="true" />
            {readyCount} LIVE sekarang
          </p>
        </div>
        <CatalogFilter accounts={accounts} />
      </section>

      {/* CARA SEWA */}
      <section id="cara" className="py-12 sm:py-16 bg-surface/80 border-y border-line scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-9">
            <p className="eyebrow mb-2">Tidak pakai drama</p>
            <h2 className="font-display font-extrabold text-[clamp(1.8rem,3.5vw,2.6rem)] text-text mb-2">Cara Sewa</h2>
            <p className="text-soft">Tiga langkah, biasanya selesai kurang dari lima menit.</p>
          </div>
          <ol className="grid md:grid-cols-3 gap-3 sm:gap-4 list-none">
            {STEPS.map((s) => (
              <li key={s.n} className="relative bg-bg border border-line rounded-sm p-4 sm:p-5">
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

      {/* Standar layanan */}
      <section className="service-standard border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20 grid lg:grid-cols-[.75fr_1.25fr] gap-10 lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="section-heading font-display font-extrabold text-[clamp(2.3rem,11vw,4rem)] tracking-[-.045em] leading-[.98] text-text">
              Bukan cuma janji aman.
            </h2>
            <p className="text-soft leading-relaxed max-w-[38ch] mt-5">
              Ini aturan yang kami jalankan pada setiap akun dan setiap sesi sewa.
            </p>
          </div>
          <div className="service-list border-t border-line">
            {PERKS.map((p) => (
              <article key={p.title} className="service-row grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 py-5 sm:py-6 border-b border-line">
                <p className="service-metric font-display font-extrabold text-xl text-accent">{p.metric}</p>
                <div>
                  <h3 className="font-display font-extrabold text-xl text-text">{p.title}</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-soft mt-2 max-w-[54ch]">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-10 sm:pb-14">
        <div className="accent-panel rounded-sm px-5 sm:px-7 py-10 sm:py-14 text-center">
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
             className="inline-flex justify-center font-bold px-7 py-3.5 sm:py-3 rounded-sm bg-bg text-text hover:bg-surface2 transition-colors"
          >
            Chat admin sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
