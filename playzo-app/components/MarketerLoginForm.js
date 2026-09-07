"use client";

import { useActionState } from "react";
import { loginMarketer } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";

export default function MarketerLoginForm() {
  const [state, formAction, pending] = useActionState(loginMarketer, null);

  return (
    <form action={formAction} className={`${card} p-6`}>
      <label className={`${label} mb-4`}>
        <span className={span}>Email</span>
        <input
          name="email"
          type="email"
          required
          autoFocus
          placeholder="nama@email.com"
          className={input}
        />
      </label>

      <label className={`${label} mb-6`}>
        <span className={span}>Password</span>
        <input
          name="password"
          type="password"
          required
          placeholder="Masukkan password"
          className={input}
        />
      </label>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Memeriksa..." : "Masuk ke dashboard"}
      </button>
    </form>
  );
}
