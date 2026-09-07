import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/userAuth";
import { getDict } from "@/lib/i18n";
import RegisterForm from "@/components/RegisterForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Daftar — Rentzo" };

export default async function DaftarPage() {
  if (await getUserId()) redirect("/profil");

  const t = await getDict();

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl text-text">{t.auth.regTitle}</h1>
        <p className="text-soft mt-1.5">{t.auth.regSub}</p>
        <p className="text-soft text-sm mt-2">
          {t.auth.haveAccount}{" "}
          <Link href="/masuk" className="font-bold text-accent hover:text-accent2">
            {t.auth.loginHere}
          </Link>
        </p>
      </div>
      <RegisterForm t={t.auth} />
    </div>
  );
}
