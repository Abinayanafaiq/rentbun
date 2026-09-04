import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/userAuth";
import RegisterForm from "@/components/RegisterForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Daftar — Rentzo" };

export default async function DaftarPage() {
  if (await getUserId()) redirect("/profil");

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl text-text">Buat akun</h1>
        <p className="text-soft mt-1.5">Daftar gratis untuk menyewa akun di Rentzo.</p>
        <p className="text-soft text-sm mt-2">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-bold text-accent hover:text-accent2">
            Masuk
          </Link>
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
