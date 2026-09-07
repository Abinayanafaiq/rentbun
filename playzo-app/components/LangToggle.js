"use client";

import { useTransition } from "react";
import { setLang } from "@/app/actions";

export default function LangToggle({ lang }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className="flex items-center rounded-full border border-line overflow-hidden text-xs font-extrabold"
      role="group"
      aria-label="Language / Bahasa"
    >
      {["id", "en"].map((l) => (
        <button
          key={l}
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => setLang(l))}
          className={`px-2.5 py-1.5 uppercase tracking-wide transition-colors ${
            lang === l ? "bg-accent text-onaccent" : "text-soft hover:text-text"
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
