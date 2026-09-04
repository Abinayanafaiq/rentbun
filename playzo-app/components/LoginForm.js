"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="bg-paper2 border-[2.5px] border-ink rounded-2xl p-6 shadow-hard">
      <label className="block mb-4">
        <span className="font-semibold text-sm">Password admin</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Masukkan password"
          className="mt-1.5 w-full border-[2.5px] border-ink rounded-xl px-4 py-3 bg-paper font-medium focus:outline-none focus:ring-3 focus:ring-teal/50"
        />
      </label>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-reddeep bg-red/10 border-2 border-reddeep/40 rounded-xl px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full font-bold px-6 py-3.5 rounded-full border-[2.5px] border-ink bg-ink text-paper shadow-hard-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {pending ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
