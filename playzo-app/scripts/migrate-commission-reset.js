// Tambah fitur reset komisi marketer oleh admin (sekali jalan, aman diulang):
// marketers.commission_reset_at — penanda waktu reset; komisi (Rp & USD)
// hanya dihitung dari order yang dibuat setelah waktu ini.
// Jalankan: node scripts/migrate-commission-reset.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();

  await c.query("ALTER TABLE marketers ADD COLUMN IF NOT EXISTS commission_reset_at TIMESTAMPTZ");
  console.log("Kolom commission_reset_at di marketers siap.");

  await c.end();
  console.log("Migrasi selesai.");
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
