// Buat tabel account_reports untuk fitur laporan akun bermasalah / hackback (sekali jalan, aman diulang)
// Jalankan: node scripts/migrate-reports.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();
  await c.query(`
    CREATE TABLE IF NOT EXISTS account_reports (
      id SERIAL PRIMARY KEY,
      game TEXT NOT NULL DEFAULT 'Mobile Legends',
      user_id_ingame TEXT NOT NULL,
      zone_server TEXT NOT NULL DEFAULT '',
      nickname TEXT NOT NULL DEFAULT '',
      seller TEXT NOT NULL DEFAULT '',
      seller_contact TEXT NOT NULL DEFAULT '',
      problem_type TEXT NOT NULL DEFAULT 'hackback',
      description TEXT NOT NULL,
      evidence_url TEXT NOT NULL DEFAULT '',
      reporter_name TEXT NOT NULL,
      reporter_contact TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await c.query(`
    CREATE INDEX IF NOT EXISTS account_reports_status_idx ON account_reports (status)
  `);
  console.log("Tabel account_reports siap.");
  await c.end();
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
