import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14B8A6",
};

export const metadata: Metadata = {
  title: "LifeDispatch | Emergency Response & Fleet Operations",
  description:
    "Next-generation emergency medical dispatch platform delivering real-time incident coordination, intelligent ambulance routing, and multi-facility hospital bed diversion management.",
  icons: {
    icon: "/lifedispatch-favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="min-h-screen bg-background text-text-primary antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
