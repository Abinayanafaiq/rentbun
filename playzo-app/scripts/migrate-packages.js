// Tambah tabel packages + kolom package_label di orders (sekali jalan)
// Jalankan: node scripts/migrate-packages.js
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();

async function main() {
  const c = new Client({ connectionString: url });
  await c.connect();

  await c.query(`
    CREATE TABLE IF NOT EXISTS packages (
      id SERIAL PRIMARY KEY,
      label TEXT NOT NULL,
      duration_hours INT NOT NULL,
      price INT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  console.log("Tabel packages siap.");

  await c.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS package_label TEXT");
  console.log("Kolom package_label siap.");

  // Seed paket default kalau tabel masih kosong
  const { rows } = await c.query("SELECT count(*) AS n FROM packages");
  if (Number(rows[0].n) === 0) {
    await c.query(`
      INSERT INTO packages (label, duration_hours, price) VALUES
      ('1 Hari', 24, 100000),
      ('3 Hari', 72, 150000),
      ('1 Minggu', 168, 330000)
    `);
    console.log("3 paket default ditambahkan (1 Hari 100k, 3 Hari 150k, 1 Minggu 330k).");
  }

  await c.end();
  console.log("Migrasi selesai.");
}

main().catch((e) => {
  console.error("Gagal:", e.message);
  process.exit(1);
});
