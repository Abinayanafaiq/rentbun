"use client";

import { useState } from "react";
import AccountCard from "./AccountCard";

const FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "mythic", label: "Mythic" },
  { key: "legend", label: "Legend" },
  { key: "epic", label: "Epic" },
];

export default function CatalogFilter({ accounts }) {
  const [filter, setFilter] = useState("semua");

  const shown = accounts.filter((a) => {
    if (filter === "semua") return true;
    return (a.rank || "").toLowerCase().includes(filter);
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2.5 mb-8" role="group" aria-label="Filter rank">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-semibold text-sm px-4 py-2 rounded-full border-2 border-ink transition-all hover:-translate-y-0.5 ${
              filter === f.key ? "bg-ink text-paper" : "bg-paper2"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-ink/70">Belum ada akun di kategori ini. Coba kategori lain atau chat admin.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((a) => (
            <AccountCard key={a.id} account={a} />
          ))}
        </div>
      )}
    </div>
  );
}
