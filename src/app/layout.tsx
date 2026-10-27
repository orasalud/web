import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const title = "Orasalud · Enfermera a domicilio en San Bernardo";
const description =
  "Enfermeras con experiencia y registro en la Superintendencia de Salud. Después de cada visita, le enviamos un reporte a la familia.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CL" className={figtree.variable}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
