"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";
import { dict } from "@/lib/dict";

export default function RegisterForm({ t = dict.id.auth }) {
  const [state, formAction, pending] = useActionState(registerUser, null);

  return (
    <form action={formAction} className={`${card} p-6`}>
      <label className={`${label} mb-4`}>
        <span className={span}>{t.name}</span>
        <input name="name" type="text" required autoFocus placeholder={t.namePh} className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>{t.email}</span>
        <input name="email" type="email" required placeholder={t.regEmailPh} className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>{t.wa}</span>
        <input name="wa" type="text" placeholder="08xxxxxxxxxx" className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>{t.password}</span>
        <input name="password" type="password" required minLength={6} placeholder={t.passMinPh} className={input} />
      </label>
      <label className={`${label} mb-4`}>
        <span className={span}>{t.confirm}</span>
        <input name="confirm" type="password" required minLength={6} placeholder={t.confirmPh} className={input} />
      </label>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? t.regLoading : t.regBtn}
      </button>

      <p className="text-sm text-center text-soft mt-4">
        {t.haveAccount}{" "}
        <Link href="/masuk" className="font-bold text-accent hover:text-accent2">
          {t.loginHereLong}
        </Link>
      </p>
    </form>
  );
}
