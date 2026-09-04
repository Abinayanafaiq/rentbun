"use client";

import { useState } from "react";
import AccountCard from "./AccountCard";

const FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "mythic", label: "Mythic" },
  { key: "legend", label: "Legend" },
  { key: "epic", label: "Epic" },
];

function Section({ title, icon, accounts }) {
  if (accounts.length === 0) return null;
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-block w-2 h-2 rounded-full ${icon}`} aria-hidden="true" />
        <h3 className="font-display font-bold text-lg text-text">{title}</h3>
        <span className="text-sm text-faint">{accounts.length}</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((a) => (
          <AccountCard key={a.id} account={a} />
        ))}
      </div>
    </section>
  );
}

export default function CatalogFilter({ accounts }) {
  const [filter, setFilter] = useState("semua");

  const shown = accounts.filter((a) => {
    if (filter === "semua") return true;
    return (a.rank || "").toLowerCase().includes(filter);
  });

  const live = shown.filter((a) => a.status === "ready");
  const offline = shown.filter((a) => a.status !== "ready");

  const countFor = (key) =>
    key === "semua"
      ? accounts.length
      : accounts.filter((a) => (a.rank || "").toLowerCase().includes(key)).length;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter rank">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`inline-flex items-center gap-1.5 font-semibold text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === f.key
                ? "border-accent bg-accent/15 text-accent"
                : "border-line text-soft hover:border-line2 hover:text-text"
            }`}
          >
            {f.label}
            <span
              className={`text-xs ${filter === f.key ? "text-accent/70" : "text-faint"}`}
            >
              {countFor(f.key)}
            </span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-soft">Belum ada akun di kategori ini. Coba kategori lain atau chat admin.</p>
      ) : filter !== "semua" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((a) => (
            <AccountCard key={a.id} account={a} />
          ))}
        </div>
      ) : (
        <>
          <Section title="Sedang LIVE" icon="bg-live" accounts={live} />
          <Section title="Offline" icon="bg-faint" accounts={offline} />
        </>
      )}
    </div>
  );
}
