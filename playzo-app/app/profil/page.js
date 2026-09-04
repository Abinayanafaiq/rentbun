import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/userAuth";
import { q } from "@/lib/db";
import { rp, tanggal } from "@/lib/format";
import { logoutUser } from "@/app/actions";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profil — Rentzo" };

export default async function ProfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");

  const { rows: orders } = await q(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [user.id]
  );

  return (
    <div className="max-w-xl mx-auto px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-text">Halo, {user.name}!</h1>
          <p className="text-soft mt-1">Ini akunmu di Rentzo.</p>
        </div>
        <form action={logoutUser}>
          <button className="font-bold text-sm px-5 py-2.5 rounded-md border border-line text-text hover:bg-surface2 transition-colors">
            Keluar
          </button>
        </form>
      </div>

      <div className="bg-surface border border-line rounded-lg p-6">
        <dl className="divide-y divide-line">
          <div className="flex justify-between py-3">
            <dt className="text-soft font-semibold">Nama</dt>
            <dd className="font-bold text-text">{user.name}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-soft font-semibold">Email</dt>
            <dd className="font-bold text-text">{user.email}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-soft font-semibold">WhatsApp</dt>
            <dd className="font-bold text-text">{user.wa || "-"}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-soft font-semibold">Terdaftar sejak</dt>
            <dd className="font-bold text-text">{tanggal(user.created_at)}</dd>
          </div>
        </dl>
      </div>

      <Link
        href="/#katalog"
        className="mt-6 block text-center font-bold px-6 py-4 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
      >
        Jelajahi katalog &amp; sewa akun
      </Link>

      {/* Riwayat order */}
      <h2 className="font-display font-extrabold text-2xl text-text mt-12 mb-4">Riwayat order</h2>
      {orders.length === 0 ? (
        <p className="text-soft bg-surface border border-line rounded-lg p-6">
          Kamu belum punya order. Mulai sewa akun pertama lewat katalog.
        </p>
      ) : (
        <div className="overflow-x-auto bg-surface border border-line rounded-lg">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-line text-left text-soft">
                <th className="p-4 font-display">Kode</th>
                <th className="p-4 font-display">Akun</th>
                <th className="p-4 font-display">Durasi</th>
                <th className="p-4 font-display">Total</th>
                <th className="p-4 font-display">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line/50 last:border-0 align-top">
                  <td className="p-4">
                    <Link href={`/order/${o.code}`} className="font-bold block text-text hover:underline">
                      {o.code}
                    </Link>
                    <span className="text-soft text-xs">{tanggal(o.created_at)}</span>
                  </td>
                  <td className="p-4 text-text">{o.account_title}</td>
                  <td className="p-4 text-text">{o.package_label ? `Paket ${o.package_label}` : `${o.hours} jam`}</td>
                  <td className="p-4 font-bold text-text">{rp(o.total)}</td>
                  <td className="p-4">
                    <StatusBadge status={o.status} />
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
