// Pengaturan utama — kontak admin di Telegram, berlaku ke seluruh situs
export const TELEGRAM_USERNAME = "rentzoccloud";
export const TELEGRAM_DISPLAY = "@" + TELEGRAM_USERNAME;

export function tgLink(text) {
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
}
