import { redirect } from "next/navigation";
import { getCurrentMarketer } from "@/lib/marketerAuth";
import { getDict } from "@/lib/i18n";
import MarketerLoginForm from "@/components/MarketerLoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Login Marketer — Rentzo" };

export default async function MarketerLoginPage() {
  if (await getCurrentMarketer()) redirect("/marketer");

  const t = await getDict();

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl text-text">{t.marketer.loginTitle}</h1>
        <p className="text-soft mt-1.5">
          {t.marketer.loginSub}
        </p>
      </div>
      <MarketerLoginForm t={t.marketer} />
    </div>
  );
}
