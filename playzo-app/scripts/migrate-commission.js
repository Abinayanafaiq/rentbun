// Tambah fitur komisi marketer dari kupon (sekali jalan, aman diulang):
// 1. packages.commission_rate — persen komisi per paket (diatur admin per paket)
// 2. settings coupon_commission_rate — rate global untuk sewa per jam / fallback
// 3. orders.commission — snapshot komisi rupiah yang dihitung saat order dibuat
// Jalankan: node scripts/migrate-commission.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();

  await c.query("ALTER TABLE packages ADD COLUMN IF NOT EXISTS commission_rate INT NOT NULL DEFAULT 0");
  console.log("Kolom commission_rate di packages siap.");

  await c.query(
    "INSERT INTO settings (key, value) VALUES ('coupon_commission_rate', '5') ON CONFLICT (key) DO NOTHING"
  );
  console.log("Setting coupon_commission_rate = 5 (default) siap.");

  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission INT NOT NULL DEFAULT 0");
  console.log("Kolom commission di orders siap.");

  await c.end();
  console.log("Migrasi selesai.");
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
