import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { GA_TRACKING_ID } from '@/lib/gtag';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Email Canvas',
  description: 'Create beautiful email templates with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 