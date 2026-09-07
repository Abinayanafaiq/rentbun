import { q } from "./db";

// Bonus masa aktif (hari) yang didapat pembeli saat pakai kupon marketer.
// Admin bisa ubah bebas lewat /admin/marketer. Default 3 hari.
export async function getVoucherBonusDays() {
  const { rows } = await q("SELECT value FROM settings WHERE key = 'voucher_bonus_days'");
  const n = Number(rows[0]?.value);
  if (!Number.isFinite(n) || n < 1) return 3;
  return Math.min(Math.floor(n), 365);
}
