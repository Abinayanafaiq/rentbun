import { q } from "./db";

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
