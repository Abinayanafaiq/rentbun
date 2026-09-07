// Upgrade fitur marketer (sekali jalan, aman diulang):
// 1. Kolom email & password_hash di marketers — supaya marketer bisa login
// 2. Tabel coupons — satu marketer bisa punya banyak kode kupon
// 3. Pindahkan kupon lama (kolom marketers.coupon_code) ke tabel coupons
// Jalankan: node scripts/migrate-marketer-auth.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();

  await c.query("ALTER TABLE marketers ADD COLUMN IF NOT EXISTS email TEXT");
  await c.query("ALTER TABLE marketers ADD COLUMN IF NOT EXISTS password_hash TEXT");
  console.log("Kolom email & password_hash di marketers siap.");

  await c.query(`
    CREATE TABLE IF NOT EXISTS coupons (
      id SERIAL PRIMARY KEY,
      marketer_id INT NOT NULL REFERENCES marketers(id) ON DELETE CASCADE,
      code TEXT UNIQUE NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  console.log("Tabel coupons siap.");

  // Migrasi kupon lama ke tabel coupons (kalau kolomnya masih ada)
  const { rows: col } = await c.query(
    "SELECT 1 FROM information_schema.columns WHERE table_name = 'marketers' AND column_name = 'coupon_code'"
  );
  if (col[0]) {
    const { rowCount } = await c.query(`
      INSERT INTO coupons (marketer_id, code, active)
      SELECT id, coupon_code, active FROM marketers
      WHERE coupon_code IS NOT NULL AND coupon_code <> ''
      ON CONFLICT (code) DO NOTHING
    `);
    await c.query("ALTER TABLE marketers DROP COLUMN coupon_code");
    console.log(`${rowCount} kupon lama dipindahkan ke tabel coupons, kolom lama dihapus.`);
  }

  // Email login unik (case-insensitive), boleh NULL untuk data lama
  await c.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS marketers_email_key
    ON marketers (lower(email)) WHERE email IS NOT NULL
  `);
  console.log("Index unik email marketer siap.");

  await c.end();
  console.log("Migrasi selesai.");
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
