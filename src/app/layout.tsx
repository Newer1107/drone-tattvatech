import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation/Navigation";
import { Footer } from "@/components/footer/Footer";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { NoiseOverlay } from "@/components/shared/NoiseOverlay";
import { PlayfulDrone } from "@/components/shared/PlayfulDrone";
import { LoadingGate } from "@/components/shared/LoadingGate";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tattva Tech — Build the Future",
  description:
    "Learn. Build. Fly. Innovate. Master the precision of aerospace engineering and drone telemetry at Tattva Tech Innovation Lab.",
  keywords: [
    "drone school",
    "aerospace engineering",
    "drone building",
    "flight academy",
    "STEM education",
    "Tattva Tech",
  ],
  openGraph: {
    title: "Tattva Tech — Build the Future",
    description:
      "Master the precision of aerospace engineering and drone telemetry.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LoadingGate>
          <CustomCursor />
          <NoiseOverlay />
          <SmoothScroll>
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScroll>
          <PlayfulDrone />
        </LoadingGate>
      </body>
    </html>
  );
}
