import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { tanggal } from "@/lib/format";
import MarketerForm from "@/components/MarketerForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Marketer — Rentzo" };

export default async function EditMarketer({ params }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const [{ rows }, { rows: coupons }] = await Promise.all([
    q("SELECT * FROM marketers WHERE id = $1", [Number(id) || 0]),
    q(
      `SELECT c.*,
         count(o.id) FILTER (WHERE o.status IN ('paid', 'done')) AS used_count
       FROM coupons c
       LEFT JOIN orders o ON o.coupon_code = c.code AND o.marketer_id = c.marketer_id
       WHERE c.marketer_id = $1
       GROUP BY c.id
       ORDER BY c.id DESC`,
      [Number(id) || 0]
    ),
  ]);
  const marketer = rows[0];
  if (!marketer) notFound();

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <Link href="/admin/marketer" className="text-sm font-semibold text-soft hover:text-text">
        Kembali ke marketer
      </Link>
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 mb-8 text-text">Edit marketer</h1>
      <MarketerForm marketer={marketer} />

      {/* Kupon milik marketer (dikelola marketer sendiri di dashboardnya) */}
      <h2 className="font-display font-extrabold text-2xl text-text mt-12 mb-4">Kupon milik {marketer.name}</h2>
      {coupons.length === 0 ? (
        <p className="text-soft bg-surface border border-line rounded-lg p-6">
          Marketer ini belum membuat kode kupon.
        </p>
      ) : (
        <div className="bg-surface border border-line rounded-lg divide-y divide-line/50">
          {coupons.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <span className="font-mono font-bold text-text bg-surface2 border border-line rounded px-2 py-1">
                  {c.code}
                </span>
                <span className="text-soft text-xs block mt-1.5">Dibuat {tanggal(c.created_at)}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-text block">{c.used_count}x dipakai</span>
                <span
                  className={`inline-flex text-xs font-bold px-2.5 py-1 rounded border mt-1 ${
                    c.active ? "bg-livebg text-live border-live/60" : "bg-surface2 text-faint border-line2"
                  }`}
                >
                  {c.active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-soft mt-3">
        Kupon dibuat dan dikelola oleh marketer lewat dashboard mereka sendiri.
      </p>
    </div>
  );
}
