import type { Metadata } from "next";
import { Inter, Noto_Serif, Fira_Code } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Costa Library Management System",
  description: "A premium, neo-academic library experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSerif.variable} ${firaCode.variable} h-full antialiased bg-background text-on-background`}
    >
      <body className="min-h-full flex bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
