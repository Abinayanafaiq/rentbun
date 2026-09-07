"use client";

import { useActionState } from "react";
import { createCoupon } from "@/app/actions";
import { input } from "@/components/ui";

export default function CouponForm() {
  const [state, formAction, pending] = useActionState(createCoupon, null);

  return (
    <form action={formAction}>
      <div className="flex flex-wrap gap-3">
        <input
          name="code"
          placeholder="contoh: RAKAHEMAT — kosongkan untuk kode acak"
          className={`${input} uppercase flex-1 min-w-56`}
          maxLength={24}
        />
        <button
          type="submit"
          disabled={pending}
          className="font-bold text-sm px-5 py-2.5 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors disabled:opacity-50"
        >
          {pending ? "Membuat..." : "Buat kupon"}
        </button>
      </div>
      {state?.error && (
        <p className="mt-3 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}
    </form>
  );
}
