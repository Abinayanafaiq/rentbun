// Integrasi OxaPay — https://docs.oxapay.com
import crypto from "crypto";

const BASE = "https://api.oxapay.com/v1";

// Tombol crypto hanya tampil kalau API key sudah diisi
export function oxapayEnabled() {
  return Boolean(process.env.OXAPAY_MERCHANT_API_KEY);
}

// Buat invoice baru → { track_id, payment_url, expired_at, date }
export async function createInvoice(order) {
  try {
    const res = await fetch(`${BASE}/payment/invoice`, {
      method: "POST",
      headers: {
        merchant_api_key: process.env.OXAPAY_MERCHANT_API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        amount: order.total,
        currency: process.env.OXAPAY_CURRENCY || "IDR", // nominal invoice dalam rupiah
        lifetime: 60, // menit
        fee_paid_by_payer: 1, // fee ditanggung pembeli, nominal order tetap pas
        under_paid_coverage: 0,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/oxapay`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.code}`,
        order_id: order.code,
        description: `Sewa ${order.account_title} (${order.code})`,
        thanks_message: "Pembayaran diterima. Detail akun langsung tampil di halaman order.",
        sandbox: process.env.OXAPAY_SANDBOX === "true",
      }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.data?.track_id) return null;
    return json.data;
  } catch {
    return null;
  }
}

// Cek status pembayaran langsung ke API OxaPay (jangan percaya payload webhook)
export async function getPaymentInfo(trackId) {
  try {
    const res = await fetch(`${BASE}/payment/${trackId}`, {
      headers: { merchant_api_key: process.env.OXAPAY_MERCHANT_API_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.data || null;
  } catch {
    return null;
  }
}

// Status final yang berarti pembayaran sah (tabel status OxaPay)
export function isPaid(info) {
  const s = String(info?.status || "").toLowerCase();
  return s === "paid" || s === "manual_accept";
}

// Label metode bayar untuk disimpan di order, mis. "crypto USDT"
export function paymentLabel(info) {
  const cur = info?.txs?.[0]?.currency;
  return cur ? `crypto ${cur}` : "crypto";
}

// Validasi signature webhook: HMAC-SHA512(raw body, MERCHANT_API_KEY) === header "hmac"
export function validCallback(rawBody, hmacHeader) {
  if (!hmacHeader || !process.env.OXAPAY_MERCHANT_API_KEY) return false;
  const calc = crypto
    .createHmac("sha512", process.env.OXAPAY_MERCHANT_API_KEY)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(String(hmacHeader), "utf8");
  const b = Buffer.from(calc, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
