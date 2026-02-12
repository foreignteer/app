import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/CookieConsent";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Foreignteer - Micro-Volunteering Made Easy",
  description: "Connect with meaningful volunteering experiences worldwide. Join Foreignteer to discover and book micro-volunteering opportunities that make a difference.",
  keywords: "volunteering, micro-volunteering, NGO, volunteer abroad, social impact, community service",
  metadataBase: new URL('https://foreignteer.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#21B3B1',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'Foreignteer',
    title: 'Foreignteer - Micro-Volunteering Made Easy',
    description: 'Connect with meaningful volunteering experiences worldwide',
    url: 'https://foreignteer.com',
    images: [{
      url: '/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Foreignteer - Volunteering Opportunities Worldwide',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foreignteer - Micro-Volunteering Made Easy',
    description: 'Connect with meaningful volunteering experiences worldwide',
    images: ['/images/twitter-image.jpg'],
  },
  appleWebApp: {
    capable: true,
    title: 'Foreignteer',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${lato.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Foreignteer',
              url: 'https://foreignteer.com',
              logo: 'https://foreignteer.com/images/foreignteer-logo.png',
              description: 'Micro-volunteering platform connecting travellers with local causes',
              sameAs: [
                'https://www.facebook.com/foreignteer',
                'https://www.instagram.com/foreignteer/',
                'https://www.linkedin.com/company/foreignteer',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'info@foreignteer.com',
              },
            }),
          }}
        />
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
