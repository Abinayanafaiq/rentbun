"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, null);

  return (
    <form action={formAction} className={`${card} p-6`}>
      <label className={`${label} mb-4`}>
        <span className={span}>Nama</span>
        <input name="name" type="text" required autoFocus placeholder="Nama lengkap atau nickname" className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>Email</span>
        <input name="email" type="email" required placeholder="kamu@contoh.com" className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>Nomor WhatsApp</span>
        <input name="wa" type="text" placeholder="08xxxxxxxxxx" className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>Password</span>
        <input name="password" type="password" required minLength={6} placeholder="Minimal 6 karakter" className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>Ulangi password</span>
        <input name="confirm" type="password" required minLength={6} placeholder="Ketik ulang password" className={input} />
      </label>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Mendaftarkan..." : "Daftar"}
      </button>

      <p className="text-sm text-center text-soft mt-4">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-bold text-accent hover:text-accent2">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
