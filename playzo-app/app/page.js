import Link from "next/link";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { waLink } from "@/lib/site";
import { photoUrl } from "@/lib/storage";
import CatalogFilter from "@/components/CatalogFilter";
import RentalShowcase from "@/components/RentalShowcase";

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

const CARD_COLORS = ["#7447f5", "#ff526d", "#30c9f0", "#28d7a5", "#3c68ef"];

function ControllerIcon() {
  return (
    <svg viewBox="0 0 58 46" aria-hidden="true">
      <rect x="3" y="3" width="22" height="40" rx="8" fill="none" stroke="currentColor" strokeWidth="4" />
      <rect x="33" y="3" width="22" height="40" rx="8" fill="currentColor" />
      <circle cx="14" cy="15" r="3" fill="currentColor" />
      <circle cx="44" cy="30" r="3" fill="#0c0c10" />
      <path d="M25 3v40M33 3v40" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export default async function Home() {
  const raw = await getAccounts();
  const accounts = await Promise.all(
    raw.map(async (a) => ({
      ...a,
      coverUrl: a.photos?.[0] ? await photoUrl(a.photos[0]) : null,
    }))
  );
  const readyCount = accounts.filter((a) => a.status === "ready").length;
  const heroAccounts = [
    ...accounts.filter((a) => a.status === "ready"),
    ...accounts.filter((a) => a.status !== "ready"),
  ].slice(0, 5);

  return (
    <div className="home-page">
      <section className="console-hero" aria-labelledby="hero-title">
        <div className="console-grid" aria-hidden="true" />
        <div className="hero-console-mark"><ControllerIcon /></div>
        <div className="hero-copy">
          <p className="availability"><span /> {readyCount} akun siap dimainkan</p>
          <h1 id="hero-title">Pilih akun.<br />Langsung main.</h1>
          <p className="hero-summary">Sewa akun Mobile Legends rank tinggi dan full skin. Proses cepat, akun aman, waktu main tidak dibagi.</p>
          <div className="hero-actions">
            <Link href="#katalog">Lihat semua akun</Link>
            <Link href="#cara">Cara menyewa</Link>
          </div>
        </div>

        {heroAccounts.length > 0 ? (
          <div className={`game-deck game-deck-${heroAccounts.length}`}>
            {heroAccounts.map((account, index) => (
              <Link
                href={`/akun/${account.id}`}
                key={account.id}
                className={`game-tile tile-${index + 1}`}
                style={{ "--tile-color": CARD_COLORS[index] }}
              >
                <span className="tile-topline">
                  <span>{account.rank || "Mobile Legends"}</span>
                  <b>{account.status === "ready" ? "Siap" : "Disewa"}</b>
                </span>
                <strong>{account.title}</strong>
                <small>{account.heroes} hero / {account.skins} skin</small>
                {account.coverUrl ? (
                  <img src={account.coverUrl} alt="" />
                ) : (
                  <span className="tile-placeholder">ML</span>
                )}
                <span className="tile-price">{rp(account.price_per_hour)}<small>/jam</small></span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-deck">Katalog akun segera tersedia.</div>
        )}
      </section>

      <RentalShowcase accounts={accounts} />

      {/* KATALOG */}
      <section id="katalog" className="catalog-section max-w-6xl mx-auto px-4 py-14 sm:py-20 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-8">
          <div>
            <p className="eyebrow mb-2">Koleksi Rentzo</p>
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
             <p className="eyebrow mb-2">Mulai bermain</p>
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
