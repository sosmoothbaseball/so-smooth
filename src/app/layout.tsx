import type { Metadata } from "next";
import { Bebas_Neue, Inter, Kaushan_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const kaushan = Kaushan_Script({
  variable: "--font-kaushan",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "So Smooth | Youth Baseball Program",
  description:
    "So Smooth is a year-round youth baseball program built on development, discipline, and team. Training, teams, gear, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} ${kaushan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bone text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
