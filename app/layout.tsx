import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://america1st.org'),
  title: {
    default: "America First - Civic Education & Advocacy",
    template: "%s | America First",
  },
  description: "Independent 501(c)(4) civic education and advocacy organization committed to restoring logical reasoning, fairness, and principled decision-making from an America-First perspective.",
  keywords: [
    "civic education",
    "america first",
    "nonpartisan",
    "advocacy",
    "logical reasoning",
    "civic engagement",
    "volunteer opportunities",
    "constitutional education",
    "civic resources",
  ],
  authors: [{ name: "America First" }],
  creator: "America First",
  publisher: "America First",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://america1st.org",
    siteName: "America First",
    title: "America First - Civic Education & Advocacy",
    description: "Independent civic education and advocacy organization committed to restoring logical reasoning and principled decision-making.",
    images: [
      {
        url: "/logo-dark.png",
        width: 1200,
        height: 630,
        alt: "America First Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "America First - Civic Education & Advocacy",
    description: "Independent civic education and advocacy organization committed to restoring logical reasoning and principled decision-making.",
    images: ["/logo-dark.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
