// Tambah kolom jejak invoice OxaPay di orders (sekali jalan, aman diulang)
// Jalankan: node scripts/migrate-oxapay.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();

  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS oxapay_track_id TEXT");
  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS oxapay_pay_url TEXT");
  console.log("Kolom oxapay_track_id & oxapay_pay_url di orders siap.");

  await c.end();
  console.log("Migrasi selesai.");
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
