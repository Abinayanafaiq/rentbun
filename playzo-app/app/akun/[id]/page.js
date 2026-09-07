import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { photoUrls } from "@/lib/storage";
import { getDict, getLang } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import PhotoGallery from "@/components/PhotoGallery";
import RankMark from "@/components/RankMark";

export const dynamic = "force-dynamic";

export default async function AkunDetail({ params }) {
  const [{ id }, t, lang] = await Promise.all([params, getDict(), getLang()]);
  const { rows } = await q("SELECT * FROM accounts WHERE id = $1", [Number(id) || 0]);
  const account = rows[0];
  if (!account) notFound();

  const ready = account.status === "ready";
  const photos = await photoUrls(account.photos || []);

  const specs = [
    { label: t.akun.rankNow, value: account.rank, code: "RANK" },
    { label: t.akun.heroesAvail, value: account.heroes, code: "HERO" },
    { label: t.akun.skinColl, value: account.skins, code: "SKIN" },
    { label: t.akun.accLevel, value: account.level, code: "LVL" },
  ];

  return (
    <div className="account-detail max-w-6xl mx-auto px-3 sm:px-4 pt-5 sm:pt-8 pb-24 lg:pb-20">
      <nav className="flex items-center gap-2 text-xs sm:text-sm mb-6 sm:mb-8 min-w-0" aria-label="Breadcrumb">
        <Link href="/" className="font-semibold text-faint hover:text-accent">{t.akun.home}</Link>
        <span className="text-line2">/</span>
        <Link href="/#katalog" className="font-semibold text-faint hover:text-accent">{t.akun.catalog}</Link>
        <span className="text-line2">/</span>
        <span className="font-semibold text-soft line-clamp-1">{account.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-9 lg:gap-12 items-start">
        <div>
          {photos.length > 0 ? (
            <PhotoGallery photos={photos} title={account.title} />
          ) : (
            <div className="gallery-main aspect-[4/3] grid place-items-center rounded-sm border border-line bg-gradient-to-br from-surface2 to-bg">
              <div className="text-center"><span className="block font-display font-extrabold text-7xl text-accent">ML</span><span className="text-sm font-semibold text-soft">{t.akun.noPreview}</span></div>
            </div>
          )}

          <div className="mt-7 sm:mt-8 border-t border-line pt-6 sm:pt-7">
            <p className="eyebrow mb-3">{t.akun.aboutEyebrow}</p>
            <h2 className="font-display font-extrabold text-2xl text-text mb-3">{t.akun.aboutTitle}</h2>
            <p className="text-soft leading-relaxed max-w-[68ch]">{account.description || t.akun.defaultDesc}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm font-semibold text-soft">
              <span className="flex items-center gap-2"><span className="text-ok">✓</span> {t.akun.feature1}</span>
              <span className="flex items-center gap-2"><span className="text-ok">✓</span> {t.akun.feature2}</span>
              <span className="flex items-center gap-2"><span className="text-ok">✓</span> {t.akun.feature3}</span>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
            <p className="eyebrow">{t.akun.dossier}</p>
            <StatusBadge status={account.status} lang={lang} />
          </div>
          <h1 className="section-heading font-display font-extrabold text-[clamp(2.2rem,11vw,3.8rem)] tracking-[-.04em] leading-[.98] text-text">
              {account.title}
          </h1>
          <div className="mt-5"><RankMark rank={account.rank} tierLabel={t.akun.tierLabel} /></div>

          <div className="grid grid-cols-2 gap-px mt-7 sm:mt-8 bg-line border border-line rounded-sm overflow-hidden">
            {specs.map((s) => (
              <div key={s.label} className="relative bg-surface p-3.5 sm:p-5 min-h-24 sm:min-h-28">
                <p className="text-[10px] font-extrabold tracking-[.12em] text-accent">{s.code}</p>
                <p className="font-display font-extrabold text-2xl sm:text-3xl mt-2 text-text line-clamp-1">{s.value}</p>
                <p className="text-xs text-faint mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="booking-panel mt-5 bg-surface border border-line rounded-sm p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
              <div><p className="text-xs text-soft font-semibold mb-1">{t.akun.from}</p><p className="font-display font-extrabold text-4xl text-text">
              {rp(account.price_per_hour)}
              <span className="font-body font-semibold text-base text-soft">{t.akun.perHour}</span>
              </p></div>
              <span className="text-right text-xs font-semibold text-faint">{t.akun.minHours}<br />{t.akun.maxHours}</span>
            </div>
            <p className="text-sm leading-relaxed text-soft my-5">{t.akun.bookingNote}</p>
            {ready ? (
              <Link
                href={`/sewa/${account.id}`}
                className="group flex items-center justify-between font-extrabold px-5 py-4 rounded-sm bg-accent text-onaccent hover:bg-accent2 transition-colors"
              >
                <span>{t.akun.rentThis}</span><span className="grid place-items-center w-7 h-7 rounded-sm bg-onaccent/10">›</span>
              </Link>
            ) : (
              <div>
                <span className="block text-center font-bold px-6 py-4 rounded-sm border border-line/60 text-faint cursor-not-allowed">
                  {t.akun.rentedBtn}
                </span>
                <p className="text-sm text-soft mt-3 text-center">
                  {t.akun.rentedNote}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
