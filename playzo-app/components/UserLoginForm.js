"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";

export default function UserLoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, null);

  return (
    <form action={formAction} className={`${card} p-6`}>
      <label className={`${label} mb-4`}>
        <span className={span}>Email</span>
        <input name="email" type="email" required autoFocus placeholder="kamu@contoh.com" className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>Password</span>
        <input name="password" type="password" required placeholder="Masukkan password" className={input} />
      </label>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Memeriksa..." : "Masuk"}
      </button>

      <p className="text-sm text-center text-soft mt-4">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-bold text-accent hover:text-accent2">
          Daftar di sini
        </Link>
      </p>
    </form>
  );
}
