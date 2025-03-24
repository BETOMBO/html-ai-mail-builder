import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import GoogleAnalytics from './components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
  description: 'Generate stunning HTML emails with AI. The best AI email builder for creating responsive email templates, newsletters, and marketing emails. Create professional email designs instantly with our automated email design generator.',
  keywords: 'AI email generator, generate HTML email with AI, AI newsletter creator, responsive email builder online, AI email template generator, create marketing email with AI, AI email design tool, automated email design generator, best AI email builder, HTML email AI tool',
  openGraph: {
    title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
    description: 'Generate stunning HTML emails with AI. The best AI email builder for creating responsive email templates, newsletters, and marketing emails.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
    description: 'Generate stunning HTML emails with AI. The best AI email builder for creating responsive email templates, newsletters, and marketing emails.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <head>
    
      </head>
      <body className={`${inter.className} h-full`}>
        <Providers>
          <GoogleAnalytics />
          {children}
        </Providers>
      </body>
    </html>
  );
} 