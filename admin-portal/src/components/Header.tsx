'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-ignis-card border-b border-ignis-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-ignis-green">
              🔐 Ignis Labs Admin
            </h1>
          </Link>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}