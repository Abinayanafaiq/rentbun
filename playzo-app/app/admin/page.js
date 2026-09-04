import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { rp, tanggal } from "@/lib/format";
import { markPaid, markDone, cancelOrder, logout } from "@/app/actions";
import StatusBadge from "@/components/StatusBadge";
import ConfirmSubmit from "@/components/ConfirmSubmit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard Admin — Rentzo" };

const BTN = "text-xs font-bold px-3.5 py-1.5 rounded-full border-2 border-ink transition-transform hover:-translate-y-0.5";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [{ rows: stats }, { rows: orders }] = await Promise.all([
    q(`
      SELECT
        (SELECT count(*) FROM accounts WHERE status = 'ready') AS ready,
        (SELECT count(*) FROM accounts WHERE status = 'rented') AS rented,
        (SELECT count(*) FROM orders WHERE status = 'pending') AS pending,
        (SELECT coalesce(sum(total), 0) FROM orders WHERE status IN ('paid', 'done')) AS revenue
    `),
    q("SELECT * FROM orders ORDER BY created_at DESC LIMIT 50"),
  ]);

  const s = stats[0];
  const cards = [
    { label: "Akun siap sewa", value: s.ready },
    { label: "Akun sedang disewa", value: s.rented },
    { label: "Order menunggu bayar", value: s.pending },
    { label: "Total pendapatan", value: rp(s.revenue) },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)]">Dashboard</h1>
          <p className="text-ink/70">Ringkasan stok dan order masuk.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/akun"
            className="font-bold text-sm px-5 py-3 rounded-full border-[2.5px] border-ink bg-yellow shadow-hard-sm transition-transform hover:-translate-y-0.5"
          >
            Kelola stok akun
          </Link>
          <Link
            href="/admin/paket"
            className="font-bold text-sm px-5 py-3 rounded-full border-[2.5px] border-ink bg-teal text-paper2 shadow-hard-sm transition-transform hover:-translate-y-0.5"
          >
            Kelola paket sewa
          </Link>
          <form action={logout}>
            <button className="font-bold text-sm px-5 py-3 rounded-full border-[2.5px] border-ink hover:bg-ink hover:text-paper transition-colors">
              Keluar
            </button>
          </form>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-11">
        {cards.map((c) => (
          <div key={c.label} className="bg-paper2 border-[2.5px] border-ink rounded-2xl p-5 shadow-hard-sm">
            <p className="text-sm font-semibold text-ink/60">{c.label}</p>
            <p className="font-display font-extrabold text-3xl mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabel order */}
      <h2 className="font-display font-extrabold text-2xl mb-4">Order terbaru</h2>
      {orders.length === 0 ? (
        <p className="text-ink/70">Belum ada order masuk.</p>
      ) : (
        <div className="overflow-x-auto bg-paper2 border-[2.5px] border-ink rounded-2xl shadow-hard">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="border-b-[2.5px] border-ink text-left">
                <th className="p-4 font-display">Kode</th>
                <th className="p-4 font-display">Penyewa</th>
                <th className="p-4 font-display">Akun</th>
                <th className="p-4 font-display">Durasi</th>
                <th className="p-4 font-display">Total</th>
                <th className="p-4 font-display">Status</th>
                <th className="p-4 font-display">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/15 last:border-0 align-top">
                  <td className="p-4">
                    <span className="font-bold block">{o.code}</span>
                    <span className="text-ink/60 text-xs">{tanggal(o.created_at)}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold block">{o.buyer_name}</span>
                    <span className="text-ink/60 text-xs">{o.buyer_wa}</span>
                  </td>
                  <td className="p-4">{o.account_title}</td>
                  <td className="p-4">
                    {o.package_label ? `Paket ${o.package_label}` : `${o.hours} jam`}
                  </td>
                  <td className="p-4 font-bold">{rp(o.total)}</td>
                  <td className="p-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {o.status === "pending" && (
                        <>
                          <form action={markPaid.bind(null, o.id)}>
                            <button className={`${BTN} bg-tealsoft`}>Tandai lunas</button>
                          </form>
                          <ConfirmSubmit
                            action={cancelOrder.bind(null, o.id)}
                            label="Batal"
                            message={`Batalkan order ${o.code}?`}
                            className={`${BTN} bg-ink/5`}
                          />
                        </>
                      )}
                      {o.status === "paid" && (
                        <form action={markDone.bind(null, o.id)}>
                          <button className={`${BTN} bg-yellow`}>Selesai &amp; buka stok</button>
                        </form>
                      )}
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
