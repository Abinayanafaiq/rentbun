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
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter rank">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-semibold text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === f.key
                ? "border-accent bg-accent/15 text-accent"
                : "border-line text-soft hover:border-line2 hover:text-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-soft">Belum ada akun di kategori ini. Coba kategori lain atau chat admin.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((a) => (
            <AccountCard key={a.id} account={a} />
          ))}
        </div>
      )}
    </div>
  );
}
