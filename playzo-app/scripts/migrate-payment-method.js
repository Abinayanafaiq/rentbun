// Tambah kolom payment_method ke tabel orders (sekali jalan)
// Jalankan: node scripts/migrate-payment-method.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();
  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT");
  console.log("Kolom payment_method siap.");
  await c.end();
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
