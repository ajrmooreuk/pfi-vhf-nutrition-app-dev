import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--ds-font-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VHF Nutrition Coaching",
  description:
    "Professional nutrition coaching platform — meal plans, recipes, and client management powered by Viridian Health & Fitness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ptSans.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
