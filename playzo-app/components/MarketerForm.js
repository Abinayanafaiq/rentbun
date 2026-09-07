"use client";

import { useActionState } from "react";
import { saveMarketer } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";

export default function MarketerForm({ marketer }) {
  const m = marketer || {};
  const [state, formAction, pending] = useActionState(saveMarketer, null);

  return (
    <form action={formAction} className={`${card} p-6`}>
      {m.id && <input type="hidden" name="id" value={m.id} />}

      <label className={`${label} mb-4`}>
        <span className={span}>Nama marketer</span>
        <input name="name" required defaultValue={m.name} placeholder="contoh: Raka" className={input} />
      </label>

      <label className={`${label} mb-4`}>
        <span className={span}>Nomor WhatsApp (opsional)</span>
        <input name="wa" type="tel" defaultValue={m.wa} placeholder="contoh: 081234567890" className={input} />
      </label>

      <label className={`${label} mb-6`}>
        <span className={span}>Kode kupon</span>
        <input
          name="coupon_code"
          defaultValue={m.coupon_code}
          placeholder={m.id ? "Kosongkan untuk tetap pakai kode lama" : "Kosongkan untuk auto-generate"}
          className={`${input} uppercase`}
          maxLength={24}
        />
        <span className="text-xs text-soft mt-1 block">
          Kode ini yang dibagikan marketer ke calon penyewa. Huruf, angka, dan strip saja.
        </span>
      </label>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Menyimpan..." : m.id ? "Simpan perubahan" : "Rekrut marketer"}
      </button>
    </form>
  );
}
