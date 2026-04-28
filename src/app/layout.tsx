import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Bolt-NFT's | Next-Gen NFT Protocol on Stellar",
  description: "High-fidelity protocol for minting, trading, and managing NFTs on Stellar with automated royalty distribution.",
  keywords: ["NFT", "Stellar", "Soroban", "Marketplace", "Web3", "Blockchain", "Royalties"],
  authors: [{ name: "Bolt-NFT's Protocol Team" }],
  openGraph: {
    title: "Bolt-NFT's | Next-Gen NFT Protocol",
    description: "High-fidelity protocol for minting and trading NFTs on Stellar.",
    url: "https://fancy-marshmallow-9f45bb.netlify.app/",
    siteName: "Bolt-NFT's",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolt-NFT's | Next-Gen NFT Protocol",
    description: "High-fidelity protocol for minting and trading NFTs on Stellar.",
  },
};

import { StellarProvider } from "@/context/StellarContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import { ToastProvider } from "@/components/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className={`${outfit.variable} ${dmSans.variable} font-dm-sans bg-primary`}>
        <StellarProvider>
          <ToastProvider>
            <Background />
            <Navbar />
            <main className="pt-32">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </StellarProvider>
      </body>
    </html>
  );
}
