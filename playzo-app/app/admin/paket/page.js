import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { rp } from "@/lib/format";
import { deletePackage } from "@/app/actions";
import ConfirmSubmit from "@/components/ConfirmSubmit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Paket — Rentzo" };

function durasiText(hours) {
  if (hours % 24 === 0) {
    const days = hours / 24;
    if (days % 7 === 0) return `${days / 7} minggu`;
    return `${days} hari`;
  }
  return `${hours} jam`;
}

export default async function AdminPaket() {
  if (!(await isAdmin())) redirect("/admin/login");

  const { rows: packages } = await q("SELECT * FROM packages ORDER BY duration_hours ASC");

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div>
          <Link href="/admin" className="text-sm font-semibold text-soft hover:text-text">
            Kembali ke dashboard
          </Link>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 text-text">Paket sewa</h1>
          <p className="text-soft mt-1">
            Paket berlaku untuk semua akun. Pembeli tetap bisa pilih sewa per jam.
          </p>
        </div>
        <Link
          href="/admin/paket/baru"
          className="font-bold text-sm px-5 py-2.5 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
        >
          Tambah paket
        </Link>
      </div>

      {packages.length === 0 ? (
        <p className="text-soft">Belum ada paket. Pembeli hanya bisa sewa per jam.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((p) => (
            <div key={p.id} className="bg-surface border border-line rounded-lg p-5 flex flex-col">
              <p className="font-display font-extrabold text-2xl text-text">{p.label}</p>
              <p className="text-sm text-soft">{durasiText(p.duration_hours)} ({p.duration_hours} jam)</p>
              <p className="font-display font-extrabold text-3xl mt-3 mb-5 text-text">{rp(p.price)}</p>
              <div className="flex gap-2 mt-auto">
                <Link
                  href={`/admin/paket/${p.id}`}
                  className="flex-1 text-center text-xs font-bold px-3.5 py-2 rounded-md border border-line text-text hover:bg-surface2 transition-colors"
                >
                  Edit
                </Link>
                <ConfirmSubmit
                  action={deletePackage.bind(null, p.id)}
                  label="Hapus"
                  message={`Hapus paket "${p.label}"? Order yang sudah ada tidak terpengaruh.`}
                  className="flex-1 text-xs font-bold px-3.5 py-2 rounded-md border border-line text-soft hover:bg-surface2 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
