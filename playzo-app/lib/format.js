export function rp(n) {
  return "Rp" + Number(n || 0).toLocaleString("id-ID");
}

export function tanggal(d) {
  return new Date(d).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Tier rank ML → warna cover kartu
export function tierOf(rank) {
  const r = (rank || "").toLowerCase();
  if (r.includes("immortal")) return "immortal";
  if (r.includes("glory")) return "glory";
  if (r.includes("honor")) return "honor";
  if (r.includes("mythic")) return "mythic";
  if (r.includes("legend")) return "legend";
  return "epic";
}

export const TIER_COVER = {
  immortal: "bg-[repeating-linear-gradient(-45deg,#241C3A_0_18px,#1B1430_18px_36px)] text-yellow",
  glory: "bg-[repeating-linear-gradient(-45deg,#E8442E_0_18px,#CF3520_18px_36px)] text-paper2",
  honor: "bg-[repeating-linear-gradient(-45deg,#12A48E_0_18px,#0B7A6A_18px_36px)] text-paper2",
  mythic: "bg-[repeating-linear-gradient(-45deg,#FFC531_0_18px,#F0B41E_18px_36px)] text-reddeep",
  legend: "bg-[repeating-linear-gradient(-45deg,#2E9E56_0_18px,#1F7A42_18px_36px)] text-paper2",
  epic: "bg-[repeating-linear-gradient(-45deg,#6C5CE7_0_18px,#5747C9_18px_36px)] text-paper2",
};
