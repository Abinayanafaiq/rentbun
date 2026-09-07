"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { rp } from "@/lib/format";
import { dict, fill } from "@/lib/dict";

export default function RentalShowcase({ accounts, t = dict.id.showcase }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (accounts.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % accounts.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [accounts.length]);

  if (accounts.length === 0) return null;

  const active = accounts[activeIndex];
  const ready = active.status === "ready";

  return (
    <section className="rental-showcase" aria-label={t.aria}>
      <div className="showcase-feature">
        {active.coverUrl ? (
          <img className="showcase-image" src={active.coverUrl} alt="" />
        ) : (
          <div className="showcase-fallback">ML</div>
        )}
        <span className="showcase-shade" aria-hidden="true" />
        <div className="showcase-content">
          <p className="showcase-kicker"><span /> {ready ? t.kickerReady : t.kickerRented}</p>
          <h2>{active.title}</h2>
          <p className="showcase-description">
            {fill(t.desc, { rank: active.rank || t.rankFallback, heroes: active.heroes, skins: active.skins })}
          </p>
          <p className="showcase-price">{rp(active.price_per_hour)} <small>{t.perHour}</small></p>
          <div className="showcase-actions">
            {ready ? (
              <Link href={`/sewa/${active.id}`} className="showcase-buy">{t.rent}</Link>
            ) : (
              <Link href={`/akun/${active.id}`} className="showcase-buy">{t.detail}</Link>
            )}
            <Link href={`/akun/${active.id}`} className="showcase-icon-button" aria-label={fill(t.showAccount, { title: active.title })}>↗</Link>
          </div>
        </div>
        <div className="showcase-progress" aria-hidden="true">
          {accounts.map((account, index) => (
            <span key={account.id} className={index === activeIndex ? "is-active" : ""} />
          ))}
        </div>
      </div>

      <div className="showcase-list">
        {accounts.map((account, index) => (
          <button
            type="button"
            key={account.id}
            className={`showcase-list-item ${index === activeIndex ? "is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={fill(t.showAccount, { title: account.title })}
          >
            <span className="showcase-thumb">
              {account.coverUrl ? <img src={account.coverUrl} alt="" /> : "ML"}
            </span>
            <span className="showcase-list-copy">
              <strong>{account.title}</strong>
              <small>{account.status === "ready" ? t.available : t.rented} · {rp(account.price_per_hour)}{t.perHourShort}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
