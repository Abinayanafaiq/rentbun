// Tambah kolom photos (JSONB array URL) ke tabel accounts (sekali jalan)
// Jalankan: node scripts/migrate-photos.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();
  await c.query("ALTER TABLE accounts ADD COLUMN IF NOT EXISTS photos JSONB NOT NULL DEFAULT '[]'");
  console.log("Kolom photos siap.");
  await c.end();
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
