import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import { BackgroundFx } from "@/components/background-fx";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/content";
import "./globals.css";

/** Archivo with its width axis → expanded automotive display cuts via font-stretch. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  applicationName: "RDP.",
  authors: [{ name: site.fullName }],
  keywords: ["creative developer", "three.js", "webgl", "unity", "blender", "portfolio", "Indonesia"],
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${archivo.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-dvh bg-ink text-fg">
        <a
          href="#main"
          className="text-meta fixed left-4 top-4 z-[200] -translate-y-24 bg-fg px-4 py-3 text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
        <BackgroundFx />
      </body>
    </html>
  );
}
