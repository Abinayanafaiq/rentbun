"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createOrder } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";
import { dict, fill } from "@/lib/dict";

const rp = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");
const usd = (n) => "$" + Number(n || 0).toLocaleString("en-US");

export default function CheckoutForm({ account, packages = [], defaultName = "", defaultWa = "", bonusDays = 3, usdRate = 15000, t = dict.id.checkout }) {
  const [hours, setHours] = useState(3);
  const [mode, setMode] = useState("custom"); // "custom" atau string id paket
  const [currency, setCurrency] = useState("IDR"); // "IDR" atau "USD"
  const [state, formAction, pending] = useActionState(createOrder, null);

  // Harga akun per jam dalam mata uang aktif
  const perHour = currency === "USD"
    ? Math.max(1, Math.round(account.price_per_hour / (usdRate || 15000)))
    : account.price_per_hour;

  function durasiText(h) {
    if (h % 24 === 0) {
      const days = h / 24;
      if (days % 7 === 0) return fill(t.weeks, { n: days / 7 });
      return fill(t.days, { n: days });
    }
    return fill(t.hours, { n: h });
  }

  const selectedPkg = packages.find((p) => String(p.id) === mode);
  const usdUnavailable = currency === "USD" && selectedPkg && !selectedPkg.price_usd;
  const pkgPrice = selectedPkg ? (currency === "USD" ? selectedPkg.price_usd : selectedPkg.price) : 0;
  const total = selectedPkg ? pkgPrice : perHour * hours;
  const fmt = (n) => (currency === "USD" ? usd(n) : rp(n));

  function changeCurrency(next) {
    setCurrency(next);
    if (next === "USD" && selectedPkg && !selectedPkg.price_usd) {
      setMode("custom");
    }
  }

  return (
    <form action={formAction} className={`${card} p-6`}>
      <input type="hidden" name="account_id" value={account.id} />
      <input type="hidden" name="package_id" value={selectedPkg ? selectedPkg.id : 0} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="usd_rate" value={usdRate} />

      {/* Pilih mata uang */}
      <p className="font-semibold text-sm mb-2">{t.currency}</p>
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <label
          className={`flex items-center justify-center gap-2 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
            currency === "IDR" ? "border-accent bg-accent/10" : "border-line hover:border-line2"
          }`}
        >
          <input
            type="radio"
            name="currency_mode"
            checked={currency === "IDR"}
            onChange={() => changeCurrency("IDR")}
            className="w-4 h-4 accent-[#9146FF]"
          />
          <span className="font-semibold text-sm">{t.curIdr}</span>
        </label>
        <label
          className={`flex items-center justify-center gap-2 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
            currency === "USD" ? "border-accent bg-accent/10" : "border-line hover:border-line2"
          }`}
        >
          <input
            type="radio"
            name="currency_mode"
            checked={currency === "USD"}
            onChange={() => changeCurrency("USD")}
            className="w-4 h-4 accent-[#9146FF]"
          />
          <span className="font-semibold text-sm">{t.curUsd}</span>
        </label>
      </div>
      {currency === "USD" && (
        <p className="text-xs text-soft -mt-3 mb-5">{t.curUsdHint}</p>
      )}

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
          <span className="text-sm text-soft">{fmt(perHour)}{t.perHourUnit}</span>
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
          const isUsd = currency === "USD";
          const noUsd = isUsd && !p.price_usd;
          const idrHemat = account.price_per_hour * p.duration_hours - p.price;
          const usdHemat = isUsd && p.price_usd
            ? Math.max(1, Math.round(account.price_per_hour / (usdRate || 15000))) * p.duration_hours - p.price_usd
            : 0;
          const hemat = isUsd ? usdHemat : idrHemat;
          const pkgShow = isUsd && p.price_usd ? p.price_usd : p.price;
          return (
            <label
              key={p.id}
              className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                noUsd ? "opacity-60" : mode === String(p.id) ? "border-accent bg-accent/10" : "border-line hover:border-line2"
              }`}
            >
              <input
                type="radio"
                name="durasi_mode"
                disabled={noUsd}
                checked={mode === String(p.id)}
                onChange={() => setMode(String(p.id))}
                className="w-4 h-4 accent-[#9146FF]"
              />
              <span className="font-semibold flex-1">
                {fill(t.package, { label: p.label })}
                <span className="block text-xs font-medium text-soft">{durasiText(p.duration_hours)}</span>
              </span>
              <span className="text-right">
                {noUsd ? (
                  <span className="text-xs font-semibold text-faint">{t.usdUnavailable}</span>
                ) : (
                  <>
                    <span className="font-bold block">{fmt(pkgShow)}</span>
                    {hemat > 0 && (
                      <span className="text-xs font-semibold text-ok">{fill(t.save, { amount: fmt(hemat) })}</span>
                    )}
                  </>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4 mt-2 mb-2">
        <span className="font-semibold">{t.total}</span>
        <span className="font-display font-extrabold text-3xl text-text">{fmt(total)}</span>
      </div>
      {currency === "USD" && (
        <p className="text-xs text-soft mb-5">{t.curPayNote}</p>
      )}

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
