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

// Rate komisi global (%) untuk sewa per jam (paket punya rate sendiri).
// Admin ubah lewat /admin/marketer. Default 5%.
export async function getCommissionRate() {
  const { rows } = await q("SELECT value FROM settings WHERE key = 'coupon_commission_rate'");
  const n = Number(rows[0]?.value);
  if (!Number.isFinite(n) || n < 0) return 5;
  return Math.min(Math.floor(n), 100);
}

// Komisi rupiah dari total order: paket pakai rate paket, per jam pakai rate global.
export async function commissionForOrder(order, packageCommissionRate = null) {
  const rate = packageCommissionRate ?? (await getCommissionRate());
  return Math.round((order.total * rate) / 100);
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
