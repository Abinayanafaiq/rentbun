"use client";

import { useState } from "react";

export default function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard tidak tersedia, biarkan user seleksi manual
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-bg border border-line rounded-md px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-soft">{label}</p>
        <p className="font-bold text-text truncate">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 text-sm font-bold px-3.5 py-1.5 rounded-md border border-line text-text hover:bg-surface2 transition-colors"
      >
        {copied ? "Tersalin" : "Salin"}
      </button>
    </div>
  );
}
