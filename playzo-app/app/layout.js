import { Bricolage_Grotesque, Archivo } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "700", "800"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Rentzo — Rental Akun Mobile Legends",
  description:
    "Sewa akun Mobile Legends full skin dan rank tinggi mulai Rp1.500 per jam. Pilih akun, chat admin, langsung main.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${bricolage.variable} ${archivo.variable}`}>
      <body className="font-body bg-paper text-ink antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
