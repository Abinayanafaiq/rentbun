"use client";

import { useState } from "react";
import { dict, fill } from "@/lib/dict";

const TYPE_BADGE = {
  hackback: "bg-livebg text-live border-live/60",
  password: "bg-surface2 text-warn border-warn/50",
  scam: "bg-surface2 text-warn border-warn/50",
  other: "bg-surface2 text-soft border-line2",
};

const TYPE_LABEL = {
  hackback: "typeHackback",
  password: "typePassword",
  scam: "typeScam",
  other: "typeOther",
};

function Field({ label, value, mono = false }) {
  return (
    <div className="bg-bg border border-line rounded-md px-4 py-3 min-w-0">
      <p className="text-xs font-semibold text-soft">{label}</p>
      <p className={`font-bold text-text truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function ReportFilter({ reports, t = dict.id.reports }) {
  const [type, setType] = useState("semua");
  const [search, setSearch] = useState("");

  const needle = search.trim().toLowerCase();
  const shown = reports.filter((r) => {
    if (type !== "semua" && r.problem_type !== type) return false;
    if (!needle) return true;
    return [r.user_id_ingame, r.zone_server, r.nickname, r.seller, r.seller_contact, r.game]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  const CHIPS = [
    { key: "semua", label: t.filterAll },
    { key: "hackback", label: t.typeHackback },
    { key: "password", label: t.typePassword },
    { key: "scam", label: t.typeScam },
    { key: "other", label: t.typeOther },
  ];

  const countFor = (key) =>
    key === "semua" ? reports.length : reports.filter((r) => r.problem_type === key).length;

  return (
    <div>
      <div className="catalog-toolbar flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 p-3 sm:p-4 bg-surface border border-line rounded-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPh}
          aria-label={t.searchLabel}
          className="sm:w-64 font-semibold text-sm px-4 py-2.5 rounded-sm border border-line bg-bg/40 text-text placeholder:text-faint focus:outline-none focus:border-accent"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1" role="group" aria-label={t.typeLabel}>
          {CHIPS.map((c) => (
            <button
              key={c.key}
              onClick={() => setType(c.key)}
              className={`inline-flex shrink-0 items-center gap-2 font-bold text-sm px-4 py-2.5 rounded-sm border transition-colors ${
                type === c.key
                  ? "border-accent bg-accent text-onaccent"
                  : "border-line bg-bg/40 text-soft hover:border-line2 hover:text-text"
              }`}
            >
              {c.label}
              <span
                className={`grid place-items-center min-w-5 h-5 px-1 rounded-sm text-[10px] ${type === c.key ? "bg-onaccent/15 text-onaccent" : "bg-surface2 text-faint"}`}
              >
                {countFor(c.key)}
              </span>
            </button>
          ))}
        </div>
        <p className="sm:ml-auto px-1 text-xs text-faint">{fill(t.found, { n: shown.length })}</p>
      </div>

      {shown.length === 0 ? (
        <p className="text-soft">{reports.length === 0 ? t.emptyAll : t.empty}</p>
      ) : (
        <div className="grid gap-5">
          {shown.map((r) => (
            <article key={r.id} className="bg-surface border border-line rounded-lg p-5">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded border whitespace-nowrap ${TYPE_BADGE[r.problem_type] || TYPE_BADGE.other}`}
                >
                  {t[TYPE_LABEL[r.problem_type]] || t.typeOther}
                </span>
                <span className="text-xs text-faint">{fill(t.reportedAt, { date: r.dateLabel })}</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <Field label={t.accountId} value={r.zone_server ? `${r.user_id_ingame} (${r.zone_server})` : r.user_id_ingame} mono />
                <Field label={t.game} value={r.game} />
                {r.nickname ? <Field label={t.nickname} value={r.nickname} /> : null}
                {r.seller ? <Field label={t.seller} value={r.seller} /> : null}
                {r.seller_contact ? <Field label={t.sellerContact} value={r.seller_contact} /> : null}
              </div>

              <p className="text-sm text-soft leading-relaxed whitespace-pre-line">{r.description}</p>

              {r.evidence_url ? (
                <a
                  href={r.evidence_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex mt-4 text-sm font-bold text-accent underline underline-offset-2 hover:text-accent2"
                >
                  {t.evidence} ↗
                </a>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
