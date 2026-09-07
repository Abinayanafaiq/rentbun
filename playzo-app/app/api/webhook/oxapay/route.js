import { q } from "@/lib/db";
import { getPaymentInfo, isPaid, paymentLabel, validCallback } from "@/lib/oxapay";
import { markOrderPaid } from "@/lib/orders";

// Webhook OxaPay — dipanggil OxaPay saat status pembayaran berubah (paying → paid).
// Dua lapis anti-bypass: signature HMAC + verifikasi ulang ke API Payment Information.
export async function POST(request) {
  const raw = await request.text();

  // Lapis 1: validasi signature HMAC-SHA512 (header "hmac")
  if (!validCallback(raw, request.headers.get("hmac"))) {
    return new Response("invalid signature", { status: 400 });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  // Endpoint ini hanya menangani pembayaran invoice
  if (body.type !== "invoice") {
    return new Response("ok", { status: 200 });
  }

  const { rows } = await q("SELECT * FROM orders WHERE code = $1", [body.order_id]);
  const order = rows[0];
  // track_id di callback harus cocok dengan invoice yang kita buat untuk order ini
  if (!order || !order.oxapay_track_id || order.oxapay_track_id !== String(body.track_id)) {
    return new Response("order not found", { status: 404 });
  }

  // Sudah diproses sebelumnya — idempotent
  if (order.status !== "pending") {
    return new Response("ok", { status: 200 });
  }

  // Lapis 2: verifikasi ulang ke API — status "Paid" di payload tidak dipercaya
  const info = await getPaymentInfo(body.track_id);
  if (info && isPaid(info) && Number(info.amount) === order.total) {
    await markOrderPaid(order.code, paymentLabel(info));
  }

  // Selalu jawab 200 "ok": kalau belum paid (status "paying"), OxaPay akan kirim
  // callback lagi saat lunas. Non-200 hanya memicu retry yang sama.
  return new Response("ok", { status: 200 });
}
