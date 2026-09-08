import Link from "next/link";
import { q } from "@/lib/db";
import { tanggal } from "@/lib/format";
import { getDict } from "@/lib/i18n";
import ReportFilter from "@/components/ReportFilter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daftar Akun Bermasalah & Hackback — Rentzo",
  description:
    "Cek daftar akun Mobile Legends dan game lain yang dilaporkan hackback, ganti password, atau penipuan sebelum membeli akun. Laporan dari pembeli nyata, diverifikasi admin Rentzo.",
};

export default async function LaporanPage() {
  const [{ rows: stats }, { rows: raw }, t] = await Promise.all([
    q(`
      SELECT
        count(*) FILTER (WHERE status <> 'rejected') AS total,
        count(*) FILTER (WHERE status = 'verified') AS verified,
        count(*) FILTER (WHERE status = 'pending') AS pending
      FROM account_reports
    `),
    q(
      `SELECT id, game, user_id_ingame, zone_server, nickname, seller, seller_contact, problem_type, description, evidence_url, created_at
       FROM account_reports WHERE status = 'verified' ORDER BY created_at DESC`
    ),
    getDict(),
  ]);

  const s = stats[0] || { total: 0, verified: 0, pending: 0 };
  const reports = raw.map((r) => ({ ...r, dateLabel: tanggal(r.created_at) }));

  const cards = [
    { label: t.reports.statsTotal, value: s.total },
    { label: t.reports.statsVerified, value: s.verified },
    { label: t.reports.statsPending, value: s.pending },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      <div className="mb-9">
        <p className="eyebrow mb-2">{t.reports.eyebrow}</p>
        <h1 className="section-heading font-display font-extrabold text-[clamp(1.9rem,5vw,3rem)] text-text mb-3">
          {t.reports.title}
        </h1>
        <p className="text-soft max-w-[62ch] leading-relaxed">{t.reports.desc}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-9">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface border border-line rounded-lg p-5">
            <p className="text-sm font-semibold text-soft">{c.label}</p>
            <p className="font-display font-extrabold text-2xl sm:text-3xl mt-1 text-text">{c.value}</p>
          </div>
        ))}
      </div>

      <ReportFilter reports={reports} t={t.reports} />

      <section className="accent-panel rounded-sm px-5 sm:px-7 py-10 sm:py-12 mt-12 text-center">
        <h2 className="font-display font-extrabold text-[clamp(1.6rem,4vw,2.4rem)] text-onaccent mb-3">
          {t.reports.ctaTitle}
        </h2>
        <p className="text-onaccent/80 max-w-[46ch] mx-auto mb-7">{t.reports.ctaDesc}</p>
        <Link
          href="/laporan/lapor"
          className="inline-flex justify-center font-bold px-7 py-3.5 sm:py-3 rounded-sm bg-bg text-text hover:bg-surface2 transition-colors"
        >
          {t.reports.ctaBtn}
        </Link>
      </section>
    </div>
  );
}
