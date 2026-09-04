"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className={`${card} p-6`}>
      <label className={`${label} mb-4`}>
        <span className={span}>Password admin</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
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
        {pending ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
