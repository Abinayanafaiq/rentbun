import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { getTransactionDetail } from "@/lib/pakasir";
import { markOrderPaid } from "@/lib/orders";

// Webhook Pakasir (docs bagian D) — dipanggil Pakasir saat pembayaran berhasil
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body bukan JSON" }, { status: 400 });
  }

  // Pastikan webhook memang untuk proyek kita
  if (body.project !== process.env.PAKASIR_SLUG) {
    return NextResponse.json({ error: "Project tidak dikenal" }, { status: 400 });
  }

  const { rows } = await q("SELECT * FROM orders WHERE code = $1", [body.order_id]);
  const order = rows[0];
  if (!order) {
    return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  // Nominal di webhook harus sama dengan nominal order
  if (Number(body.amount) !== order.total) {
    return NextResponse.json({ error: "Nominal tidak cocok" }, { status: 400 });
  }

  // Sudah diproses sebelumnya — anggap sukses (idempotent)
  if (order.status !== "pending") {
    return NextResponse.json({ ok: true, note: "Sudah diproses" });
  }

  // Verifikasi ulang via API sesuai rekomendasi docs
  const trx = await getTransactionDetail(order);
  if (trx && trx.status === "completed" && Number(trx.amount) === order.total) {
    await markOrderPaid(order.code, trx.payment_method || body.payment_method);
    return NextResponse.json({ ok: true, status: "paid" });
  }

  return NextResponse.json({ ok: false, note: "Transaksi belum completed" }, { status: 202 });
}
