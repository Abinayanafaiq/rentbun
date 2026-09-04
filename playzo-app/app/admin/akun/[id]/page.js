import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { photoUrl } from "@/lib/storage";
import AccountForm from "@/components/AccountForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Akun — Rentzo" };

export default async function EditAkun({ params }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const { rows } = await q("SELECT * FROM accounts WHERE id = $1", [Number(id) || 0]);
  const account = rows[0];
  if (!account) notFound();

  const photoItems = await Promise.all(
    (account.photos || []).map(async (key) => ({ key, url: await photoUrl(key) }))
  );

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <Link href="/admin/akun" className="text-sm font-semibold text-soft hover:text-text">
        Kembali ke stok
      </Link>
      <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] mt-1.5 mb-8 text-text">
        Edit akun
      </h1>
      <AccountForm account={account} photoItems={photoItems} />
    </div>
  );
}
