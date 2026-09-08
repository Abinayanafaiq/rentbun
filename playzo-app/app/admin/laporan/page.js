import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { tanggal } from "@/lib/format";
import { setReportStatus, deleteReport } from "@/app/actions";
import ConfirmSubmit from "@/components/ConfirmSubmit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Laporan Akun Bermasalah — Rentzo" };

const BTN = "text-xs font-bold px-3.5 py-1.5 rounded-md border border-line transition-colors";

const TYPE_LABEL = {
  hackback: "Hackback",
  password: "Ganti password",
  scam: "Penipuan",
  other: "Lainnya",
};

const STATUS_LABEL = { pending: "Menunggu", verified: "Terverifikasi", rejected: "Ditolak" };
const STATUS_STYLE = {
  pending: "bg-surface2 text-warn border-warn/50",
  verified: "bg-surface2 text-ok border-ok/50",
  rejected: "bg-surface2 text-faint border-line2",
};

export default async function AdminLaporan() {
  if (!(await isAdmin())) redirect("/admin/login");

  const { rows } = await q(
    `SELECT * FROM account_reports
     ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'verified' THEN 1 ELSE 2 END, created_at DESC`
  );

  const count = (s) => rows.filter((r) => r.status === s).length;
  const cards = [
    { label: "Total laporan", value: rows.length },
    { label: "Menunggu verifikasi", value: count("pending") },
    { label: "Terverifikasi", value: count("verified") },
    { label: "Ditolak", value: count("rejected") },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div>
          <Link href="/admin" className="text-sm font-semibold text-soft hover:text-text">
            Kembali ke dashboard
          </Link>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 text-text">
            Laporan akun bermasalah
          </h1>
          <p className="text-soft">Verifikasi laporan sebelum dipajang di halaman publik /laporan.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface border border-line rounded-lg p-5">
            <p className="text-sm font-semibold text-soft">{c.label}</p>
            <p className="font-display font-extrabold text-3xl mt-1 text-text">{c.value}</p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-soft">Belum ada laporan masuk.</p>
      ) : (
        <div className="overflow-x-auto bg-surface border border-line rounded-lg">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-line text-left text-soft">
                <th className="p-4 font-display">Akun dilaporkan</th>
                <th className="p-4 font-display">Masalah</th>
                <th className="p-4 font-display">Penjual</th>
                <th className="p-4 font-display">Pelapor</th>
                <th className="p-4 font-display">Tanggal</th>
                <th className="p-4 font-display">Status</th>
                <th className="p-4 font-display">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line/50 last:border-0 align-top">
                  <td className="p-4">
                    <span className="font-bold block text-text font-mono">
                      {r.user_id_ingame}{r.zone_server ? ` (${r.zone_server})` : ""}
                    </span>
                    <span className="text-soft text-xs block">
                      {r.game}{r.nickname ? ` · ${r.nickname}` : ""}
                    </span>
                  </td>
                  <td className="p-4 max-w-[26ch]">
                    <span className="font-semibold block text-text">{TYPE_LABEL[r.problem_type] || r.problem_type}</span>
                    <span className="text-soft text-xs line-clamp-3 whitespace-pre-line">{r.description}</span>
                    {r.evidence_url && (
                      <a
                        href={r.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-accent underline underline-offset-2"
                      >
                        Bukti ↗
                      </a>
                    )}
                  </td>
                  <td className="p-4">
                    {r.seller ? (
                      <>
                        <span className="font-semibold block text-text">{r.seller}</span>
                        <span className="text-soft text-xs">{r.seller_contact}</span>
                      </>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold block text-text">{r.reporter_name}</span>
                    <span className="text-soft text-xs">{r.reporter_contact}</span>
                  </td>
                  <td className="p-4 text-soft text-xs">{tanggal(r.created_at)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded border whitespace-nowrap ${STATUS_STYLE[r.status] || STATUS_STYLE.pending}`}>
                      {STATUS_LABEL[r.status] || r.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {r.status !== "verified" && (
                        <form action={setReportStatus.bind(null, r.id, "verified")}>
                          <button className={`${BTN} bg-accent text-onaccent hover:bg-accent2`}>Verifikasi</button>
                        </form>
                      )}
                      {r.status !== "rejected" && (
                        <form action={setReportStatus.bind(null, r.id, "rejected")}>
                          <button className={`${BTN} text-soft hover:bg-surface2`}>Tolak</button>
                        </form>
                      )}
                      <ConfirmSubmit
                        action={deleteReport.bind(null, r.id)}
                        label="Hapus"
                        message={`Hapus laporan untuk akun ${r.user_id_ingame}?`}
                        className={`${BTN} text-soft hover:bg-surface2`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
