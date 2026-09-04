import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/userAuth";
import UserLoginForm from "@/components/UserLoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Masuk — Rentzo" };

export default async function MasukPage() {
  if (await getUserId()) redirect("/profil");

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl text-text">Masuk</h1>
        <p className="text-soft mt-1.5">Masuk untuk melanjutkan sewa akunmu.</p>
        <p className="text-soft text-sm mt-2">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-bold text-accent hover:text-accent2">
            Daftar
          </Link>
        </p>
      </div>
      <UserLoginForm />
    </div>
  );
}
