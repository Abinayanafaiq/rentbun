import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { deleteAccount } from "@/app/actions";
import StatusBadge from "@/components/StatusBadge";
import ConfirmSubmit from "@/components/ConfirmSubmit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Akun — Rentzo" };

export default async function AdminAkun() {
  if (!(await isAdmin())) redirect("/admin/login");

  const { rows: accounts } = await q("SELECT * FROM accounts ORDER BY id ASC");

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div>
          <Link href="/admin" className="text-sm font-semibold underline underline-offset-4 text-ink/60 hover:text-ink">
            Kembali ke dashboard
          </Link>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5">Stok akun</h1>
        </div>
        <Link
          href="/admin/akun/baru"
          className="font-bold text-sm px-5 py-3 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          Tambah akun
        </Link>
      </div>

      {accounts.length === 0 ? (
        <p className="text-ink/70">Stok kosong. Tambah akun pertamamu.</p>
      ) : (
        <div className="overflow-x-auto bg-paper2 border-[2.5px] border-ink rounded-2xl shadow-hard">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="border-b-[2.5px] border-ink text-left">
                <th className="p-4 font-display">Akun</th>
                <th className="p-4 font-display">Rank</th>
                <th className="p-4 font-display">Hero / Skin</th>
                <th className="p-4 font-display">Harga</th>
                <th className="p-4 font-display">Email login</th>
                <th className="p-4 font-display">Status</th>
                <th className="p-4 font-display">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-b border-ink/15 last:border-0 align-top">
                  <td className="p-4 font-semibold">{a.title}</td>
                  <td className="p-4">{a.rank}</td>
                  <td className="p-4">
                    {a.heroes} / {a.skins}
                  </td>
                  <td className="p-4 font-bold">{rp(a.price_per_hour)}/jam</td>
                  <td className="p-4 text-ink/70">{a.email}</td>
                  <td className="p-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/akun/${a.id}`}
                        className="text-xs font-bold px-3.5 py-1.5 rounded-full border-2 border-ink bg-yellow transition-transform hover:-translate-y-0.5"
                      >
                        Edit
                      </Link>
                      <ConfirmSubmit
                        action={deleteAccount.bind(null, a.id)}
                        label="Hapus"
                        message={`Hapus akun "${a.title}"? Riwayat order tetap tersimpan.`}
                        className="text-xs font-bold px-3.5 py-1.5 rounded-full border-2 border-ink bg-ink/5 transition-transform hover:-translate-y-0.5"
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
