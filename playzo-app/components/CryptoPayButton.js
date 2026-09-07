"use client";

import { useActionState, useEffect } from "react";
import { bayarCrypto } from "@/app/actions";

export default function CryptoPayButton({ code, label = "Bayar dengan Crypto (BTC, USDT, dll)", loadingLabel = "Menyiapkan invoice crypto..." }) {
  const [state, formAction, pending] = useActionState(bayarCrypto, null);

  // Invoice siap → lempar pembeli ke halaman pembayaran OxaPay
  useEffect(() => {
    if (state?.payUrl) window.location.assign(state.payUrl);
  }, [state]);

  return (
    <form action={formAction} className="mt-3">
      <input type="hidden" name="code" value={code} />
      {state?.error && (
        <p className="mb-3 text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full font-bold px-6 py-4 rounded-md border border-line text-text hover:bg-surface2 transition-colors disabled:opacity-50"
      >
        {pending ? loadingLabel : label}
      </button>
    </form>
  );
}
