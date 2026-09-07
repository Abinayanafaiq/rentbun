import Link from "next/link";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { waLink } from "@/lib/site";
import { photoUrl } from "@/lib/storage";
import { getDict } from "@/lib/i18n";
import { fill } from "@/lib/dict";
import CatalogFilter from "@/components/CatalogFilter";
import RentalShowcase from "@/components/RentalShowcase";

export const dynamic = "force-dynamic";

async function getAccounts() {
  const { rows } = await q(
    "SELECT id, title, rank, heroes, skins, level, price_per_hour, status, photos FROM accounts ORDER BY CASE status WHEN 'ready' THEN 0 ELSE 1 END, price_per_hour DESC"
  );
  return rows;
}

const CARD_COLORS = ["#7447f5", "#ff526d", "#30c9f0", "#28d7a5", "#3c68ef"];

export default async function Home() {
  const [raw, t] = await Promise.all([getAccounts(), getDict()]);
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
        <div className="hero-copy">
          <p className="availability"><span /> {fill(t.home.available, { n: readyCount })}</p>
          <h1 id="hero-title">{t.home.heroTitle1}<br />{t.home.heroTitle2}</h1>
          <p className="hero-summary">{t.home.heroSummary}</p>
          <div className="hero-actions">
            <Link href="#katalog">{t.home.seeAll}</Link>
            <Link href="#cara">{t.home.howTo}</Link>
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
                  <b>{account.status === "ready" ? t.home.ready : t.home.rented}</b>
                </span>
                <strong>{account.title}</strong>
                <small>{fill(t.home.heroesSkins, { heroes: account.heroes, skins: account.skins })}</small>
                {account.coverUrl ? (
                  <img src={account.coverUrl} alt="" />
                ) : (
                  <span className="tile-placeholder">ML</span>
                )}
                <span className="tile-price">{rp(account.price_per_hour)}<small>{t.home.perHour}</small></span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-deck">{t.home.emptyDeck}</div>
        )}
      </section>

      <RentalShowcase accounts={accounts} t={t.showcase} />

      {/* KATALOG */}
      <section id="katalog" className="catalog-section max-w-6xl mx-auto px-4 py-14 sm:py-20 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-8">
          <div>
            <p className="eyebrow mb-2">{t.home.collectionEyebrow}</p>
            <h2 className="section-heading font-display font-extrabold text-[clamp(1.8rem,8vw,2.6rem)] text-text mb-2">
              {t.home.catalogTitle}
            </h2>
            <p className="text-soft max-w-[58ch]">
              {t.home.catalogDesc}
            </p>
          </div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-soft">
            <span className="w-2 h-2 rounded-full bg-live animate-pulse" aria-hidden="true" />
            {fill(t.home.liveNow, { n: readyCount })}
          </p>
        </div>
        <CatalogFilter accounts={accounts} t={t.filter} cardT={t.card} />
      </section>

      {/* CARA SEWA */}
      <section id="cara" className="py-12 sm:py-16 bg-surface/80 border-y border-line scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-9">
             <p className="eyebrow mb-2">{t.home.howEyebrow}</p>
            <h2 className="font-display font-extrabold text-[clamp(1.8rem,3.5vw,2.6rem)] text-text mb-2">{t.home.howTitle}</h2>
            <p className="text-soft">{t.home.howDesc}</p>
          </div>
          <ol className="grid md:grid-cols-3 gap-3 sm:gap-4 list-none">
            {t.home.steps.map((s, i) => (
              <li key={s.title} className="relative bg-bg border border-line rounded-sm p-4 sm:p-5">
                <span className="inline-grid place-items-center w-8 h-8 bg-accent text-onaccent rounded font-display font-extrabold text-sm mb-3">
                  {i + 1}
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
              {t.home.serviceTitle}
            </h2>
            <p className="text-soft leading-relaxed max-w-[38ch] mt-5">
              {t.home.serviceDesc}
            </p>
          </div>
          <div className="service-list border-t border-line">
            {t.home.perks.map((p) => (
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
            {t.home.ctaTitle}
          </h2>
          <p className="text-onaccent/80 max-w-[46ch] mx-auto mb-8">
            {t.home.ctaDesc}
          </p>
          <a
            href={waLink(t.home.ctaWa)}
            target="_blank"
            rel="noopener noreferrer"
             className="inline-flex justify-center font-bold px-7 py-3.5 sm:py-3 rounded-sm bg-bg text-text hover:bg-surface2 transition-colors"
          >
            {t.home.ctaBtn}
          </a>
        </div>
      </section>
    </div>
  );
}
