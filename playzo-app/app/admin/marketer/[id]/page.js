import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import MarketerForm from "@/components/MarketerForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Marketer — Rentzo" };

export default async function EditMarketer({ params }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const { rows } = await q("SELECT * FROM marketers WHERE id = $1", [Number(id) || 0]);
  const marketer = rows[0];
  if (!marketer) notFound();

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <Link href="/admin/marketer" className="text-sm font-semibold text-soft hover:text-text">
        Kembali ke marketer
      </Link>
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 mb-8 text-text">Edit marketer</h1>
      <MarketerForm marketer={marketer} />
    </div>
  );
}
