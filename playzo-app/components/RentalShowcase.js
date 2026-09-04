"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { rp } from "@/lib/format";

export default function RentalShowcase({ accounts }) {
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
    <section className="rental-showcase" aria-label="Pilihan akun rental">
      <div className="showcase-feature">
        {active.coverUrl ? (
          <img className="showcase-image" src={active.coverUrl} alt="" />
        ) : (
          <div className="showcase-fallback">ML</div>
        )}
        <span className="showcase-shade" aria-hidden="true" />
        <div className="showcase-content">
          <p className="showcase-kicker"><span /> {ready ? "AKUN TERSEDIA SEKARANG" : "AKUN SEDANG DISEWA"}</p>
          <h2>{active.title}</h2>
          <p className="showcase-description">
            Rank {active.rank || "tinggi"} dengan {active.heroes} hero dan {active.skins} skin. Siap dipakai untuk push rank dan mabar.
          </p>
          <p className="showcase-price">{rp(active.price_per_hour)} <small>/ jam</small></p>
          <div className="showcase-actions">
            {ready ? (
              <Link href={`/sewa/${active.id}`} className="showcase-buy">Sewa akun</Link>
            ) : (
              <Link href={`/akun/${active.id}`} className="showcase-buy">Lihat detail</Link>
            )}
            <Link href={`/akun/${active.id}`} className="showcase-icon-button" aria-label={`Lihat ${active.title}`}>↗</Link>
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
            aria-label={`Tampilkan ${account.title}`}
          >
            <span className="showcase-thumb">
              {account.coverUrl ? <img src={account.coverUrl} alt="" /> : "ML"}
            </span>
            <span className="showcase-list-copy">
              <strong>{account.title}</strong>
              <small>{account.status === "ready" ? "Tersedia" : "Sedang disewa"} · {rp(account.price_per_hour)}/jam</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
