import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AccountForm from "@/components/AccountForm";

export const metadata = { title: "Tambah Akun — Rentzo" };

export default async function AkunBaru() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <Link href="/admin/akun" className="text-sm font-semibold text-soft hover:text-text">
        Kembali ke stok
      </Link>
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 mb-8 text-text">Tambah akun baru</h1>
      <AccountForm />
    </div>
  );
}
