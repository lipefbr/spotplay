import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoundFlow - Sua música, sem limites",
  description: "Plataforma de streaming de música com milhões de músicas, podcasts e lives. Ouça sem limites com o SoundFlow Premium.",
  keywords: ["SoundFlow", "streaming", "música", "podcasts", "lives", "Premium", "BR"],
  authors: [{ name: "SoundFlow" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "SoundFlow - Sua música, sem limites",
    description: "Ouça milhões de músicas, podcasts e transmissões ao vivo",
    siteName: "SoundFlow",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-gray-950 text-white font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
