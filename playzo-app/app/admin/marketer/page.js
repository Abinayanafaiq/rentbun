import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { tanggal } from "@/lib/format";
import { getVoucherBonusDays } from "@/lib/marketers";
import { saveVoucherSettings, toggleMarketer, deleteMarketer } from "@/app/actions";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import { input } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Marketer — Rentzo" };

const BTN = "text-xs font-bold px-3.5 py-1.5 rounded-md border border-line transition-colors";

export default async function AdminMarketer() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [{ rows: marketers }, bonusDays] = await Promise.all([
    q(`
      SELECT m.*,
        count(o.id) FILTER (WHERE o.status IN ('paid', 'done')) AS used_count,
        coalesce(sum(o.bonus_hours) FILTER (WHERE o.status IN ('paid', 'done')), 0) AS bonus_given
      FROM marketers m
      LEFT JOIN orders o ON o.marketer_id = m.id
      GROUP BY m.id
      ORDER BY m.id ASC
    `),
    getVoucherBonusDays(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div>
          <Link href="/admin" className="text-sm font-semibold text-soft hover:text-text">
            Kembali ke dashboard
          </Link>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 text-text">Marketer</h1>
          <p className="text-soft mt-1">
            Rekrut marketer sebanyak yang kamu mau. Tiap marketer punya kode kupon untuk dibagikan ke calon penyewa.
          </p>
        </div>
        <Link
          href="/admin/marketer/baru"
          className="font-bold text-sm px-5 py-2.5 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
        >
          Rekrut marketer
        </Link>
      </div>

      {/* Pengaturan bonus kupon */}
      <div className="bg-surface border border-line rounded-lg p-5 mb-8">
        <h2 className="font-display font-bold text-lg text-text mb-1">Bonus masa aktif kupon</h2>
        <p className="text-sm text-soft mb-4">
          Penyewa yang memasukkan kode kupon marketer saat checkout mendapat tambahan masa aktif sewa gratis.
        </p>
        <form action={saveVoucherSettings} className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="font-semibold text-sm">Tambahan masa aktif (hari)</span>
            <input
              name="bonus_days"
              type="number"
              min="1"
              max="365"
              defaultValue={bonusDays}
              className={`${input} w-36`}
            />
          </label>
          <button className="font-bold text-sm px-5 py-2.5 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors">
            Simpan pengaturan
          </button>
        </form>
      </div>

      {marketers.length === 0 ? (
        <p className="text-soft">Belum ada marketer. Rekrut marketer pertamamu.</p>
      ) : (
        <div className="overflow-x-auto bg-surface border border-line rounded-lg">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="border-b border-line text-left text-soft">
                <th className="p-4 font-display">Marketer</th>
                <th className="p-4 font-display">Kode kupon</th>
                <th className="p-4 font-display">Kupon terpakai</th>
                <th className="p-4 font-display">Bonus diberikan</th>
                <th className="p-4 font-display">Status</th>
                <th className="p-4 font-display">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {marketers.map((m) => (
                <tr key={m.id} className="border-b border-line/50 last:border-0 align-top">
                  <td className="p-4">
                    <span className="font-semibold block text-text">{m.name}</span>
                    <span className="text-soft text-xs">{m.wa || "Tanpa WA"} · sejak {tanggal(m.created_at)}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-text bg-surface2 border border-line rounded px-2 py-1">
                      {m.coupon_code}
                    </span>
                  </td>
                  <td className="p-4 text-text">{m.used_count}x</td>
                  <td className="p-4 text-text">
                    {m.bonus_given > 0 ? `${Math.round(m.bonus_given / 24)} hari` : "-"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex text-xs font-bold px-2.5 py-1 rounded border whitespace-nowrap ${
                        m.active
                          ? "bg-livebg text-live border-live/60"
                          : "bg-surface2 text-faint border-line2"
                      }`}
                    >
                      {m.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/marketer/${m.id}`}
                        className={`${BTN} text-text hover:bg-surface2`}
                      >
                        Edit
                      </Link>
                      <form action={toggleMarketer.bind(null, m.id)}>
                        <button className={`${BTN} text-text hover:bg-surface2`}>
                          {m.active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </form>
                      <ConfirmSubmit
                        action={deleteMarketer.bind(null, m.id)}
                        label="Hapus"
                        message={`Hapus marketer "${m.name}"? Kupon ${m.coupon_code} tidak bisa dipakai lagi. Riwayat order tetap tersimpan.`}
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
