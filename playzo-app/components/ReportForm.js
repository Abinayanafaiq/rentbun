"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitReport } from "@/app/actions";
import { dict } from "@/lib/dict";
import { card, input, span, label, btnPrimary } from "@/components/ui";

const GAMES = ["Mobile Legends", "Free Fire", "PUBG Mobile", "Genshin Impact"];

export default function ReportForm({ t = dict.id.reports }) {
  const [state, formAction, pending] = useActionState(submitReport, null);

  if (state?.ok) {
    return (
      <div className={`${card} p-6 sm:p-8 text-center`}>
        <h2 className="font-display font-extrabold text-2xl text-text mb-2">{t.successTitle}</h2>
        <p className="text-soft mb-6 leading-relaxed">{t.successDesc}</p>
        <Link href="/laporan" className={`${btnPrimary} inline-flex`}>{t.successBack}</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className={`${card} p-6 sm:p-8 space-y-4`}>
      {/* Honeypot anti-bot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <label className={label}>
        <span className={span}>{t.gameLabel}</span>
        <select name="game" defaultValue="Mobile Legends" className={input}>
          {GAMES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </label>

      <div className="grid sm:grid-cols-[1.4fr_1fr] gap-4">
        <label className={label}>
          <span className={span}>{t.idLabel} *</span>
          <input name="user_id_ingame" type="text" required placeholder={t.idPh} className={input} />
        </label>
        <label className={label}>
          <span className={span}>{t.zoneLabel}</span>
          <input name="zone_server" type="text" placeholder={t.zonePh} className={input} />
        </label>
      </div>

      <label className={label}>
        <span className={span}>{t.nickLabel}</span>
        <input name="nickname" type="text" placeholder={t.nickPh} className={input} />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className={label}>
          <span className={span}>{t.sellerLabel}</span>
          <input name="seller" type="text" placeholder={t.sellerPh} className={input} />
        </label>
        <label className={label}>
          <span className={span}>{t.sellerContactLabel}</span>
          <input name="seller_contact" type="text" placeholder={t.sellerContactPh} className={input} />
        </label>
      </div>

      <label className={label}>
        <span className={span}>{t.typeLabel} *</span>
        <select name="problem_type" defaultValue="hackback" className={input}>
          <option value="hackback">{t.typeHackback}</option>
          <option value="password">{t.typePassword}</option>
          <option value="scam">{t.typeScam}</option>
          <option value="other">{t.typeOther}</option>
        </select>
      </label>

      <label className={label}>
        <span className={span}>{t.descLabel} *</span>
        <textarea name="description" rows={5} required minLength={20} placeholder={t.descPh} className={input} />
      </label>

      <label className={label}>
        <span className={span}>{t.evidenceLabel}</span>
        <input name="evidence_url" type="url" placeholder={t.evidencePh} className={input} />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className={label}>
          <span className={span}>{t.reporterLabel} *</span>
          <input name="reporter_name" type="text" required placeholder={t.reporterPh} className={input} />
        </label>
        <label className={label}>
          <span className={span}>{t.reporterContactLabel}</span>
          <input name="reporter_contact" type="text" placeholder={t.reporterContactPh} className={input} />
        </label>
      </div>

      {state?.error && (
        <p className="text-sm font-semibold text-live bg-livebg border border-live/50 rounded-md px-4 py-2.5">
          {state.error}
        </p>
      )}

      <p className="text-xs text-faint leading-relaxed">{t.privacy}</p>

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
