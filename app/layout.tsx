import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import GoogleAnalytics from './components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
  description: 'Generate professional HTML emails instantly with AI. Create responsive email templates, newsletters, and marketing emails. The best AI-powered email builder for creating stunning email designs.',
  keywords: [
    'AI email generator',
    'HTML email with AI',
    'AI newsletter creator',
    'responsive email builder',
    'AI email template generator',
    'marketing email with AI',
    'AI email design tool',
    'automated email design',
    'best AI email builder',
    'HTML email AI tool'
  ],
  openGraph: {
    title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
    description: 'Generate professional HTML emails instantly with AI. Create responsive email templates, newsletters, and marketing emails. The best AI-powered email builder for creating stunning email designs.',
    type: 'website',
    locale: 'en_US',
    url: 'www.htmlemailgen.com',
    siteName: 'AI Email Generator',
    images: [
      {
        url: 'www.htmlemailgen.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Email Generator - Create Beautiful HTML Emails with AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Email Generator | Create Beautiful HTML Emails with AI',
    description: 'Generate professional HTML emails instantly with AI. Create responsive email templates, newsletters, and marketing emails. The best AI-powered email builder for creating stunning email designs.',
    images: ['/og-image.png'],
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