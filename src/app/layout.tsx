import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "@/providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
    <html lang="en" className={`${dmSans.variable} font-sans`}>
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <Providers>
          {children}
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
