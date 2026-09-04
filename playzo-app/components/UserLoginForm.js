"use client";

import { useActionState } from "react";
import { loginUser } from "@/app/actions";
import { input } from "@/components/ui";

export default function UserLoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, null);

  return (
    <form action={formAction} className="auth-form">
      <label className="auth-field block mb-5">
        <span className="block text-xs font-extrabold tracking-wide text-soft mb-2">Email</span>
        <input name="email" type="email" required autoFocus placeholder="nama@email.com" className={`${input} auth-input`} />
      </label>
      <label className="auth-field block mb-6">
        <span className="block text-xs font-extrabold tracking-wide text-soft mb-2">Password</span>
        <input name="password" type="password" required placeholder="Masukkan password" className={`${input} auth-input`} />
      </label>

      {state?.error && (
          <p className="mb-5 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-sm px-4 py-3">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="auth-submit w-full flex items-center justify-between font-extrabold px-5 py-4 rounded-sm bg-accent text-onaccent hover:bg-accent2 transition-colors disabled:opacity-50">
        <span>{pending ? "Memeriksa..." : "Masuk ke Rentzo"}</span><span className="text-xl leading-none" aria-hidden="true">→</span>
      </button>
    </form>
  );
}
