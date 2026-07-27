import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { AdminProvider } from "@/components/admin/AdminProvider";
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
        {/* Wraps the page so any section can drop in an EDIT button, and so
            the admin session survives navigation. The bar itself is rendered
            by the page, down in the footer. */}
        <AdminProvider>{children}</AdminProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
