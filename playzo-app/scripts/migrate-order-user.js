// Hubungkan order ke akun user: tambah kolom user_id di tabel orders (sekali jalan, aman diulang)
// Jalankan: node scripts/migrate-order-user.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();
  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL");
  console.log("Kolom user_id pada orders siap.");
  await c.end();
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
