/**
 * Root Layout - Japanese Learning App
 * Global layout với theme support và navigation
 */

import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

// Global metadata
export const metadata: Metadata = {
  title: {
    default: "Japanese Learning App",
    template: "%s | Japanese Learning App",
  },
  description: "Ứng dụng học tiếng Nhật chuyên về chuyển đổi thể lịch sự sang thể thường",
  keywords: ["học tiếng nhật", "japanese learning", "ngữ pháp", "N5"],
  authors: [{ name: "Japanese Learning App Team" }],
  creator: "Japanese Learning App",
  metadataBase: new URL("https://japanese-learning-app.vercel.app"),
};

/**
 * Root Layout Component
 * Provides global styling, fonts, and theme support
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${notoSansJP.variable}`}>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="font-inter antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div id="main-content" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
