"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createOrder } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";
import { dict, fill } from "@/lib/dict";

const rp = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

export default function CheckoutForm({ account, packages = [], defaultName = "", defaultWa = "", bonusDays = 3, t = dict.id.checkout }) {
  const [hours, setHours] = useState(3);
  const [mode, setMode] = useState("custom"); // "custom" atau string id paket
  const [state, formAction, pending] = useActionState(createOrder, null);

  function durasiText(h) {
    if (h % 24 === 0) {
      const days = h / 24;
      if (days % 7 === 0) return fill(t.weeks, { n: days / 7 });
      return fill(t.days, { n: days });
    }
    return fill(t.hours, { n: h });
  }

  const selectedPkg = packages.find((p) => String(p.id) === mode);
  const total = selectedPkg ? selectedPkg.price : account.price_per_hour * hours;

  return (
    <form action={formAction} className={`${card} p-6`}>
      <input type="hidden" name="account_id" value={account.id} />
      <input type="hidden" name="package_id" value={selectedPkg ? selectedPkg.id : 0} />

      <label className={`${label} mb-4`}>
        <span className={span}>{t.name}</span>
        <input name="name" required defaultValue={defaultName} placeholder={t.namePh} className={input} />
      </label>

      <label className={`${label} mb-5`}>
        <span className={span}>{t.wa}</span>
        <input name="wa" required type="tel" defaultValue={defaultWa} placeholder={t.waPh} className={input} />
      </label>

      <label className={`${label} mb-5`}>
        <span className={span}>{t.voucher}</span>
        <input
          name="coupon"
          placeholder={t.voucherPh}
          className={`${input} uppercase`}
          maxLength={24}
        />
        <span className="text-xs text-soft mt-1 block">
          {fill(t.voucherHint, { days: bonusDays })}
        </span>
      </label>

      {!defaultName && (
        <p className="text-xs text-soft mb-5">
          {t.noAccount}{" "}
          <Link href="/daftar" className="font-bold text-accent hover:text-accent2 underline underline-offset-2">
            {t.register}
          </Link>{" "}
          {t.noAccountTail}
        </p>
      )}

      <p className="font-semibold text-sm mb-2">{t.duration}</p>
      <div className="space-y-2.5 mb-5">
        {/* Opsi per jam */}
        <label
          className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
            mode === "custom" ? "border-accent bg-accent/10" : "border-line hover:border-line2"
          }`}
        >
          <input
            type="radio"
            name="durasi_mode"
            checked={mode === "custom"}
            onChange={() => setMode("custom")}
            className="w-4 h-4 accent-[#9146FF]"
          />
          <span className="font-semibold flex-1">{t.perHour}</span>
          <span className="text-sm text-soft">{rp(account.price_per_hour)}{t.perHourUnit}</span>
        </label>

        {mode === "custom" && (
          <div className="pl-4 pb-1">
            <input
              name="hours"
              type="number"
              min="1"
              max="72"
              value={hours}
              onChange={(e) => setHours(Math.max(1, Math.min(72, Number(e.target.value) || 1)))}
              className={input}
              aria-label={t.hoursAria}
            />
            <p className="text-xs text-soft mt-1.5">{t.hoursHint}</p>
          </div>
        )}
        {mode !== "custom" && <input type="hidden" name="hours" value={selectedPkg.duration_hours} />}

        {/* Opsi paket dari admin */}
        {packages.map((p) => {
          const hemat = account.price_per_hour * p.duration_hours - p.price;
          return (
            <label
              key={p.id}
              className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                mode === String(p.id) ? "border-accent bg-accent/10" : "border-line hover:border-line2"
              }`}
            >
              <input
                type="radio"
                name="durasi_mode"
                checked={mode === String(p.id)}
                onChange={() => setMode(String(p.id))}
                className="w-4 h-4 accent-[#9146FF]"
              />
              <span className="font-semibold flex-1">
                {fill(t.package, { label: p.label })}
                <span className="block text-xs font-medium text-soft">{durasiText(p.duration_hours)}</span>
              </span>
              <span className="text-right">
                <span className="font-bold block">{rp(p.price)}</span>
                {hemat > 0 && (
                  <span className="text-xs font-semibold text-ok">{fill(t.save, { amount: rp(hemat) })}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4 mt-2 mb-5">
        <span className="font-semibold">{t.total}</span>
        <span className="font-display font-extrabold text-3xl text-text">{rp(total)}</span>
      </div>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
