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
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${icon}`} aria-hidden="true" />
        <h3 className="font-display font-extrabold text-xl text-text">{title}</h3>
        <span className="grid place-items-center min-w-7 h-7 px-2 rounded-full bg-surface2 border border-line text-xs font-bold text-soft">{accounts.length}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
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
      <div className="catalog-toolbar flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 p-3 sm:p-4 bg-surface border border-line rounded-sm">
        <p className="shrink-0 px-1 font-display font-bold text-sm text-text">Filter rank</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1" role="group" aria-label="Filter rank">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`inline-flex shrink-0 items-center gap-2 font-bold text-sm px-4 py-2.5 rounded-sm border transition-colors ${
              filter === f.key
                ? "border-accent bg-accent text-onaccent"
                : "border-line bg-bg/40 text-soft hover:border-line2 hover:text-text"
            }`}
          >
            {f.label}
            <span
              className={`grid place-items-center min-w-5 h-5 px-1 rounded-sm text-[10px] ${filter === f.key ? "bg-onaccent/15 text-onaccent" : "bg-surface2 text-faint"}`}
            >
              {countFor(f.key)}
            </span>
          </button>
        ))}
        </div>
        <p className="sm:ml-auto px-1 text-xs text-faint">{shown.length} akun ditemukan</p>
      </div>

      {shown.length === 0 ? (
        <p className="text-soft">Belum ada akun di kategori ini. Coba kategori lain atau chat admin.</p>
      ) : filter !== "semua" ? (
        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
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
