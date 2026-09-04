import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import PackageForm from "@/components/PackageForm";

export const metadata = { title: "Tambah Paket — Rentzo" };

export default async function PaketBaru() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <Link href="/admin/paket" className="text-sm font-semibold underline underline-offset-4 text-ink/60 hover:text-ink">
        Kembali ke paket
      </Link>
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 mb-8">Tambah paket baru</h1>
      <PackageForm />
    </div>
  );
}
