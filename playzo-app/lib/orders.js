import { q } from "./db";
import { getTransactionDetail } from "./pakasir";
import { getPaymentInfo, isPaid, paymentLabel } from "./oxapay";

// Tandai order lunas + kunci stok akun. Idempotent: aman dipanggil berulang.
export async function markOrderPaid(code, paymentMethod = null) {
  const { rows } = await q(
    `UPDATE orders
     SET status = 'paid', paid_at = now(), payment_method = coalesce($2, payment_method)
     WHERE code = $1 AND status = 'pending'
     RETURNING account_id`,
    [code, paymentMethod]
  );
  if (rows[0]) {
    await q("UPDATE accounts SET status = 'rented' WHERE id = $1", [rows[0].account_id]);
    return true;
  }
  return false;
}

// Cek status pembayaran langsung ke gateway (Pakasir / OxaPay) lalu tandai lunas
// kalau memang sudah terbayar. Dipakai polling, webhook fallback, dan aksi manual.
export async function refreshPaymentStatus(order) {
  if (!order || order.status !== "pending") return order?.status || null;

  // Pakasir (QRIS / VA)
  const trx = await getTransactionDetail(order);
  if (trx && trx.status === "completed" && Number(trx.amount) === order.total) {
    await markOrderPaid(order.code, trx.payment_method);
    return "paid";
  }

  // OxaPay (crypto) — hanya kalau order ini pernah dibuatkan invoice
  if (order.oxapay_track_id) {
    const info = await getPaymentInfo(order.oxapay_track_id);
    if (info && isPaid(info) && Number(info.amount) === order.total) {
      await markOrderPaid(order.code, paymentLabel(info));
      return "paid";
    }
  }

  return "pending";
}
