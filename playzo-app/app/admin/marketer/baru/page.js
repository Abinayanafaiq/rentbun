import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import MarketerForm from "@/components/MarketerForm";

export const metadata = { title: "Rekrut Marketer — Rentzo" };

export default async function MarketerBaru() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <Link href="/admin/marketer" className="text-sm font-semibold text-soft hover:text-text">
        Kembali ke marketer
      </Link>
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 mb-8 text-text">Rekrut marketer baru</h1>
      <MarketerForm />
    </div>
  );
}
