import { tierOf } from "@/lib/format";

const TIERS = {
  immortal: { label: "Immortal", short: "IM", className: "rank-immortal" },
  glory: { label: "Mythical Glory", short: "MG", className: "rank-glory" },
  honor: { label: "Mythical Honor", short: "MH", className: "rank-honor" },
  mythic: { label: "Mythic", short: "MY", className: "rank-mythic" },
  legend: { label: "Legend", short: "LE", className: "rank-legend" },
  epic: { label: "Epic", short: "EP", className: "rank-epic" },
};

export default function RankMark({ rank, compact = false }) {
  const tier = TIERS[tierOf(rank)] || TIERS.epic;

  return (
    <span className={`rank-mark ${tier.className} ${compact ? "rank-mark-compact" : ""}`} title={tier.label}>
      <span className="rank-mark-gem" aria-hidden="true"><span>{tier.short}</span></span>
      {!compact && <span className="rank-mark-copy"><strong>{tier.label}</strong><small>Tier akun</small></span>}
    </span>
  );
}
