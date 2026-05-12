import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // 1. TUKAR TAJUK BROWSER DI SINI
  title: "SISTEM BAHASA | BAHASA MELAYU", 
  description: "Portal Pembelajaran Interaktif Bahasa Melayu",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  // 2. SETKAN FAVICON KE GAMBAR LOGO PWA CIKGU
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SISTEM BAHASA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        {children}
        {/* Daftarkan Service Worker untuk Caching Imej */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker pendaftaran berjaya!');
                  }, function(err) {
                    console.log('ServiceWorker pendaftaran gagal: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}