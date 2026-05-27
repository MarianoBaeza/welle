import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { PayPalProvider } from '@/components/PayPalProvider';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Welle — Sound Libraries for Creators',
  description: 'Premium sound libraries designed for content creators. ASMR, editing effects, and streaming sounds.',
  openGraph: {
    title: 'Welle — Sound Libraries for Creators',
    description: 'Premium sound libraries designed for content creators. ASMR, editing effects, and streaming sounds.',
    url: 'https://welle-pink.vercel.app',
    siteName: 'Welle',
    images: [
      {
        url: 'https://welle-pink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Welle — Sound Libraries for Creators',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welle — Sound Libraries for Creators',
    description: 'Premium sound libraries designed for content creators. ASMR, editing effects, and streaming sounds.',
    images: ['https://welle-pink.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col">
          <PayPalProvider>{children}</PayPalProvider>
        </body>
    </html>
  );
}
