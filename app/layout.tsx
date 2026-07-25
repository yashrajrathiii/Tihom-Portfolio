import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tihom — DJ & Producer",
  description:
    "Selector and producer moving crowds through late-night house, hypnotic techno and everything that makes a room breathe as one.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
