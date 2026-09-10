export function rp(n) {
  return "Rp" + Number(n || 0).toLocaleString("id-ID");
}

export function usd(n) {
  return "$" + Number(n || 0).toLocaleString("en-US");
}

// Format sesuai mata uang order: IDR → rp, USD → usd
export function money(n, currency = "IDR") {
  return (currency || "IDR") === "USD" ? usd(n) : rp(n);
}

export function tanggal(d) {
  return new Date(d).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Sisa masa sewa order aktif (status 'paid'):
// mulai dari paid_at, lama (hours + bonus_hours) jam.
// Mengembalikan null kalau order tidak sedang berjalan.
export function sisaSewa(order, now = Date.now()) {
  if (order?.status !== "paid" || !order.paid_at) return null;
  const totalJam = Number(order.hours || 0) + Number(order.bonus_hours || 0);
  const sisa = new Date(order.paid_at).getTime() + totalJam * 3600000 - now;
  if (sisa <= 0) return { jam: 0, menit: 0, habis: true };
  const totalMenit = Math.floor(sisa / 60000);
  return { jam: Math.floor(totalMenit / 60), menit: totalMenit % 60, habis: false };
}

// Teks sisa masa sewa, mis. "23 jam 15 menit" / "23h 15m"
export function sisaSewaText(order, lang = "id", now = Date.now()) {
  const s = sisaSewa(order, now);
  if (!s) return null;
  if (s.habis) return lang === "en" ? "ended" : "habis";
  return lang === "en"
    ? s.jam > 0 ? `${s.jam}h ${s.menit}m` : `${s.menit}m`
    : s.jam > 0 ? `${s.jam} jam ${s.menit} menit` : `${s.menit} menit`;
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
