import Link from "next/link";
import { getDict } from "@/lib/i18n";
import ReportForm from "@/components/ReportForm";

export const metadata = {
  title: "Laporkan Akun Bermasalah — Rentzo",
  description:
    "Laporkan akun hackback, ganti password, atau penipuan. Bantu pembeli akun lain terhindar dari penjual nakal.",
};

export default async function LaporPage() {
  const t = await getDict();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <nav className="flex items-center gap-2 text-xs sm:text-sm mb-6 sm:mb-8 min-w-0" aria-label="Breadcrumb">
        <Link href="/" className="font-semibold text-faint hover:text-accent">{t.akun.home}</Link>
        <span className="text-line2">/</span>
        <Link href="/laporan" className="font-semibold text-faint hover:text-accent">{t.header.reports}</Link>
        <span className="text-line2">/</span>
        <span className="font-semibold text-soft line-clamp-1">{t.reports.formTitle}</span>
      </nav>

      <div className="mb-8">
        <h1 className="section-heading font-display font-extrabold text-[clamp(1.8rem,4vw,2.6rem)] text-text mb-3">
          {t.reports.formTitle}
        </h1>
        <p className="text-soft leading-relaxed">{t.reports.formSub}</p>
      </div>

      <ReportForm t={t.reports} />
    </div>
  );
}
