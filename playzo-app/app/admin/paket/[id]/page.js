import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import PackageForm from "@/components/PackageForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Paket — Rentzo" };

export default async function EditPaket({ params }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const { rows } = await q("SELECT * FROM packages WHERE id = $1", [Number(id) || 0]);
  const pkg = rows[0];
  if (!pkg) notFound();

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <Link href="/admin/paket" className="text-sm font-semibold text-soft hover:text-text">
        Kembali ke paket
      </Link>
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 mb-8 text-text">Edit paket</h1>
      <PackageForm pkg={pkg} />
    </div>
  );
}
