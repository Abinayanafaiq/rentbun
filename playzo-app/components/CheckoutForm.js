"use client";

import { useActionState, useState } from "react";
import { createOrder } from "@/app/actions";

const rp = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

function durasiText(hours) {
  if (hours % 24 === 0) {
    const days = hours / 24;
    if (days % 7 === 0) return `${days / 7} minggu`;
    return `${days} hari`;
  }
  return `${hours} jam`;
}

export default function CheckoutForm({ account, packages = [] }) {
  const [hours, setHours] = useState(3);
  const [mode, setMode] = useState("custom"); // "custom" atau string id paket
  const [state, formAction, pending] = useActionState(createOrder, null);

  const selectedPkg = packages.find((p) => String(p.id) === mode);
  const total = selectedPkg ? selectedPkg.price : account.price_per_hour * hours;

  const inputCls =
    "mt-1.5 w-full border-[2.5px] border-ink rounded-xl px-4 py-3 bg-paper font-medium focus:outline-none focus:ring-3 focus:ring-teal/50";

  return (
    <form action={formAction} className="bg-paper2 border-[2.5px] border-ink rounded-2xl p-6 shadow-hard">
      <input type="hidden" name="account_id" value={account.id} />
      <input type="hidden" name="package_id" value={selectedPkg ? selectedPkg.id : 0} />

      <label className="block mb-4">
        <span className="font-semibold text-sm">Nama kamu</span>
        <input name="name" required placeholder="contoh: Raka" className={inputCls} />
      </label>

      <label className="block mb-5">
        <span className="font-semibold text-sm">Nomor WhatsApp aktif</span>
        <input name="wa" required type="tel" placeholder="contoh: 081234567890" className={inputCls} />
      </label>

      <p className="font-semibold text-sm mb-2">Pilih durasi sewa</p>
      <div className="space-y-2.5 mb-5">
        {/* Opsi per jam */}
        <label
          className={`flex items-center gap-3 border-[2.5px] rounded-xl px-4 py-3 cursor-pointer transition-colors ${
            mode === "custom" ? "border-ink bg-yellow/25" : "border-ink/25 hover:border-ink/60"
          }`}
        >
          <input
            type="radio"
            name="durasi_mode"
            checked={mode === "custom"}
            onChange={() => setMode("custom")}
            className="w-4 h-4 accent-[#D63A24]"
          />
          <span className="font-semibold flex-1">Per jam</span>
          <span className="text-sm text-ink/60">{rp(account.price_per_hour)}/jam</span>
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
              className={inputCls}
              aria-label="Durasi sewa dalam jam"
            />
            <p className="text-xs text-ink/60 mt-1.5">Minimal 1 jam, maksimal 72 jam.</p>
          </div>
        )}
        {mode !== "custom" && <input type="hidden" name="hours" value={selectedPkg.duration_hours} />}

        {/* Opsi paket dari admin */}
        {packages.map((p) => {
          const hemat = account.price_per_hour * p.duration_hours - p.price;
          return (
            <label
              key={p.id}
              className={`flex items-center gap-3 border-[2.5px] rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                mode === String(p.id) ? "border-ink bg-yellow/25" : "border-ink/25 hover:border-ink/60"
              }`}
            >
              <input
                type="radio"
                name="durasi_mode"
                checked={mode === String(p.id)}
                onChange={() => setMode(String(p.id))}
                className="w-4 h-4 accent-[#D63A24]"
              />
              <span className="font-semibold flex-1">
                Paket {p.label}
                <span className="block text-xs font-medium text-ink/60">{durasiText(p.duration_hours)}</span>
              </span>
              <span className="text-right">
                <span className="font-bold block">{rp(p.price)}</span>
                {hemat > 0 && (
                  <span className="text-xs font-semibold text-tealdark">hemat {rp(hemat)}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t-[2.5px] border-dashed border-ink/25 pt-4 mt-2 mb-5">
        <span className="font-semibold">Total bayar</span>
        <span className="font-display font-extrabold text-3xl">{rp(total)}</span>
      </div>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-reddeep bg-red/10 border-2 border-reddeep/40 rounded-xl px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full font-bold px-6 py-4 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-wait"
      >
        {pending ? "Membuat order..." : "Buat order"}
      </button>
    </form>
  );
}
