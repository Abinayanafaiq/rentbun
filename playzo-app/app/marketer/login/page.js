import { redirect } from "next/navigation";
import { getCurrentMarketer } from "@/lib/marketerAuth";
import MarketerLoginForm from "@/components/MarketerLoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Login Marketer — Rentzo" };

export default async function MarketerLoginPage() {
  if (await getCurrentMarketer()) redirect("/marketer");

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl text-text">Area marketer</h1>
        <p className="text-soft mt-1.5">
          Masuk untuk memantau performa kuponmu. Belum punya akun? Minta admin mendaftarkanmu.
        </p>
      </div>
      <MarketerLoginForm />
    </div>
  );
}
