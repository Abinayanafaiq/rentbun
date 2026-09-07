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

      <div className="border-t border-line pt-5 mt-5 mb-6">
        <p className="font-semibold text-sm mb-1">Login dashboard marketer</p>
        <p className="text-xs text-soft mb-4">
          Marketer masuk di halaman <span className="font-mono font-bold">/marketer/login</span> pakai email &amp; password ini
          untuk memantau dan membuat kode kuponnya sendiri.
        </p>

        <label className={`${label} mb-4`}>
          <span className={span}>Email login</span>
          <input
            name="email"
            type="email"
            required
            defaultValue={m.email}
            placeholder="contoh: raka@email.com"
            className={input}
          />
        </label>

        <label className={label}>
          <span className={span}>Password</span>
          <input
            name="password"
            type="text"
            required={!m.id}
            minLength={6}
            placeholder={m.id ? "Kosongkan kalau tidak diganti" : "Minimal 6 karakter"}
            className={input}
          />
          <span className="text-xs text-soft mt-1 block">
            {m.id
              ? "Isi hanya kalau mau reset password marketer ini."
              : "Catat password ini dan berikan ke marketer bersama emailnya."}
          </span>
        </label>
      </div>

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
