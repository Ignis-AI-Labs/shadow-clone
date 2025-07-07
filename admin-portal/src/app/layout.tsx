import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SimpleProviders } from './simple-providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ignis Labs Admin Portal',
  description: 'Centralized admin dashboard for Shadow Clone and Ignis Labs',
  other: {
    'build-version': '0.2.0-no-rainbowkit',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SimpleProviders>{children}</SimpleProviders>
      </body>
    </html>
  );
}