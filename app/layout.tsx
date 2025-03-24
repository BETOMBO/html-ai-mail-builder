import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import GoogleAnalytics from './components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
  description: 'Generate responsive HTML emails with AI. The best AI email builder for creating marketing emails, newsletters, and email templates. Automated email design generator with AI-powered features.',
  keywords: 'AI email generator, generate HTML email with AI, AI newsletter creator, responsive email builder online, AI email template generator, create marketing email with AI, AI email design tool, automated email design generator, best AI email builder, HTML email AI tool',
  openGraph: {
    title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
    description: 'Generate responsive HTML emails with AI. The best AI email builder for creating marketing emails, newsletters, and email templates.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
    description: 'Generate responsive HTML emails with AI. The best AI email builder for creating marketing emails, newsletters, and email templates.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://html-generator-ai.vercel.app" />
      </head>
      <body className={inter.className}>
        <Providers>
          <GoogleAnalytics />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
} 