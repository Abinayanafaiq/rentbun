// Tambah harga luar negeri (USD) untuk paket + komisi marketer terpisah (sekali jalan):
// 1. packages.price_usd & commission_rate_usd — harga & komisi untuk pembeli luar negeri
// 2. orders.currency — mata uang order ('IDR' / 'USD')
// 3. settings usd_rate — kurs tetap untuk konversi & penampilan (default 15000)
// Jalankan: node scripts/migrate-foreign.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();

  await c.query("ALTER TABLE packages ADD COLUMN IF NOT EXISTS price_usd INT NOT NULL DEFAULT 0");
  await c.query("ALTER TABLE packages ADD COLUMN IF NOT EXISTS commission_rate_usd INT NOT NULL DEFAULT 0");
  console.log("Kolom price_usd & commission_rate_usd di packages siap.");

  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'IDR'");
  console.log("Kolom currency di orders siap.");

  await c.query(
    "INSERT INTO settings (key, value) VALUES ('usd_rate', '15000') ON CONFLICT (key) DO NOTHING"
  );
  await c.query(
    "INSERT INTO settings (key, value) VALUES ('coupon_commission_rate_usd', '5') ON CONFLICT (key) DO NOTHING"
  );
  console.log("Setting usd_rate = 15000 & coupon_commission_rate_usd = 5 (default) siap.");

  await c.end();
  console.log("Migrasi selesai.");
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
