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
          <Link href="/admin" className="text-sm font-semibold underline underline-offset-4 text-ink/60 hover:text-ink">
            Kembali ke dashboard
          </Link>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5">Paket sewa</h1>
          <p className="text-ink/70 mt-1">
            Paket berlaku untuk semua akun. Pembeli tetap bisa pilih sewa per jam.
          </p>
        </div>
        <Link
          href="/admin/paket/baru"
          className="font-bold text-sm px-5 py-3 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          Tambah paket
        </Link>
      </div>

      {packages.length === 0 ? (
        <p className="text-ink/70">Belum ada paket. Pembeli hanya bisa sewa per jam.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((p) => (
            <div key={p.id} className="bg-paper2 border-[2.5px] border-ink rounded-2xl p-5 shadow-hard flex flex-col">
              <p className="font-display font-extrabold text-2xl">{p.label}</p>
              <p className="text-sm text-ink/60">{durasiText(p.duration_hours)} ({p.duration_hours} jam)</p>
              <p className="font-display font-extrabold text-3xl mt-3 mb-5">{rp(p.price)}</p>
              <div className="flex gap-2 mt-auto">
                <Link
                  href={`/admin/paket/${p.id}`}
                  className="flex-1 text-center text-xs font-bold px-3.5 py-2 rounded-full border-2 border-ink bg-yellow transition-transform hover:-translate-y-0.5"
                >
                  Edit
                </Link>
                <ConfirmSubmit
                  action={deletePackage.bind(null, p.id)}
                  label="Hapus"
                  message={`Hapus paket "${p.label}"? Order yang sudah ada tidak terpengaruh.`}
                  className="flex-1 text-xs font-bold px-3.5 py-2 rounded-full border-2 border-ink bg-ink/5 transition-transform hover:-translate-y-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
