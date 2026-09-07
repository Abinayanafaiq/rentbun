import crypto from "crypto";
import { q } from "./db";

// Bonus masa aktif (hari) yang didapat pembeli saat pakai kupon marketer.
// Admin bisa ubah bebas lewat /admin/marketer. Default 3 hari.
export async function getVoucherBonusDays() {
  const { rows } = await q("SELECT value FROM settings WHERE key = 'voucher_bonus_days'");
  const n = Number(rows[0]?.value);
  if (!Number.isFinite(n) || n < 1) return 3;
  return Math.min(Math.floor(n), 365);
}

// Normalisasi kode kupon: kapital, hanya huruf/angka/strip, maks 24 karakter
export function cleanCoupon(raw) {
  return String(raw || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24);
}

export async function couponExists(code) {
  const { rows } = await q("SELECT id FROM coupons WHERE upper(code) = $1", [code]);
  return !!rows[0];
}

// Kode acak unik, mis. MK7F3A9C
export async function generateCoupon() {
  for (let i = 0; i < 10; i++) {
    const code = "MK" + crypto.randomBytes(3).toString("hex").toUpperCase();
    if (!(await couponExists(code))) return code;
  }
  return "MK" + crypto.randomBytes(6).toString("hex").toUpperCase();
}
