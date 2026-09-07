// Tambah fitur marketer & kupon voucher (sekali jalan, aman diulang):
// 1. Tabel marketers — admin bisa rekrut marketer, tiap marketer punya kode kupon
// 2. Tabel settings — pengaturan bebas admin (bonus masa aktif kupon, default 3 hari)
// 3. Kolom orders — jejak kupon yang dipakai pembeli
// Jalankan: node scripts/migrate-marketers.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();

  await c.query(`
    CREATE TABLE IF NOT EXISTS marketers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      wa TEXT NOT NULL DEFAULT '',
      coupon_code TEXT UNIQUE NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  console.log("Tabel marketers siap.");

  await c.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
  console.log("Tabel settings siap.");

  // Bonus default 3 hari kalau admin belum pernah atur
  await c.query(
    "INSERT INTO settings (key, value) VALUES ('voucher_bonus_days', '3') ON CONFLICT (key) DO NOTHING"
  );
  console.log("Setting voucher_bonus_days = 3 (default) siap.");

  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS marketer_id INT REFERENCES marketers(id) ON DELETE SET NULL");
  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT");
  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS bonus_hours INT NOT NULL DEFAULT 0");
  console.log("Kolom marketer_id, coupon_code & bonus_hours di orders siap.");

  await c.end();
  console.log("Migrasi selesai.");
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
