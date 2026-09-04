import Link from "next/link";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { waLink } from "@/lib/site";
import { photoUrl } from "@/lib/storage";
import CatalogFilter from "@/components/CatalogFilter";

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
  // Foto pertama jadi sampul kartu (URL bertanda tangan, bucket privat)
  const accounts = await Promise.all(
    raw.map(async (a) => ({
      ...a,
      coverUrl: a.photos?.[0] ? await photoUrl(a.photos[0]) : null,
    }))
  );
  const featured = accounts.slice(0, 3);
  const readyCount = accounts.filter((a) => a.status === "ready").length;

  return (
    <div>
      {/* HERO */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold bg-paper2 border-2 border-ink rounded-full px-3.5 py-1.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-teal border-[1.5px] border-ink" aria-hidden="true" />
              Admin online, {readyCount} akun siap disewa
            </p>
            <h1 className="font-display font-extrabold leading-[1.05] tracking-tight text-[clamp(2.7rem,5.6vw,4.4rem)] mb-5">
              Akun sultan, harga rental.
            </h1>
            <p className="text-lg text-ink/70 max-w-[46ch] mb-8">
              Sewa akun Mobile Legends dengan rank tinggi dan skin melimpah mulai Rp1.500 per jam. Pilih akun, transfer, langsung main.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link
                href="#katalog"
                className="font-bold px-6 py-3.5 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Lihat katalog
              </Link>
              <Link
                href="#cara"
                className="font-bold px-6 py-3.5 rounded-full border-[2.5px] border-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Cara sewa
              </Link>
            </div>
          </div>

          {/* Kipasan kartu case */}
          <div className="relative h-[430px] hidden md:block" aria-hidden="true">
            {featured.map((a, i) => {
              const pos = [
                "left-[4%] top-[52px] -rotate-8 z-[1]",
                "left-1/2 -ml-[114px] top-3 z-[2]",
                "right-[3%] top-[64px] rotate-7 z-[1]",
              ][i];
              return (
                <div
                  key={a.id}
                  className={`absolute w-[228px] bg-paper2 border-[2.5px] border-ink rounded-2xl overflow-hidden shadow-hard transition-transform hover:-translate-y-2 ${pos}`}
                >
                  <div className="h-32 grid place-items-center border-b-[2.5px] border-ink bg-[repeating-linear-gradient(-45deg,#12A48E_0_18px,#0B7A6A_18px_36px)]">
                    <span className="font-display font-extrabold text-4xl text-paper2">ML</span>
                  </div>
                  <div className="p-3.5 px-4">
                    <strong className="block text-[0.95rem] leading-snug">{a.title}</strong>
                    <small className="block text-ink/70 text-[0.8rem] mt-0.5 mb-2">{a.rank}</small>
                    <span className="font-display font-extrabold text-lg">
                      {rp(a.price_per_hour)}
                      <span className="font-body font-semibold text-xs text-ink/70">/jam</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Stempel stiker */}
            <div className="absolute -top-2 right-[6%] w-[120px] h-[120px] z-[3] bg-yellow border-[2.5px] border-ink rounded-full shadow-hard-sm grid place-items-center">
              <svg className="absolute inset-0 animate-spin-slow" viewBox="0 0 120 120" width="120" height="120">
                <defs>
                  <path id="stampCircle" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
                </defs>
                <text className="fill-ink" style={{ fontSize: "12.5px", fontWeight: 700, letterSpacing: "1px" }}>
                  <textPath href="#stampCircle">mulai Rp1.500 per jam ★ buka 24 jam ★</textPath>
                </text>
              </svg>
              <span className="text-2xl text-reddeep">★</span>
            </div>
          </div>
        </div>
      </section>

      {/* PAPAN HARGA */}
      <div className="bg-red border-y-[2.5px] border-ink overflow-hidden -rotate-1 scale-[1.02]">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((g) => (
            <div key={g} className="flex flex-none items-center py-3" aria-hidden={g === 1}>
              {accounts.map((a) => (
                <span key={`${g}-${a.id}`} className="flex items-center">
                  <span className="text-paper2 font-bold px-5 whitespace-nowrap">
                    {a.title} {rp(a.price_per_hour)}/jam
                  </span>
                  <span className="text-yellow text-sm">★</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* KATALOG */}
      <section id="katalog" className="py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-10">
            <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,2.9rem)] mb-2.5">Pilih akunmu</h2>
            <p className="text-ink/70 max-w-[58ch]">
              Setiap akun dicek admin sebelum disewakan. Email dan password akun baru terlihat setelah pembayaranmu terkonfirmasi.
            </p>
          </div>
          <CatalogFilter accounts={accounts} />
        </div>
      </section>

      {/* CARA SEWA */}
      <section id="cara" className="py-20 bg-tint border-y-[2.5px] border-ink scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-10">
            <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,2.9rem)] mb-2.5">Cara sewa</h2>
            <p className="text-ink/70">Tiga langkah, biasanya selesai kurang dari lima menit.</p>
          </div>
          <ol className="grid md:grid-cols-3 gap-6 list-none">
            {STEPS.map((s) => (
              <li key={s.n} className="relative bg-paper2 border-[2.5px] border-ink rounded-2xl p-6 shadow-hard">
                <span className="grid place-items-center w-12 h-12 bg-yellow border-[2.5px] border-ink rounded-full font-display font-extrabold text-xl mb-4">
                  {s.n}
                </span>
                <h3 className="font-display font-extrabold text-xl mb-2">{s.title}</h3>
                <p className="text-[0.96rem] text-ink/70">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* KENAPA RENTZO */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-10">
            <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,2.9rem)] mb-2.5">Kenapa sewa di Rentzo</h2>
            <p className="text-ink/70">Rental akun soalnya percaya-percayaan. Begini cara kami menjaganya.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((p) => (
              <div key={p.title}>
                <span className="grid place-items-center w-[50px] h-[50px] bg-paper2 border-[2.5px] border-ink rounded-[14px] shadow-hard-sm font-display font-extrabold text-xl text-reddeep mb-4">
                  ✓
                </span>
                <h3 className="font-display font-extrabold text-lg mb-1.5">{p.title}</h3>
                <p className="text-[0.93rem] text-ink/70">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-yellow border-[3px] border-ink rounded-[26px] shadow-hard-lg text-center px-7 py-16">
            <h2 className="font-display font-extrabold text-[clamp(2.1rem,4.5vw,3.2rem)] mb-3.5">
              Mau main hari ini?
            </h2>
            <p className="text-ink/78 max-w-[46ch] mx-auto mb-8">
              Slot weekend cepat habis. Amankan akunmu dari sekarang, bayar setelah deal dengan admin.
            </p>
            <a
              href={waLink("Halo min, saya mau sewa akun Mobile Legends hari ini")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex font-bold px-7 py-4 rounded-full border-[2.5px] border-ink bg-ink text-paper shadow-hard-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Chat admin sekarang
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
