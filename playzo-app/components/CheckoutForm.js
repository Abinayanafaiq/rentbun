"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createOrder } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";

const rp = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

function durasiText(hours) {
  if (hours % 24 === 0) {
    const days = hours / 24;
    if (days % 7 === 0) return `${days / 7} minggu`;
    return `${days} hari`;
  }
  return `${hours} jam`;
}

export default function CheckoutForm({ account, packages = [], defaultName = "", defaultWa = "" }) {
  const [hours, setHours] = useState(3);
  const [mode, setMode] = useState("custom"); // "custom" atau string id paket
  const [state, formAction, pending] = useActionState(createOrder, null);

  const selectedPkg = packages.find((p) => String(p.id) === mode);
  const total = selectedPkg ? selectedPkg.price : account.price_per_hour * hours;

  return (
    <form action={formAction} className={`${card} p-6`}>
      <input type="hidden" name="account_id" value={account.id} />
      <input type="hidden" name="package_id" value={selectedPkg ? selectedPkg.id : 0} />

      <label className={`${label} mb-4`}>
        <span className={span}>Nama kamu</span>
        <input name="name" required defaultValue={defaultName} placeholder="contoh: Raka" className={input} />
      </label>

      <label className={`${label} mb-5`}>
        <span className={span}>Nomor WhatsApp aktif</span>
        <input name="wa" required type="tel" defaultValue={defaultWa} placeholder="contoh: 081234567890" className={input} />
      </label>

      {!defaultName && (
        <p className="text-xs text-soft mb-5">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-bold text-accent hover:text-accent2 underline underline-offset-2">
            Daftar
          </Link>{" "}
          agar order tersimpan di profilmu.
        </p>
      )}

      <p className="font-semibold text-sm mb-2">Pilih durasi sewa</p>
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
          <span className="font-semibold flex-1">Per jam</span>
          <span className="text-sm text-soft">{rp(account.price_per_hour)}/jam</span>
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
              aria-label="Durasi sewa dalam jam"
            />
            <p className="text-xs text-soft mt-1.5">Minimal 1 jam, maksimal 72 jam.</p>
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
                Paket {p.label}
                <span className="block text-xs font-medium text-soft">{durasiText(p.duration_hours)}</span>
              </span>
              <span className="text-right">
                <span className="font-bold block">{rp(p.price)}</span>
                {hemat > 0 && (
                  <span className="text-xs font-semibold text-ok">hemat {rp(hemat)}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4 mt-2 mb-5">
        <span className="font-semibold">Total bayar</span>
        <span className="font-display font-extrabold text-3xl text-text">{rp(total)}</span>
      </div>

      {state?.error && (
        <p className="mb-4 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Membuat order..." : "Buat order"}
      </button>
    </form>
  );
}
